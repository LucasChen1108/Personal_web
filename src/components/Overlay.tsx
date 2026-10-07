"use client";

import { useEffect, useState } from "react";
import { STATIONS } from "@/lib/stations";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";

const ROLE_MS = 2600;
const ROLE_FADE_MS = 350;

/** A small HTML "monitor" cycling through the person's roles. Kept as a
 * plain overlay element (not a 3D object) so its position is pinned and
 * predictable — a 3D prop placed near the starting camera either got
 * clipped into a giant shard during the scroll-out transition, or drifted
 * across the text column as the camera panned. This can't do either. */
function RoleMonitor({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let fadeTimer: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setVisible(false);
      fadeTimer = setTimeout(() => {
        setIndex((i) => (i + 1) % roles.length);
        setVisible(true);
      }, ROLE_FADE_MS);
    }, ROLE_MS);
    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
    };
  }, [roles.length]);

  return (
    <div className="relative w-64 rounded-md border border-teal-700/50 bg-black/50 p-4 shadow-[0_0_40px_-12px_rgba(77,208,196,0.6)] backdrop-blur-sm sm:w-72">
      <div
        className="pointer-events-none absolute inset-0 rounded-md opacity-10"
        style={{
          background:
            "repeating-linear-gradient(0deg, #8fe3c7 0px, #8fe3c7 1px, transparent 1px, transparent 4px)",
        }}
      />
      <p className="mb-2 text-[10px] uppercase tracking-[0.35em] text-teal-400/70">[ role ]</p>
      <p
        className="min-h-[2.75rem] text-base font-semibold leading-snug text-slate-50 transition-opacity duration-300 sm:text-lg"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {roles[index]}
      </p>
    </div>
  );
}

function StationCard({ id }: { id: (typeof STATIONS)[number]["id"] }) {
  if (id === "about") {
    return (
      <>
        <p className="mb-4 text-xs uppercase tracking-[0.4em] text-teal-300/70">[ About ]</p>
        <h1 className="mb-6 text-5xl font-semibold leading-[1.05] text-slate-50 sm:text-7xl lg:text-8xl">
          {profile.name}
        </h1>
        <p className="max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">{profile.about}</p>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-400 sm:text-lg">{profile.keenOn}</p>
        <p className="mt-8 text-xs tracking-widest text-slate-500">[ scroll to walk through the lab ↓ ]</p>
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
  const aboutIndex = STATIONS.find((s) => s.id === "about")!.index;
  const aboutDist = Math.abs(position - aboutIndex);
  const aboutOpacity = Math.max(0, Math.min(1, 1 - (aboutDist - 0.15) * 3.2));
  const aboutTranslate = (aboutIndex - position) * 70;

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

      <div
        className="absolute right-6 top-1/2 hidden -translate-y-1/2 lg:right-16 lg:block"
        style={{ opacity: aboutOpacity, transform: `translateY(calc(-50% + ${aboutTranslate}px))` }}
      >
        <RoleMonitor roles={profile.roles} />
      </div>
    </div>
  );
}
