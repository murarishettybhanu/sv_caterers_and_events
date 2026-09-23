import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/Page";
import heroImg from "@/assets/hero-catering.jpg";
import { BUSINESS } from "@/components/SiteChrome";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | SV Caterers and Events, Amberpet Hyderabad" },
      {
        name: "description",
        content:
          "SV Caterers and Events has catered Hyderabad weddings and celebrations for 16 years from Srinagar Colony, Amberpet. Rated 5.0 by customers.",
      },
      { property: "og:title", content: "About SV Caterers and Events" },
      {
        property: "og:description",
        content: "Sixteen years of wedding and event catering from Amberpet, Hyderabad.",
      },
    ],
  }),
  component: About,
});

const values = [
  {
    title: "Cooked fresh, on site",
    text: "Our team sets up at your venue so dishes reach guests hot, not reheated from a van.",
  },
  {
    title: "Honest pricing",
    text: "Per-plate rates agreed upfront, with the menu written down before the day.",
  },
  {
    title: "Hospitality first",
    text: "Trained serving staff who keep counters full and guests looked after through the function.",
  },
];

function About() {
  return (
    <main>
      <PageHeader eyebrow="About" title="Sixteen years of feeding Hyderabad" />

      <Section>
        <div className="grid items-start gap-8 md:grid-cols-2 md:gap-12">
          <img
            src={heroImg}
            alt="Traditional catering buffet at an Indian wedding"
            loading="lazy"
            width={1920}
            height={1088}
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-[var(--shadow-md)]"
          />
          <div className="text-muted-foreground">
            <p>
              {BUSINESS.name} began as a family kitchen in Srinagar Colony, Amberpet, cooking for
              neighbourhood weddings and ceremonies. Sixteen years later we still cook the same way
              — traditional Telugu and Hyderabadi recipes, prepared at the venue by a team that
              treats your guests as their own.
            </p>
            <p className="mt-4">
              Today we handle everything from intimate housewarmings to weddings of two thousand
              guests, along with the event setup that goes with them. Our customers rate us{" "}
              {BUSINESS.rating} out of 5, and most of our work still comes through word of mouth.
            </p>
            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="surface-card p-4">
                <dt className="eyebrow">Kitchen</dt>
                <dd className="mt-1.5 text-sm text-foreground">{BUSINESS.address}</dd>
              </div>
              <div className="surface-card p-4">
                <dt className="eyebrow">Hours</dt>
                <dd className="mt-1.5 text-sm text-foreground">{BUSINESS.hours}</dd>
                <dd className="mt-2 text-sm">
                  <a href={BUSINESS.phoneHref} className="font-medium text-primary hover:underline">
                    {BUSINESS.phone}
                  </a>
                </dd>
              </div>
            </dl>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/quote" className="btn btn-primary">
                Build your menu
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Talk to us
              </Link>
            </div>
          </div>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {values.map((v) => (
            <li key={v.title}>
              <article className="surface-card h-full p-6">
                <h2 className="card-title text-lg sm:text-xl">{v.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
              </article>
            </li>
          ))}
        </ul>
      </Section>
    </main>
  );
}
