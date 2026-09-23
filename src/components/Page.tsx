import type { ReactNode } from "react";

/**
 * Shared page furniture. Every route used to hand-roll its own eyebrow + h1 +
 * intro with slightly different spacing; these keep the rhythm identical.
 */
export function PageHeader({
  eyebrow,
  title,
  intro,
  actions,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="container-page pt-10 pb-2 sm:pt-14">
      {/* One restrained metal detail per page, above the eyebrow. */}
      <hr className="rule-gold mb-4 w-10" />
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-2.5 text-[2rem] text-primary sm:text-[2.75rem]">{title}</h1>
      {intro && <p className="lede mt-4">{intro}</p>}
      {actions && <div className="mt-7 flex flex-wrap gap-3">{actions}</div>}
    </header>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  as?: "h2" | "h3";
}) {
  return (
    <div>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag className="mt-2 text-2xl text-primary sm:text-3xl">{title}</Tag>
      {intro && <p className="lede mt-3 text-[0.975rem]">{intro}</p>}
    </div>
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`container-page py-10 sm:py-14 ${className}`}>
      {children}
    </section>
  );
}
