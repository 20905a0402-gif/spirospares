import { ReactNode } from "react";

type PolicySection = {
  title: string;
  paragraphs: string[];
};

type PolicyPageProps = {
  title: string;
  intro: string;
  lastUpdated: string;
  sections: PolicySection[];
  contactBlock?: ReactNode;
};

export default function PolicyPage({
  title,
  intro,
  lastUpdated,
  sections,
  contactBlock
}: PolicyPageProps) {
  return (
    <section className="container-shell py-10 md:py-12">
      <article className="panel p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#00BFFF]">Policies</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-gray-400 md:text-base">{intro}</p>
        <p className="mt-2 text-xs uppercase tracking-[0.14em] text-gray-500">Last Updated: {lastUpdated}</p>
      </article>

      <div className="mt-5 grid gap-4">
        {sections.map((section) => (
          <article key={section.title} className="panel p-5 md:p-6">
            <h2 className="text-xl font-bold tracking-tight text-white">{section.title}</h2>
            <div className="mt-2 space-y-2 text-sm leading-6 text-gray-400 md:text-[15px]">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        ))}

        {contactBlock ? <article className="panel p-5 md:p-6">{contactBlock}</article> : null}
      </div>
    </section>
  );
}
