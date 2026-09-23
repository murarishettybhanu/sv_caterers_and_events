import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";

import { BUSINESS } from "@/components/SiteChrome";
import { categoriesFor, categoryItems, type Diet, type MenuCategory } from "@/data/menu";
import { buildQuotePdf, type QuoteMeta, type QuoteSelection } from "@/lib/quote-pdf";

export const Route = createFileRoute("/quote")({
  head: () => ({
    meta: [
      { title: "Build Your Menu & Get a Quote | SV Caterers and Events" },
      {
        name: "description",
        content:
          "Pick your dishes category by category — starters, entrées, rice, breads, sweets and more — and download the menu as a PDF for your catering quote.",
      },
      { property: "og:title", content: "Build your catering menu | SV Caterers and Events" },
      {
        property: "og:description",
        content: "Choose dishes category by category and download your menu as a PDF.",
      },
    ],
  }),
  component: QuoteBuilder,
});

const STORAGE_KEY = "sv-quote-draft-v1";
/** Indian mobile numbers, with or without +91 and separators. */
const PHONE_OK = /^(\+?91[\s-]?)?[6-9]\d{9}$/;
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Draft = { diet: Diet | null; selected: Record<string, string[]>; step: number };

function loadDraft(): Draft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Draft) : null;
  } catch {
    return null;
  }
}

function saveDraft(draft: Draft) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // storage blocked (private window) — the draft just won't survive a reload
  }
}

function QuoteBuilder() {
  const [diet, setDiet] = useState<Diet | null>(null);
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  // 0 = choose veg/non-veg, 1..n = one category per step, n+1 = review
  const [step, setStep] = useState(0);
  const [filter, setFilter] = useState("");
  const [meta, setMeta] = useState<Omit<QuoteMeta, "diet">>({});
  const [pdf, setPdf] = useState<{ url: string; filename: string } | null>(null);
  const [building, setBuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  // Set when a category is opened with "Edit" from the review page, so finishing
  // that category goes straight back to the review instead of walking forward
  // through every remaining category again.
  const [editingFromReview, setEditingFromReview] = useState(false);
  const restored = useRef(false);

  const categories = useMemo(() => (diet ? categoriesFor(diet) : []), [diet]);
  const category: MenuCategory | undefined = categories[step - 1];
  const onReview = diet !== null && step === categories.length + 1;

  useEffect(() => {
    const draft = loadDraft();
    restored.current = true;
    if (!draft?.diet) return;
    setDiet(draft.diet);
    setSelected(draft.selected ?? {});
    setStep(draft.step ?? 0);
  }, []);

  useEffect(() => {
    if (!restored.current) return;
    saveDraft({ diet, selected, step });
  }, [diet, selected, step]);

  useEffect(() => {
    setFilter("");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // A new selection invalidates any PDF already generated from the old one.
  useEffect(() => {
    setSubmitted(false);
    setPdf((current) => {
      if (current) URL.revokeObjectURL(current.url);
      return null;
    });
  }, [selected, diet]);

  useEffect(() => {
    return () => {
      if (pdf) URL.revokeObjectURL(pdf.url);
    };
  }, [pdf]);

  const totalSelected = Object.values(selected).reduce((sum, items) => sum + items.length, 0);

  function toggleItem(categoryId: string, item: string) {
    setSelected((current) => {
      const items = current[categoryId] ?? [];
      const next = items.includes(item) ? items.filter((i) => i !== item) : [...items, item];
      if (next.length === 0) {
        const { [categoryId]: _removed, ...rest } = current;
        return rest;
      }
      return { ...current, [categoryId]: next };
    });
  }

  function chooseDiet(next: Diet) {
    setDiet(next);
    setSelected({});
    setStep(1);
  }

  function restart() {
    setDiet(null);
    setSelected({});
    setMeta({});
    setStep(0);
    setError(null);
    setSubmitted(false);
    setEditingFromReview(false);
  }

  const reviewStep = categories.length + 1;

  function goToReview() {
    setEditingFromReview(false);
    setStep(reviewStep);
  }

  function jumpTo(index: number) {
    setEditingFromReview(false);
    setStep(index + 1);
  }

  function buildSelection(): QuoteSelection {
    return categories
      .map((category) => {
        const picked = selected[category.id] ?? [];
        const multiSection = category.sections.length > 1;
        const groups = category.sections
          .map((section) => ({
            label: multiSection ? section.label : null,
            items: section.items.filter((item) => picked.includes(item)),
          }))
          .filter((group) => group.items.length > 0);
        return { category: category.title, groups };
      })
      .filter((entry) => entry.groups.length > 0);
  }

  async function createPdf(): Promise<{ url: string; filename: string } | null> {
    if (!diet) return null;
    if (pdf) return pdf;
    setBuilding(true);
    setError(null);
    try {
      const built = await buildQuotePdf(buildSelection(), { diet, ...meta });
      const next = { url: built.url, filename: built.filename };
      setPdf(next);
      return next;
    } catch (err) {
      console.error(err);
      setError("The menu PDF could not be generated. Please try again.");
      return null;
    } finally {
      setBuilding(false);
    }
  }

  async function downloadPdf() {
    const built = await createPdf();
    if (!built) return;
    setSubmitted(true);
    const link = document.createElement("a");
    link.href = built.url;
    link.download = built.filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  if (diet === null) {
    return (
      <main className="container-page py-12 sm:py-16">
        <p className="eyebrow">Get a quote</p>
        <h1 className="mt-2 text-4xl text-primary">Build your menu</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Pick dishes category by category — skip anything you don't need. At the end you'll get a
          PDF of your menu to download and share with us.
        </p>

        <h2 className="mt-12 text-xl text-primary">First, what are you serving?</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <DietCard
            title="Pure Veg"
            description="Vegetarian menu only — starters, paneer and seasonal entrées, rice, breads, sweets and counters."
            onClick={() => chooseDiet("veg")}
          />
          <DietCard
            title="Veg & Non-Veg"
            description="Chicken, mutton and fish sections first, followed by the full vegetarian menu for the rest of the buffet."
            onClick={() => chooseDiet("nonveg")}
          />
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          Prefer to talk it through?{" "}
          <Link to="/contact" className="text-primary underline underline-offset-4">
            Send an enquiry instead
          </Link>
          .
        </p>
      </main>
    );
  }

  const progress = Math.round(
    ((onReview ? categories.length : step - 1) / categories.length) * 100,
  );

  return (
    <main className="container-page py-8 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">{diet === "veg" ? "Pure veg menu" : "Veg & non-veg menu"}</p>
          <h1 className="mt-1 text-3xl text-primary">
            {onReview ? "Review your menu" : category?.title}
          </h1>
        </div>
        <button onClick={restart} className="btn btn-ghost btn-sm">
          Start over
        </button>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span aria-live="polite">
            {onReview ? "Final step" : `Step ${step} of ${categories.length}`} · {totalSelected}{" "}
            item{totalSelected === 1 ? "" : "s"} selected
          </span>
          <span aria-hidden>{progress}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="Menu progress"
          className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary"
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-300"
            style={{ width: `${Math.max(progress, 2)}%` }}
          />
        </div>
      </div>

      <div className="mt-6 lg:grid lg:grid-cols-[236px_1fr] lg:gap-10">
        <CategoryNav
          categories={categories}
          selected={selected}
          currentIndex={onReview ? -1 : step - 1}
          onReview={onReview}
          onJump={jumpTo}
          onGoToReview={goToReview}
          totalSelected={totalSelected}
        />
        <div>
          {onReview ? (
            <ReviewStep
              selection={buildSelection()}
              categories={categories}
              selected={selected}
              meta={meta}
              onMetaChange={setMeta}
              onEdit={(categoryId) => {
                const index = categories.findIndex((c) => c.id === categoryId);
                if (index >= 0) {
                  setEditingFromReview(true);
                  setStep(index + 1);
                }
              }}
              onRemove={toggleItem}
              onBack={() => setStep(categories.length)}
              onDownload={downloadPdf}
              building={building}
              error={error}
              pdf={pdf}
              submitted={submitted}
            />
          ) : (
            category && (
              <CategoryStep
                category={category}
                selectedItems={selected[category.id] ?? []}
                filter={filter}
                onFilterChange={setFilter}
                onToggle={(item) => toggleItem(category.id, item)}
                onBack={() => (editingFromReview ? goToReview() : setStep(step - 1))}
                onNext={() => (editingFromReview ? goToReview() : setStep(step + 1))}
                isLast={step === categories.length}
                editing={editingFromReview}
              />
            )
          )}
        </div>
      </div>
    </main>
  );
}

/**
 * Lets someone on step 21 jump straight back to "Sweets" without paging through
 * everything in between — the list always shows category names and how many
 * items are picked in each.
 */
function CategoryNav({
  categories,
  selected,
  currentIndex,
  onReview,
  onJump,
  onGoToReview,
  totalSelected,
}: {
  categories: MenuCategory[];
  selected: Record<string, string[]>;
  currentIndex: number;
  onReview: boolean;
  onJump: (index: number) => void;
  onGoToReview: () => void;
  totalSelected: number;
}) {
  const list = (onClick: (index: number) => void) => (
    <ol className="space-y-0.5">
      {categories.map((category, index) => {
        const count = (selected[category.id] ?? []).length;
        const isCurrent = index === currentIndex;
        return (
          <li key={category.id}>
            <button
              onClick={() => onClick(index)}
              aria-current={isCurrent ? "step" : undefined}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
                isCurrent
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              <span className="w-5 shrink-0 text-xs tabular-nums opacity-60">{index + 1}</span>
              <span className="flex-1 truncate">{category.title}</span>
              {count > 0 && (
                <span className="shrink-0 rounded-full bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground">
                  {count}
                </span>
              )}
            </button>
          </li>
        );
      })}
      <li className="pt-1">
        <button
          onClick={onGoToReview}
          aria-current={onReview ? "step" : undefined}
          className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm transition-colors ${
            onReview
              ? "bg-primary/10 font-semibold text-primary"
              : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
          }`}
        >
          <span className="w-5 shrink-0 text-xs opacity-60">✓</span>
          <span className="flex-1">Review & confirm</span>
          {totalSelected > 0 && (
            <span className="shrink-0 rounded-full bg-accent px-1.5 py-0.5 text-[11px] font-semibold text-accent-foreground">
              {totalSelected}
            </span>
          )}
        </button>
      </li>
    </ol>
  );

  return (
    <>
      <details className="group mb-6 rounded-xl border border-border bg-card shadow-[var(--shadow-xs)] lg:hidden">
        <summary className="flex min-h-[2.75rem] cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold text-primary">
          <span>
            {onReview
              ? "Review & confirm"
              : `${currentIndex + 1}. ${categories[currentIndex]?.title ?? "Jump to a category"}`}
          </span>
          <span
            aria-hidden
            className="text-muted-foreground transition-transform group-open:rotate-180"
          >
            ▾
          </span>
        </summary>
        <div className="max-h-80 overflow-y-auto border-t border-border p-2">
          {list((index) => onJump(index))}
        </div>
      </details>

      <nav
        aria-label="Menu categories"
        className="hidden lg:sticky lg:top-6 lg:block lg:self-start"
      >
        <p className="eyebrow mb-3">Categories</p>
        <div className="max-h-[70vh] overflow-y-auto pr-1">{list(onJump)}</div>
      </nav>
    </>
  );
}

function DietCard({
  title,
  description,
  onClick,
}: {
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="surface-card group p-7 text-left transition-transform hover:-translate-y-1"
    >
      <h3 className="card-title text-xl">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-foreground">
        Start with this
        <span aria-hidden className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </span>
    </button>
  );
}

function CategoryStep({
  category,
  selectedItems,
  filter,
  onFilterChange,
  onToggle,
  onBack,
  onNext,
  isLast,
  editing,
}: {
  category: MenuCategory;
  selectedItems: string[];
  filter: string;
  onFilterChange: (value: string) => void;
  onToggle: (item: string) => void;
  onBack: () => void;
  onNext: () => void;
  isLast: boolean;
  editing: boolean;
}) {
  const query = filter.trim().toLowerCase();
  const sections = category.sections
    .map((section) => ({
      ...section,
      items: query
        ? section.items.filter((item) => item.toLowerCase().includes(query))
        : section.items,
    }))
    .filter((section) => section.items.length > 0);
  const totalItems = categoryItems(category).length;
  const showLabels = category.sections.length > 1;

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-xl text-sm text-muted-foreground">{category.blurb}</p>
        {totalItems > 12 && (
          <input
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            placeholder={`Search ${category.title.toLowerCase()}`}
            aria-label={`Search within ${category.title}`}
            className="field sm:w-64"
          />
        )}
      </div>

      {sections.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">
          Nothing matches "{filter}" in this category.
        </p>
      ) : (
        <div className="mt-6 space-y-8">
          {sections.map((section) => (
            <div key={section.label}>
              {showLabels && (
                <div className="mb-3 flex items-center gap-3">
                  <span
                    aria-hidden
                    className={`h-3 w-3 rounded-sm border ${
                      section.diet === "nonveg"
                        ? "border-destructive bg-destructive/20"
                        : "border-emerald-700 bg-emerald-600/20"
                    }`}
                  />
                  <h2 className="text-sm font-semibold tracking-wide text-foreground">
                    {section.label}
                  </h2>
                  <span className="h-px flex-1 bg-border" />
                </div>
              )}
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item) => {
                  const isSelected = selectedItems.includes(item);
                  return (
                    <li key={item}>
                      <button
                        onClick={() => onToggle(item)}
                        aria-pressed={isSelected}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                          isSelected
                            ? "border-primary bg-primary/5 font-semibold text-primary"
                            : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-secondary/40"
                        }`}
                      >
                        <span>{item}</span>
                        <span
                          aria-hidden
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] ${
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Pinned so Back/Next stay reachable in a 45-item category without scrolling. */}
      <div className="sticky bottom-0 z-30 -mx-5 mt-10 border-t border-border bg-background/95 px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="btn btn-outline">
            {editing ? "Cancel" : "Back"}
          </button>
          <button onClick={onNext} className="btn btn-primary flex-1 sm:flex-none">
            {editing
              ? "Done · back to confirmation"
              : selectedItems.length === 0
                ? "Skip this category"
                : isLast
                  ? `Review ${selectedItems.length} selected`
                  : `Next · ${selectedItems.length} selected`}
          </button>
          <span className="hidden text-sm text-muted-foreground lg:inline">
            {editing
              ? "Changes are saved as you tap."
              : "Not serving anything from here? Just skip it."}
          </span>
        </div>
      </div>
    </section>
  );
}

function ReviewStep({
  selection,
  categories,
  selected,
  meta,
  onMetaChange,
  onEdit,
  onRemove,
  onBack,
  onDownload,
  building,
  error,
  pdf,
  submitted,
}: {
  selection: QuoteSelection;
  categories: MenuCategory[];
  selected: Record<string, string[]>;
  meta: Omit<QuoteMeta, "diet">;
  onMetaChange: (meta: Omit<QuoteMeta, "diet">) => void;
  onEdit: (categoryId: string) => void;
  onRemove: (categoryId: string, item: string) => void;
  onBack: () => void;
  onDownload: () => void;
  building: boolean;
  error: string | null;
  pdf: { url: string; filename: string } | null;
  submitted: boolean;
}) {
  const chosen = categories.filter((c) => (selected[c.id] ?? []).length > 0);
  const total = selection.reduce(
    (sum, entry) => sum + entry.groups.reduce((n, group) => n + group.items.length, 0),
    0,
  );
  const email = (meta.email ?? "").trim();
  // Email is optional, but anything typed has to be valid — it goes on the PDF.
  const emailUsable = email.length === 0 || EMAIL_OK.test(email);
  const detailsComplete =
    (meta.name ?? "").trim().length >= 2 &&
    PHONE_OK.test(meta.phone ?? "") &&
    (meta.eventDate ?? "").length > 0 &&
    Number(meta.guests ?? 0) > 0 &&
    emailUsable;

  if (total === 0) {
    return (
      <section className="mt-10 surface-card p-8 text-center">
        <h2 className="card-title text-xl">Nothing selected yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Go back through the categories and pick the dishes you'd like on the buffet.
        </p>
        <button onClick={onBack} className="btn btn-primary mt-6">
          Back to the menu
        </button>
      </section>
    );
  }

  return (
    <section className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <div>
        <p className="text-sm text-muted-foreground">
          {total} item{total === 1 ? "" : "s"} across {chosen.length} categor
          {chosen.length === 1 ? "y" : "ies"}. Remove anything you've changed your mind about.
        </p>

        <div className="mt-6 space-y-6">
          {chosen.map((category) => (
            <div key={category.id} className="surface-card p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="card-title text-lg">{category.title}</h2>
                <button
                  onClick={() => onEdit(category.id)}
                  className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
                >
                  Edit
                </button>
              </div>
              {category.sections
                .map((section) => ({
                  label: category.sections.length > 1 ? section.label : null,
                  items: section.items.filter((item) =>
                    (selected[category.id] ?? []).includes(item),
                  ),
                }))
                .filter((group) => group.items.length > 0)
                .map((group) => (
                  <div key={group.label ?? "all"} className="mt-3">
                    {group.label && (
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {group.label}
                      </p>
                    )}
                    <ul className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li key={item}>
                          <button
                            onClick={() => onRemove(category.id, item)}
                            className="group inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-sm hover:border-destructive/50"
                            aria-label={`Remove ${item}`}
                          >
                            {item}
                            <span
                              aria-hidden
                              className="text-muted-foreground group-hover:text-destructive"
                            >
                              ×
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          ))}
        </div>

        <button onClick={onBack} className="btn btn-outline mt-6">
          Back to categories
        </button>
      </div>

      <div className="space-y-5">
        <div className="surface-card p-6">
          <h2 className="card-title text-lg">Your details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We need these to price the menu — they also appear on your PDF.
          </p>
          <div className="mt-4 space-y-3">
            <MetaField
              label="Name"
              value={meta.name ?? ""}
              onChange={(name) => onMetaChange({ ...meta, name })}
            />
            <MetaField
              label="Phone"
              type="tel"
              value={meta.phone ?? ""}
              onChange={(phone) => onMetaChange({ ...meta, phone })}
              hint={
                (meta.phone ?? "").length > 0 && !PHONE_OK.test(meta.phone ?? "")
                  ? "Enter a 10-digit mobile number"
                  : undefined
              }
            />
            <MetaField
              label="Email (optional)"
              type="email"
              value={meta.email ?? ""}
              onChange={(value) => onMetaChange({ ...meta, email: value })}
              hint={emailUsable ? undefined : "Enter a valid email address"}
            />
            <MetaField
              label="Event date"
              type="date"
              value={meta.eventDate ?? ""}
              onChange={(eventDate) => onMetaChange({ ...meta, eventDate })}
            />
            <MetaField
              label="Guests"
              type="number"
              value={meta.guests ?? ""}
              onChange={(guests) => onMetaChange({ ...meta, guests })}
            />
          </div>
        </div>

        <div className="surface-card p-6">
          <h2 className="card-title text-lg">Confirm your menu</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your PDF lists the dishes and categories you picked. Rates follow once we confirm the
            date, venue and guest count.
          </p>

          <button
            onClick={onDownload}
            disabled={!detailsComplete || building}
            className="btn btn-primary btn-block mt-4"
          >
            {building ? "Preparing your menu…" : "Confirm & download PDF"}
          </button>

          {!detailsComplete && (
            <p className="mt-3 text-sm text-muted-foreground">
              Add your name, phone number, event date and guest count to enable this. Email is
              optional.
            </p>
          )}
          {error && (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div aria-live="polite">
            {submitted && pdf && (
              <div className="mt-5 rounded-xl border border-[var(--color-success)]/40 bg-[var(--color-success)]/10 p-4">
                <p className="text-sm font-semibold text-foreground">
                  Menu confirmed — the PDF has been downloaded.
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Send it to us on{" "}
                  <a href={BUSINESS.phoneHref} className="font-medium text-primary hover:underline">
                    {BUSINESS.phone}
                  </a>{" "}
                  or{" "}
                  <a
                    href={`mailto:${BUSINESS.email}?subject=Catering%20menu%20enquiry`}
                    className="font-medium text-primary hover:underline"
                  >
                    {BUSINESS.email}
                  </a>
                  .
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <a
                    href={BUSINESS.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    Send on WhatsApp
                  </a>
                  <a href={pdf.url} download={pdf.filename} className="btn btn-outline btn-sm">
                    Download again
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function MetaField({
  label,
  value,
  onChange,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  hint?: string | undefined;
}) {
  const id = `meta-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field"
      />
      {hint && <p className="mt-1 text-xs text-destructive">{hint}</p>}
    </div>
  );
}
