import { createFileRoute, Link } from "@tanstack/react-router";
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
    <main className="mx-auto max-w-6xl px-5 py-14">
      <p className="eyebrow">Menu</p>
      <h1 className="mt-2 text-4xl text-primary">Sample menus you can build on</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Every menu is customised to your function, guest count and budget. Here is a taste of what
        our kitchen regularly prepares.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {sections.map((s) => (
          <section key={s.name} className="surface-card p-7">
            <h2 className="text-xl text-primary">{s.name}</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {s.items.map((i) => (
                <li key={i}>• {i}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <img
          src={biryaniImg}
          alt="Hyderabadi biryani in a copper handi"
          loading="lazy"
          width={1024}
          height={768}
          className="h-72 w-full rounded-2xl object-cover"
        />
        <img
          src={counterImg}
          alt="Live snack and sweet counter served by chefs at a party"
          loading="lazy"
          width={1024}
          height={768}
          className="h-72 w-full rounded-2xl object-cover"
        />
      </div>

      <div className="surface-card mt-12 px-8 py-10 text-center">
        <h2 className="text-2xl text-primary">Want a menu priced for your date?</h2>
        <p className="mt-2 text-muted-foreground">
          Share your guest count and we will put together options at different price points.
        </p>
        <Link to="/contact" className="btn-gold mt-6">
          Get a quote
        </Link>
      </div>
    </main>
  );
}
