import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader, Section } from "@/components/Page";
import { BUSINESS } from "@/components/SiteChrome";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Enquiry | SV Caterers and Events, Hyderabad" },
      {
        name: "description",
        content:
          "Enquire about catering for your wedding, engagement or party in Hyderabad. SV Caterers and Events, Srinagar Colony, Amberpet. Open daily until 9 pm.",
      },
      { property: "og:title", content: "Contact SV Caterers and Events" },
      {
        property: "og:description",
        content: "Send your event date and guest count for a catering quote in Hyderabad.",
      },
    ],
  }),
  component: Contact,
});

type Fields = { name: string; phone: string; date: string; guests: string; details: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { name: "", phone: "", date: "", guests: "", details: "" };
const PHONE_OK = /^(\+?91[\s-]?)?[6-9]\d{9}$/;

function validate(values: Fields): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Please tell us your name.";
  if (!PHONE_OK.test(values.phone.trim()))
    errors.phone = "Enter a 10-digit mobile number so we can call you back.";
  if (!values.date) errors.date = "Which date is the function?";
  if (!values.guests || Number(values.guests) < 1) errors.guests = "Roughly how many guests?";
  return errors;
}

/** The enquiry has no backend, so it is handed to the customer's mail app or
 *  WhatsApp with everything already filled in. */
function composeMessage(values: Fields): string {
  return [
    `Name: ${values.name}`,
    `Phone: ${values.phone}`,
    `Event date: ${values.date}`,
    `Guests: ${values.guests}`,
    values.details ? `Details: ${values.details}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function Contact() {
  const [values, setValues] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  function update<K extends keyof Fields>(key: K, value: Fields[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const { [key]: _cleared, ...rest } = current;
      return rest;
    });
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = document.getElementById(`field-${Object.keys(found)[0]}`);
      first?.focus();
      return;
    }
    const body = encodeURIComponent(composeMessage(values));
    window.location.href = `mailto:${BUSINESS.email}?subject=${encodeURIComponent(
      `Catering enquiry — ${values.date}, ${values.guests} guests`,
    )}&body=${body}`;
    setSent(true);
  }

  return (
    <main>
      <PageHeader
        eyebrow="Contact"
        title="Let's plan your function"
        intro="Send your date and guest count and we will come back with a menu and a per-plate price. Prefer to talk? Call us — we answer until 9 pm."
        actions={
          <>
            <a href={BUSINESS.phoneHref} className="btn btn-primary">
              Call {BUSINESS.phone}
            </a>
            <a
              href={BUSINESS.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
            >
              WhatsApp us
            </a>
          </>
        }
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:gap-8">
          <section className="surface-card h-full p-6 sm:p-8" aria-labelledby="enquiry-heading">
            <h2 id="enquiry-heading" className="card-title text-lg">
              Enquiry form
            </h2>

            <div aria-live="polite">
              {sent && (
                <div className="mt-4 rounded-xl border border-[var(--color-success)]/40 bg-[var(--color-success)]/10 p-4 text-sm">
                  <p className="font-semibold text-foreground">
                    Your email app should have opened.
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    If nothing happened, send the same details to{" "}
                    <a
                      href={`mailto:${BUSINESS.email}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {BUSINESS.email}
                    </a>{" "}
                    or message us on{" "}
                    <a
                      href={`${BUSINESS.whatsappHref}?text=${encodeURIComponent(composeMessage(values))}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-primary hover:underline"
                    >
                      WhatsApp
                    </a>
                    .
                  </p>
                </div>
              )}
            </div>

            <form className="mt-6 space-y-5" onSubmit={onSubmit} noValidate>
              <Field
                name="name"
                label="Your name"
                value={values.name}
                error={errors.name}
                onChange={(v) => update("name", v)}
                autoComplete="name"
              />
              <Field
                name="phone"
                label="Phone number"
                type="tel"
                inputMode="tel"
                value={values.phone}
                error={errors.phone}
                onChange={(v) => update("phone", v)}
                autoComplete="tel"
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  name="date"
                  label="Event date"
                  type="date"
                  value={values.date}
                  error={errors.date}
                  onChange={(v) => update("date", v)}
                />
                <Field
                  name="guests"
                  label="Number of guests"
                  type="number"
                  inputMode="numeric"
                  value={values.guests}
                  error={errors.guests}
                  onChange={(v) => update("guests", v)}
                />
              </div>
              <div>
                <label htmlFor="field-details" className="field-label">
                  Event details{" "}
                  <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  id="field-details"
                  name="details"
                  rows={4}
                  value={values.details}
                  onChange={(e) => update("details", e.target.value)}
                  placeholder="Venue, veg or non-veg, anything special you have in mind"
                  className="field"
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button type="submit" className="btn btn-primary w-full sm:w-auto">
                  Send enquiry
                </button>
                <p className="text-sm text-muted-foreground">
                  Opens your mail app with the details filled in.
                </p>
              </div>
            </form>
          </section>

          <aside className="surface-card flex h-full flex-col p-6 sm:p-7">
            <h2 className="card-title text-lg">Talk to us directly</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="eyebrow">Phone</dt>
                <dd className="mt-1">
                  <a
                    href={BUSINESS.phoneHref}
                    className="tap-safe font-semibold text-primary hover:underline"
                  >
                    {BUSINESS.phone}
                  </a>
                  <p className="text-muted-foreground">{BUSINESS.hours}</p>
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Email</dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${BUSINESS.email}`}
                    className="tap-safe break-all font-medium text-primary hover:underline"
                  >
                    {BUSINESS.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="eyebrow">Kitchen</dt>
                <dd className="mt-1 text-muted-foreground">{BUSINESS.address}</dd>
              </div>
              <div>
                <dt className="eyebrow">Experience</dt>
                <dd className="mt-1 text-muted-foreground">
                  {BUSINESS.years} · Rated {BUSINESS.rating} by customers
                </dd>
              </div>
            </dl>
            <div className="mt-auto grid gap-3 pt-6">
              <a
                href={BUSINESS.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-block"
              >
                Message on WhatsApp
              </a>
              <Link to="/quote" className="btn btn-outline btn-block">
                Build your menu first
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-sm)]">
          <iframe
            title="Map showing SV Caterers and Events in Amberpet, Hyderabad"
            src="https://www.google.com/maps?q=Srinagar+Colony+Ramanthapur+Amberpet+Hyderabad+500013&output=embed"
            className="block h-72 w-full border-0 sm:h-80"
            loading="lazy"
          />
        </div>
      </Section>
    </main>
  );
}

function Field({
  name,
  label,
  value,
  onChange,
  error,
  type = "text",
  inputMode,
  autoComplete,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
  type?: string;
  inputMode?: "tel" | "numeric";
  autoComplete?: string;
}) {
  const id = `field-${name}`;
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        {...(inputMode ? { inputMode } : {})}
        {...(autoComplete ? { autoComplete } : {})}
        className="field"
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
