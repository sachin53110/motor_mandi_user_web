import { Link } from "react-router-dom";

function InfoPageLayout({ eyebrow, title, summary, highlights = [], sections = [], cta }) {
  return (
    <main className="px-4 py-12 sm:py-16" style={{ background: "linear-gradient(180deg, #f3f6fb 0%, #ffffff 100%)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="rounded-[2rem] border border-white/80 bg-white shadow-xl shadow-slate-200/60 overflow-hidden">
          <div className="p-6 sm:p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white">
            {eyebrow ? (
              <p className="text-sky-300 text-xs font-bold tracking-[0.35em] uppercase mb-4">{eyebrow}</p>
            ) : null}
            <h1 className="text-4xl sm:text-6xl font-black leading-tight text-slate-100" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>
              {title}
            </h1>
            <p className="mt-4 max-w-3xl text-slate-200 text-sm sm:text-base leading-7">
              {summary}
            </p>

            {highlights.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {highlights.map((item) => (
                  <span key={item} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100 backdrop-blur-sm">
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 sm:p-10 space-y-8">
            {sections.map((section) => (
              <section key={section.title} className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
                <h2 className="text-2xl font-black text-slate-900" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>
                  {section.title}
                </h2>
                {section.body ? <p className="mt-3 text-sm sm:text-base leading-7 text-slate-600">{section.body}</p> : null}
                {Array.isArray(section.points) && section.points.length > 0 ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {section.points.map((point) => (
                      <div key={point} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-600 shadow-sm">
                        {point}
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            ))}

            {cta ? (
              <div className="rounded-3xl border border-sky-200 bg-sky-50 p-5 sm:p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900">{cta.title}</h2>
                  <p className="mt-1 text-sm text-slate-600">{cta.description}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {cta.primary ? (
                    <Link
                      to={cta.primary.to}
                      className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-sky-500"
                    >
                      {cta.primary.label}
                    </Link>
                  ) : null}
                  {cta.secondary ? (
                    <Link
                      to={cta.secondary.to}
                      className="inline-flex items-center justify-center rounded-full border border-sky-200 bg-white px-5 py-2.5 text-sm font-bold text-sky-700 transition-colors hover:bg-sky-50"
                    >
                      {cta.secondary.label}
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}

export default InfoPageLayout;