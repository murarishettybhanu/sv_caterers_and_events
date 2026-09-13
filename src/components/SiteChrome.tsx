import { Link } from "@tanstack/react-router";
import { useState } from "react";

export const BUSINESS = {
  name: "SV Caterers and Events",
  tagline: "Traditional Telugu & Hyderabadi catering, cooked fresh on site.",
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
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="leading-tight">
          <span className="block font-[family-name:var(--font-display)] text-lg font-semibold text-primary">
            SV Caterers
          </span>
          <span className="eyebrow">and Events</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/contact" className="btn-primary hover:btn-primary-hover">
            Get a quote
          </Link>
        </nav>

        <button
          className="rounded-md border border-border px-3 py-2 text-sm md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          Menu
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-5 pb-4 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="py-2 text-sm font-medium text-muted-foreground"
              activeProps={{ className: "text-primary" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:grid-cols-3">
        <div>
          <h3 className="text-lg text-primary">{BUSINESS.name}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{BUSINESS.tagline}</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="eyebrow">Where to find us</p>
          <p className="mt-2">{BUSINESS.address}</p>
          <p className="mt-2">{BUSINESS.hours}</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="eyebrow">Pages</p>
          <ul className="mt-2 space-y-1">
            {NAV.map((i) => (
              <li key={i.to}>
                <Link to={i.to} className="hover:text-primary">
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} {BUSINESS.name}. Serving Hyderabad since 2009.
      </div>
    </footer>
  );
}
