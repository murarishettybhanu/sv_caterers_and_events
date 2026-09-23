import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-catering.jpg";
import biryaniImg from "@/assets/dish-biryani.jpg";
import eventImg from "@/assets/event-setup.jpg";
import counterImg from "@/assets/live-counter.jpg";
import { BUSINESS } from "@/components/SiteChrome";
import { Section, SectionHeading } from "@/components/Page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SV Caterers and Events | Wedding Catering in Amberpet, Hyderabad" },
      {
        name: "description",
        content:
          "Wedding, engagement and birthday catering in Hyderabad. Veg and non-veg menus cooked fresh on site by SV Caterers and Events, Amberpet. 16 years, rated 5.0.",
      },
      { property: "og:title", content: "SV Caterers and Events | Catering in Hyderabad" },
      {
        property: "og:description",
        content:
          "Traditional Telugu and Hyderabadi catering for weddings, engagements and birthdays in Hyderabad.",
      },
    ],
  }),
  component: Home,
});

const highlights = [
  { value: BUSINESS.rating, label: `Rating from ${BUSINESS.ratingCount} reviews` },
  { value: "16+", label: "Years catering in Hyderabad" },
  { value: "Veg & Non-Veg", label: "Full kitchen, both menus" },
  { value: "50–2000", label: "Guests per event" },
];

const services = [
  {
    title: "Wedding Catering",
    image: heroImg,
    text: "Multi-course sadhya and Hyderabadi wedding spreads, served hot from live counters with full serving staff.",
  },
  {
    title: "Engagement & Reception",
    image: eventImg,
    text: "Customised menus with elegant buffet setup, starters, mains and dessert stations for your special evening.",
  },
  {
    title: "Birthdays & House Parties",
    image: counterImg,
    text: "Chaat and tiffin counters, snacks, biryani and sweets — set up, served and cleaned up by our team.",
  },
];

function Home() {
  return (
    <main>
      <section className="relative isolate">
        <img
          src={heroImg}
          alt=""
          width={1920}
          height={1088}
          fetchPriority="high"
          className="h-[70vh] min-h-[28rem] w-full object-cover sm:h-[76vh]"
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex items-end">
          <div className="container-page pb-12 sm:pb-16">
            <p className="eyebrow text-accent">{BUSINESS.area}</p>
            <h1 className="mt-3 max-w-3xl text-[2.25rem] leading-[1.1] text-primary-foreground sm:text-5xl lg:text-6xl">
              Food that makes your <span className="text-gold">celebration</span> unforgettable
            </h1>
            <p className="mt-4 max-w-xl text-[1.0625rem] text-primary-foreground/90">
              {BUSINESS.tagline} Weddings, engagements, birthdays and corporate events across
              Hyderabad.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/quote" className="btn btn-gold">
                Build your menu
              </Link>
              <a href={BUSINESS.phoneHref} className="btn btn-on-image">
                Call {BUSINESS.phone}
              </a>
            </div>
            <p className="mt-5 text-sm text-primary-foreground/75">
              Rated {BUSINESS.rating} · {BUSINESS.years} · {BUSINESS.hours}
            </p>
          </div>
        </div>
      </section>

      {/* Two columns on phones keeps four numbers to one glance instead of a screenful. */}
      <Section className="pb-2 sm:pb-4">
        <dl className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {highlights.map((h) => (
            <div key={h.label} className="surface-card p-4 sm:p-6">
              <dt className="sr-only">{h.label}</dt>
              <dd>
                <p className="font-[family-name:var(--font-display)] text-xl text-primary sm:text-2xl">
                  {h.value}
                </p>
                <p className="mt-1 text-[0.8125rem] leading-snug text-muted-foreground sm:text-sm">
                  {h.label}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="What we cater" title="Every occasion, cooked on site" />
          <Link to="/services" className="btn btn-ghost btn-sm">
            All services →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <article key={s.title} className="surface-card card-interactive overflow-hidden">
              <img
                src={s.image}
                alt=""
                loading="lazy"
                width={1024}
                height={768}
                className="h-48 w-full object-cover sm:h-52"
              />
              <div className="p-6">
                <h3 className="card-title text-lg sm:text-xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <img
            src={biryaniImg}
            alt="Hyderabadi biryani served in a copper handi with raita and shorba"
            loading="lazy"
            width={1024}
            height={768}
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-[var(--shadow-md)]"
          />
          <div>
            <SectionHeading eyebrow="Since 2009" title="A family kitchen, scaled for your crowd" />
            <p className="mt-4 text-muted-foreground">
              We started as a small Amberpet kitchen and have spent sixteen years cooking for
              Hyderabad families. Every menu is planned with you, priced clearly, and prepared at
              your venue so the food reaches guests hot.
            </p>
            <ul className="list-marked mt-5 space-y-2 text-sm text-muted-foreground">
              <li>Pure veg and non-veg kitchens handled separately</li>
              <li>Uniformed serving staff, crockery and counters included</li>
              <li>Tastings before you confirm the final menu</li>
            </ul>
            <Link to="/about" className="btn btn-outline mt-7">
              Our story
            </Link>
          </div>
        </div>
      </Section>

      <Section>
        <div className="surface-card overflow-hidden px-6 py-12 text-center sm:px-10 sm:py-14">
          <p className="eyebrow">Planning a function?</p>
          <h2 className="mt-2.5 text-2xl text-primary sm:text-3xl">
            Tell us the date and guest count
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Pick your dishes in a few taps, download the menu as a PDF, and we will come back with a
            price for your budget.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/quote" className="btn btn-primary w-full sm:w-auto">
              Build your menu
            </Link>
            <Link to="/contact" className="btn btn-outline w-full sm:w-auto">
              Send an enquiry
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
