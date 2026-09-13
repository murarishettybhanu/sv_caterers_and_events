import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BUSINESS } from "@/components/SiteChrome";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Enquiry | SV Caterers and Events, Hyderabad" },
      {
        name: "description",
        content:
          "Enquire about catering for your wedding, engagement or party in Hyderabad. SV Caterers and Events, Srinagar Colony, Amberpet. Open daily until 9 pm.",
      },
      { property: "og:title", content: "Contact SV Caterers and Events" },
      {
        property: "og:description",
        content: "Send your event date and guest count for a catering quote in Hyderabad.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <p className="eyebrow">Contact</p>
      <h1 className="mt-2 text-4xl text-primary">Let's plan your function</h1>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <section className="surface-card p-7">
          <h2 className="text-xl text-primary">Enquiry form</h2>
          {sent ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Thank you — your enquiry has been noted. We will get back to you with a menu and
              pricing.
            </p>
          ) : (
            <form
              className="mt-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <Field label="Your name" name="name" />
              <Field label="Phone number" name="phone" type="tel" />
              <Field label="Event date" name="date" type="date" />
              <Field label="Number of guests" name="guests" type="number" />
              <div>
                <label htmlFor="details" className="text-sm font-medium">
                  Event details
                </label>
                <textarea
                  id="details"
                  name="details"
                  rows={4}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Wedding, engagement, birthday… veg or non-veg, venue area"
                />
              </div>
              <button type="submit" className="btn-primary hover:btn-primary-hover w-full">
                Send enquiry
              </button>
            </form>
          )}
        </section>

        <section className="space-y-6">
          <div className="surface-card p-7">
            <h2 className="text-xl text-primary">Visit us</h2>
            <p className="mt-2 text-sm text-muted-foreground">{BUSINESS.address}</p>
            <p className="mt-3 text-sm text-muted-foreground">{BUSINESS.hours}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {BUSINESS.years} · Rated {BUSINESS.rating} by customers
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border">
            <iframe
              title="Map showing SV Caterers and Events in Amberpet, Hyderabad"
              src="https://www.google.com/maps?q=Srinagar+Colony+Ramanthapur+Amberpet+Hyderabad+500013&output=embed"
              className="h-80 w-full"
              loading="lazy"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={name !== "details"}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
