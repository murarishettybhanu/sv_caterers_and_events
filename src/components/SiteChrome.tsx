import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "@/assets/sv_logo_final.png";

export const BUSINESS = {
  name: "SV Caterers and Events",
  tagline: "Traditional Telugu & Hyderabadi catering, cooked fresh on site.",
  motto: "Good Food · Happy Moments",
  phone: "8885122815",
  phoneHref: "tel:+918885122815",
  whatsappHref: "https://wa.me/918885122815",
  email: "Svevents29@gmail.com",
  city: "Hyderabad",
  address:
    "3-3-5/87/A, Srinagar Colony, Near Hanuman Temple, Ramanthapur, Amberpet, Hyderabad - 500013, Telangana",
  area: "Amberpet, Hyderabad",
  hours: "Open daily until 9:00 pm",
  years: "16 years in business",
  rating: "5.0",
  ratingCount: "8",
};

const NAV = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

const QUOTE_LINK = { to: "/quote", label: "Build your menu" } as const;

/** The sample-menu page stays linked from the footer and in-page CTAs. */
const FOOTER_NAV = [
  ...NAV.slice(0, 2),
  { to: "/menu", label: "Sample menus" } as const,
  ...NAV.slice(2),
  QUOTE_LINK,
];

function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={`h-4 w-4 ${className}`} fill="currentColor">
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2Z" />
    </svg>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  // The mobile sheet is an overlay, so stop the page behind it from scrolling.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open || typeof window === "undefined") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-20">
        <Link to="/" className="flex items-center gap-3" aria-label={`${BUSINESS.name} — home`}>
          <img
            src={logo}
            alt=""
            width={500}
            height={500}
            className="h-10 w-10 shrink-0 object-contain sm:h-11 sm:w-11"
          />
          <span className="leading-tight">
            <span className="block font-[family-name:var(--font-display)] text-[1.0625rem] font-semibold text-primary sm:text-lg">
              SV Caterers
            </span>
            <span className="eyebrow tracking-[0.14em]">and Events</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-primary"
              activeProps={{ className: "text-primary bg-secondary/70" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a href={BUSINESS.phoneHref} className="btn btn-outline btn-sm">
            <PhoneIcon />
            {BUSINESS.phone}
          </a>
          <Link to="/quote" className="btn btn-primary btn-sm">
            Get a quote
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={BUSINESS.phoneHref}
            className="btn btn-outline px-4"
            aria-label={`Call ${BUSINESS.name}`}
          >
            <PhoneIcon />
            <span className="sr-only sm:not-sr-only">Call</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="btn btn-outline px-4"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-16 z-[45] bg-foreground/30 backdrop-blur-[2px] lg:hidden"
          />
          <nav
            id="mobile-nav"
            aria-label="Main"
            className="absolute inset-x-0 z-50 border-b border-border bg-background px-5 pb-6 shadow-lg lg:hidden"
          >
            <ul className="divide-y divide-border/70">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex min-h-[3rem] items-center text-base font-medium text-foreground"
                    activeProps={{ className: "text-primary" }}
                    activeOptions={{ exact: item.to === "/" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 grid gap-2">
              <Link
                to="/quote"
                onClick={() => setOpen(false)}
                className="btn btn-primary btn-block"
              >
                Build your menu
              </Link>
              <a href={BUSINESS.phoneHref} className="btn btn-outline btn-block">
                <PhoneIcon />
                Call {BUSINESS.phone}
              </a>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}

/** Thumb-reachable actions on phones, where the header CTA scrolls away. */
export function MobileActionBar() {
  return (
    <div className="sticky bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden">
      <div className="flex gap-2">
        <a href={BUSINESS.phoneHref} className="btn btn-outline flex-1">
          <PhoneIcon />
          Call us
        </a>
        <Link to="/quote" className="btn btn-primary flex-1">
          Build your menu
        </Link>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-secondary/40">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <img src={logo} alt="" width={500} height={500} className="h-14 w-14 object-contain" />
          <h2 className="mt-3 text-lg text-primary">{BUSINESS.name}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{BUSINESS.tagline}</p>
          <p className="mt-3 text-sm text-accent-foreground/80">{BUSINESS.motto}</p>
        </div>

        <div className="text-sm">
          <h2 className="eyebrow">Talk to us</h2>
          <ul className="mt-3 space-y-1">
            <li>
              <a
                href={BUSINESS.phoneHref}
                className="tap-safe font-medium text-primary hover:underline"
              >
                {BUSINESS.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${BUSINESS.email}`}
                className="tap-safe break-all text-muted-foreground hover:text-primary"
              >
                {BUSINESS.email}
              </a>
            </li>
            <li>
              <a
                href={BUSINESS.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="tap-safe text-muted-foreground hover:text-primary"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div className="text-sm text-muted-foreground">
          <h2 className="eyebrow">Where to find us</h2>
          <p className="mt-3">{BUSINESS.address}</p>
          <p className="mt-2">{BUSINESS.hours}</p>
        </div>

        <div className="text-sm">
          <h2 className="eyebrow">Pages</h2>
          <ul className="mt-3 space-y-0.5">
            {FOOTER_NAV.map((i) => (
              <li key={i.to}>
                <Link to={i.to} className="tap-safe text-muted-foreground hover:text-primary">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70 py-5">
        <p className="container-page text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {BUSINESS.name}. Serving Hyderabad since 2009.
        </p>
      </div>
    </footer>
  );
}
