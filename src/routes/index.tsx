import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-catering.jpg";
import biryaniImg from "@/assets/dish-biryani.jpg";
import eventImg from "@/assets/event-setup.jpg";
import counterImg from "@/assets/live-counter.jpg";
import { BUSINESS } from "@/components/SiteChrome";

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
      <section className="relative">
        <img
          src={heroImg}
          alt="Traditional South Indian wedding catering buffet with brass vessels and banana leaf"
          width={1920}
          height={1088}
          className="h-[78vh] w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto w-full max-w-6xl px-5 pb-14">
            <p className="eyebrow">{BUSINESS.area}</p>
            <h1 className="mt-3 max-w-3xl text-4xl leading-tight text-primary-foreground sm:text-6xl">
              Food that makes your <span className="text-gold">celebration</span> unforgettable
            </h1>
            <p className="mt-4 max-w-xl text-base text-primary-foreground/85">
              {BUSINESS.tagline} Weddings, engagements, birthdays and corporate events across
              Hyderabad.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/contact" className="btn-gold">
                Request a quote
              </Link>
              <Link
                to="/menu"
                className="inline-flex items-center rounded-full border border-primary-foreground/40 px-7 py-3 text-sm font-semibold text-primary-foreground"
              >
                See the menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h) => (
            <div key={h.label} className="surface-card p-6">
              <p className="font-[family-name:var(--font-display)] text-2xl text-primary">
                {h.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{h.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-6">
        <p className="eyebrow">What we cater</p>
        <h2 className="mt-2 text-3xl text-primary sm:text-4xl">Every occasion, cooked on site</h2>
        <div className="mt-8 grid gap-7 md:grid-cols-3">
          {services.map((s) => (
            <article key={s.title} className="surface-card overflow-hidden">
              <img
                src={s.image}
                alt={s.title}
                loading="lazy"
                width={1024}
                height={768}
                className="h-52 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl text-primary">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/services" className="btn-primary hover:btn-primary-hover">
            All services
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-5">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <img
            src={biryaniImg}
            alt="Hyderabadi biryani served in a copper handi with raita and shorba"
            loading="lazy"
            width={1024}
            height={768}
            className="rounded-2xl object-cover"
          />
          <div>
            <p className="eyebrow">Since 2009</p>
            <h2 className="mt-2 text-3xl text-primary">A family kitchen, scaled for your crowd</h2>
            <p className="mt-4 text-muted-foreground">
              We started as a small Amberpet kitchen and have spent sixteen years cooking for
              Hyderabad families. Every menu is planned with you, priced clearly, and prepared at
              your venue so the food reaches guests hot.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              <li>• Pure veg and non-veg kitchens handled separately</li>
              <li>• Uniformed serving staff, crockery and counters included</li>
              <li>• Tastings before you confirm the final menu</li>
            </ul>
            <Link to="/about" className="btn-primary hover:btn-primary-hover mt-7">
              Our story
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-5">
        <div className="surface-card px-8 py-12 text-center">
          <p className="eyebrow">Planning a function?</p>
          <h2 className="mt-2 text-3xl text-primary">Tell us the date and guest count</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Send your requirement and we will come back with a menu and a price for your budget.
          </p>
          <Link to="/contact" className="btn-gold mt-7">
            Enquire now
          </Link>
        </div>
      </section>
    </main>
  );
}
