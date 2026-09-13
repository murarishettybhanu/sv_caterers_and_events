import { createFileRoute, Link } from "@tanstack/react-router";
import eventImg from "@/assets/event-setup.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Catering Services | SV Caterers and Events, Hyderabad" },
      {
        name: "description",
        content:
          "Wedding, engagement, birthday, housewarming and corporate catering in Hyderabad with live counters, serving staff and veg or non-veg menus.",
      },
      { property: "og:title", content: "Catering Services in Hyderabad | SV Caterers and Events" },
      {
        property: "og:description",
        content:
          "Full-service catering for weddings, engagements, birthdays and corporate events across Hyderabad.",
      },
    ],
  }),
  component: Services,
});

const services = [
  {
    title: "Wedding catering",
    text: "Traditional Telugu wedding meals on banana leaf or grand buffet spreads with live dosa, chaat and sweet counters. Staffing, crockery and service included.",
  },
  {
    title: "Engagement & reception",
    text: "Cocktail-style starters, plated or buffet mains and a dessert station, arranged around your function timeline.",
  },
  {
    title: "Birthday parties",
    text: "Snack counters, biryani, mini-meals and cake-side catering for house parties and banquet halls, from 50 guests upward.",
  },
  {
    title: "Housewarming & pooja",
    text: "Pure-veg satvik menus, prasadam and full tiffin service for gruhapravesham and ceremonies.",
  },
  {
    title: "Corporate & office events",
    text: "Lunch buffets, tea-break counters and packed meals for offices, training days and launches.",
  },
  {
    title: "Event management",
    text: "Beyond food we help with tables, decor, seating layout and serving staff so one team handles the day.",
  },
];

const inclusions = [
  "Menu planning and tasting session",
  "Cooking at your venue with our own equipment",
  "Uniformed serving and cleaning staff",
  "Buffet counters, chafing dishes and crockery",
  "Veg and non-veg prepared separately",
  "Clear per-plate pricing, no hidden charges",
];

function Services() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <p className="eyebrow">Services</p>
      <h1 className="mt-2 text-4xl text-primary">Catering for every kind of gathering</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        We cater across Hyderabad — Amberpet, Ramanthapur, Uppal, Dilsukhnagar, Secunderabad and
        beyond — for functions from fifty guests to two thousand.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <article key={s.title} className="surface-card p-6">
            <h2 className="text-xl text-primary">{s.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
          </article>
        ))}
      </div>

      <section className="mt-16 grid items-center gap-10 md:grid-cols-2">
        <img
          src={eventImg}
          alt="Outdoor event dining setup with floral centrepieces and string lights"
          loading="lazy"
          width={1024}
          height={768}
          className="rounded-2xl object-cover"
        />
        <div>
          <p className="eyebrow">What's included</p>
          <h2 className="mt-2 text-3xl text-primary">One team, start to finish</h2>
          <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
            {inclusions.map((i) => (
              <li key={i}>• {i}</li>
            ))}
          </ul>
          <Link to="/contact" className="btn-primary hover:btn-primary-hover mt-7">
            Ask for pricing
          </Link>
        </div>
      </section>
    </main>
  );
}
