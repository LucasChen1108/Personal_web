"use client";

import { STATIONS } from "@/lib/stations";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";

function StationCard({ id }: { id: (typeof STATIONS)[number]["id"] }) {
  if (id === "about") {
    return (
      <>
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-teal-300/70">About</p>
        <h1 className="mb-4 text-3xl font-semibold text-slate-50 sm:text-4xl">{profile.name}</h1>
        <p className="max-w-md text-sm leading-relaxed text-slate-300 sm:text-base">{profile.about}</p>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">{profile.keenOn}</p>
        <p className="mt-6 text-xs text-slate-500">Scroll to walk through the lab ↓</p>
      </>
    );
  }

  if (id === "contact") {
    return (
      <>
        <p className="mb-2 text-xs uppercase tracking-[0.3em] text-teal-300/70">Contact</p>
        <h2 className="mb-4 text-2xl font-semibold text-slate-50 sm:text-3xl">Let's talk</h2>
        <div className="flex flex-col gap-2 text-sm sm:text-base">
          <a className="text-teal-300 underline underline-offset-4 hover:text-teal-200" href={`mailto:${profile.contact.email}`}>
            {profile.contact.email}
          </a>
          <a className="text-teal-300 underline underline-offset-4 hover:text-teal-200" href={profile.contact.github.href} target="_blank" rel="noreferrer">
            github.com/{profile.contact.github.label}
          </a>
          <a className="text-teal-300 underline underline-offset-4 hover:text-teal-200" href={profile.contact.linkedin.href} target="_blank" rel="noreferrer">
            linkedin.com/in/{profile.contact.linkedin.label}
          </a>
        </div>
      </>
    );
  }

  const project = projects.find((p) => p.id === id);
  if (!project) return null;

  return (
    <>
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-teal-300/70">
        {project.status === "shipped" ? "Shipped" : "In progress"}
      </p>
      <h2 className="mb-2 text-2xl font-semibold text-slate-50 sm:text-3xl">{project.name}</h2>
      <p className="mb-3 text-sm text-slate-400">{project.tagline}</p>
      <p className="max-w-md text-sm leading-relaxed text-slate-300">{project.description}</p>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-teal-200/90">{project.highlight}</p>
      {project.role && <p className="mt-3 text-xs text-slate-500">{project.role}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {project.stack.map((s) => (
          <span key={s} className="rounded-full border border-teal-800/60 px-2 py-0.5 text-[11px] text-teal-200/80">
            {s}
          </span>
        ))}
      </div>
      {project.link && (
        <a
          className="mt-4 inline-block text-sm text-teal-300 underline underline-offset-4 hover:text-teal-200"
          href={project.link.href}
          target="_blank"
          rel="noreferrer"
        >
          {project.link.label} →
        </a>
      )}
    </>
  );
}

export function Overlay({ position }: { position: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex items-center px-6 sm:px-16">
      {STATIONS.map((station) => {
        const dist = Math.abs(position - station.index);
        const opacity = Math.max(0, Math.min(1, 1 - (dist - 0.15) * 3.2));
        const translate = (station.index - position) * 70;
        const active = dist < 0.32;
        return (
          <div
            key={station.id}
            className="absolute max-w-lg"
            style={{
              opacity,
              transform: `translateY(${translate}px)`,
              pointerEvents: active ? "auto" : "none",
            }}
          >
            <StationCard id={station.id} />
          </div>
        );
      })}
    </div>
  );
}
