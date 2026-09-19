"use client";

import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

export function StaticFallback({ onExit }: { onExit: () => void }) {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-16 text-slate-200">
      <p className="mb-6 text-xs tracking-[0.3em] text-teal-200/70">THE LAB</p>
      <button
        onClick={onExit}
        className="mb-10 rounded-full border border-teal-800/60 px-4 py-1.5 text-xs text-teal-200 hover:border-teal-500"
      >
        ← View the interactive version
      </button>

      <p className="mb-1 text-xs uppercase tracking-[0.3em] text-teal-300/70">About</p>
      <h1 className="mb-4 text-3xl font-semibold text-slate-50">{profile.name}</h1>
      <p className="mb-2 leading-relaxed text-slate-300">{profile.about}</p>
      <p className="mb-12 leading-relaxed text-slate-400">{profile.keenOn}</p>

      <h2 className="mb-6 text-xs uppercase tracking-[0.3em] text-teal-300/70">Projects</h2>
      <div className="mb-14 flex flex-col gap-10">
        {projects.map((p) => (
          <article key={p.id}>
            <p className="text-xs uppercase tracking-widest text-teal-300/60">
              {p.status === "shipped" ? "Shipped" : "In progress"}
            </p>
            <h3 className="mt-1 text-xl font-semibold text-slate-50">{p.name}</h3>
            <p className="text-sm text-slate-400">{p.tagline}</p>
            <p className="mt-2 leading-relaxed text-slate-300">{p.description}</p>
            <p className="mt-2 leading-relaxed text-teal-200/90">{p.highlight}</p>
            {p.role && <p className="mt-2 text-sm text-slate-500">{p.role}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <span key={s} className="rounded-full border border-teal-800/60 px-2 py-0.5 text-[11px] text-teal-200/80">
                  {s}
                </span>
              ))}
            </div>
            {p.link && (
              <a className="mt-3 inline-block text-sm text-teal-300 underline underline-offset-4" href={p.link.href} target="_blank" rel="noreferrer">
                {p.link.label} →
              </a>
            )}
          </article>
        ))}
      </div>

      <h2 className="mb-4 text-xs uppercase tracking-[0.3em] text-teal-300/70">Skills</h2>
      <div className="mb-14 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Object.entries(profile.skills).map(([group, items]) => (
          <div key={group}>
            <p className="mb-1 text-sm font-medium text-slate-200">{group}</p>
            <p className="text-sm text-slate-400">{items.join(", ")}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 text-xs uppercase tracking-[0.3em] text-teal-300/70">Contact</h2>
      <div className="flex flex-col gap-1 text-sm">
        <a className="text-teal-300 underline underline-offset-4" href={`mailto:${profile.contact.email}`}>
          {profile.contact.email}
        </a>
        <a className="text-teal-300 underline underline-offset-4" href={profile.contact.github.href} target="_blank" rel="noreferrer">
          github.com/{profile.contact.github.label}
        </a>
        <a className="text-teal-300 underline underline-offset-4" href={profile.contact.linkedin.href} target="_blank" rel="noreferrer">
          linkedin.com/in/{profile.contact.linkedin.label}
        </a>
      </div>
    </main>
  );
}
