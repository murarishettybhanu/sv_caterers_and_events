import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section, SectionHeading } from "@/components/Page";
import { BUSINESS } from "@/components/SiteChrome";
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
    <main>
      <PageHeader
        eyebrow="Services"
        title="Catering for every kind of gathering"
        intro="We cater across Hyderabad — Amberpet, Ramanthapur, Uppal, Dilsukhnagar, Secunderabad and beyond — for functions from fifty guests to two thousand."
        actions={
          <>
            <Link to="/quote" className="btn btn-primary">
              Build your menu
            </Link>
            <a href={BUSINESS.phoneHref} className="btn btn-outline">
              Call {BUSINESS.phone}
            </a>
          </>
        }
      />

      <Section>
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <li key={s.title}>
              <article className="surface-card card-interactive h-full p-6">
                <h2 className="card-title text-lg sm:text-xl">{s.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </article>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
          <img
            src={eventImg}
            alt="Outdoor event dining setup with floral centrepieces and string lights"
            loading="lazy"
            width={1024}
            height={768}
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-[var(--shadow-md)]"
          />
          <div>
            <SectionHeading eyebrow="What's included" title="One team, start to finish" />
            <ul className="list-marked mt-5 space-y-2 text-sm text-muted-foreground">
              {inclusions.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/quote" className="btn btn-primary">
                Get a quote
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Ask a question
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
