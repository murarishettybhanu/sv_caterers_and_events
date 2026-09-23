import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/Page";
import biryaniImg from "@/assets/dish-biryani.jpg";
import counterImg from "@/assets/live-counter.jpg";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu | SV Caterers and Events, Amberpet Hyderabad" },
      {
        name: "description",
        content:
          "Sample veg and non-veg catering menus from SV Caterers and Events: Hyderabadi biryani, Telugu wedding meals, live counters, sweets and tiffins.",
      },
      { property: "og:title", content: "Catering Menu | SV Caterers and Events" },
      {
        property: "og:description",
        content: "Sample veg and non-veg menus, live counters and sweets for Hyderabad events.",
      },
    ],
  }),
  component: Menu,
});

const sections = [
  {
    name: "Veg favourites",
    items: [
      "Veg dum biryani, bagara rice, jeera rice",
      "Paneer butter masala, gutti vankaya, mixed veg kurma",
      "Dal palak, sambar, rasam, pappu charu",
      "Pulihora, curd rice, appadam, pickles",
    ],
  },
  {
    name: "Non-veg specials",
    items: [
      "Hyderabadi chicken & mutton dum biryani",
      "Chicken 65, apollo fish, kodi vepudu",
      "Mutton rogan josh, chicken curry, egg masala",
      "Mirchi ka salan, raita, shorba",
    ],
  },
  {
    name: "Tiffins & live counters",
    items: [
      "Dosa, idli, vada, upma, pongal",
      "Chaat counter: pani puri, dahi puri, samosa",
      "Pasta and noodle counters for younger guests",
      "Filter coffee, tea and welcome drinks",
    ],
  },
  {
    name: "Sweets & desserts",
    items: [
      "Double ka meetha, qubani ka meetha",
      "Gulab jamun, bobbatlu, ariselu",
      "Payasam, kheer, rava kesari",
      "Ice cream and fruit counters",
    ],
  },
];

function Menu() {
  return (
    <main>
      <PageHeader
        eyebrow="Menu"
        title="Sample menus you can build on"
        intro="Every menu is customised to your function, guest count and budget. Here is a taste of what our kitchen regularly prepares — or build your own list in a few taps."
        actions={
          <Link to="/quote" className="btn btn-primary">
            Build your menu
          </Link>
        }
      />

      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {sections.map((s) => (
            <section key={s.name} className="surface-card p-6 sm:p-7">
              <h2 className="card-title text-lg sm:text-xl">{s.name}</h2>
              <ul className="list-marked mt-4 space-y-2 text-sm text-muted-foreground">
                {s.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <img
            src={biryaniImg}
            alt="Hyderabadi biryani in a copper handi"
            loading="lazy"
            width={1024}
            height={768}
            className="h-56 w-full rounded-2xl object-cover sm:h-72"
          />
          <img
            src={counterImg}
            alt="Live snack and sweet counter served by chefs at a party"
            loading="lazy"
            width={1024}
            height={768}
            className="h-56 w-full rounded-2xl object-cover sm:h-72"
          />
        </div>

        <div className="surface-card mt-10 px-6 py-10 text-center sm:px-8 sm:py-12">
          <h2 className="text-2xl text-primary sm:text-3xl">Want a menu priced for your date?</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Pick your dishes category by category and download the menu as a PDF — then share it
            with us for rates.
          </p>
          <Link to="/quote" className="btn btn-gold mt-7">
            Build your menu
          </Link>
        </div>
      </Section>
    </main>
  );
}
