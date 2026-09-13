import { createFileRoute, Link } from "@tanstack/react-router";
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
      <section className="mx-auto max-w-6xl px-5 py-14">
        <p className="eyebrow">About</p>
        <h1 className="mt-2 text-4xl text-primary">Sixteen years of feeding Hyderabad</h1>
        <div className="mt-8 grid items-start gap-10 md:grid-cols-2">
          <img
            src={heroImg}
            alt="Traditional catering buffet at an Indian wedding"
            loading="lazy"
            width={1920}
            height={1088}
            className="rounded-2xl object-cover"
          />
          <div className="text-muted-foreground">
            <p>
              {BUSINESS.name} began as a family kitchen in Srinagar Colony, Amberpet, cooking for
              neighbourhood weddings and ceremonies. Sixteen years later we still cook the same
              way — traditional Telugu and Hyderabadi recipes, prepared at the venue by a team that
              treats your guests as their own.
            </p>
            <p className="mt-4">
              Today we handle everything from intimate housewarmings to weddings of two thousand
              guests, along with the event setup that goes with them. Our customers rate us{" "}
              {BUSINESS.rating} out of 5, and most of our work still comes through word of mouth.
            </p>
            <p className="mt-4">
              {BUSINESS.address}. {BUSINESS.hours}.
            </p>
            <Link to="/contact" className="btn-primary hover:btn-primary-hover mt-7">
              Talk to us
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <article key={v.title} className="surface-card p-6">
              <h2 className="text-xl text-primary">{v.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
