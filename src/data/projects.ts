export type ProjectStatus = "shipped" | "in-progress";

export interface Project {
  id: string;
  order: number;
  name: string;
  tagline: string;
  status: ProjectStatus;
  description: string;
  role?: string;
  highlight: string;
  stack: string[];
  link?: { label: string; href: string };
}

export const projects: Project[] = [
  {
    id: "arclab",
    order: 1,
    name: "ArcLab",
    tagline: "Computer-vision physics analysis tool",
    status: "shipped",
    description:
      "Upload a video of a throw, calibrate two reference points, and ArcLab tracks the motion and fits your own gravity, initial velocity and launch angle from it — then overlays a ‘ghost trajectory’ showing the textbook prediction against your real tracked path.",
    role: "System architecture: FastAPI backend, Next.js/React frontend, pytest + Playwright + GitHub Actions CI/CD, Vercel + Railway deploys.",
    highlight:
      "Automated tests were all green while real students still got stuck — calibration, not the physics, was the actual UX problem. That's the insight that reshaped the UI.",
    stack: ["FastAPI", "Next.js", "React", "YOLOv8", "OpenCV", "NumPy"],
    link: { label: "Live product", href: "https://arclab-parallax.vercel.app" },
  },
  {
    id: "pixelproof",
    order: 2,
    name: "PixelProof",
    tagline: "AI-image detector — TikTok TechJam 2026",
    status: "shipped",
    description:
      "A ~88M-parameter AI-image detector combining CLIP and frequency-domain features, built with a team of 4 in 3 days. Mean AUC of 0.915 across clean images and 14 post-processing conditions, with every score at or above 0.82.",
    role: "Implemented the semantic branch and the end-to-end training pipeline.",
    highlight:
      "Found and documented a 0.51 AUC generalisation gap on an unseen generator family, and reverted two experiments that looked good in isolation but hurt cross-generator generalisation — testing the claim, not just the leaderboard score.",
    stack: ["PyTorch", "CLIP", "Frequency-domain features", "Ablation testing"],
  },
  {
    id: "service-report-agent",
    order: 3,
    name: "Service Report Agent",
    tagline: "Agent that writes service reports automatically",
    status: "in-progress",
    description:
      "An agent that automatically generates service reports — currently in progress. Full write-up, stack and a demo are coming as the project matures.",
    highlight: "Open item: swap this in once the project has a demo-able state.",
    stack: ["In progress"],
  },
  {
    id: "trading-agent",
    order: 4,
    name: "bStock Trading Agent",
    tagline: "Binance Virtual Hackathon — autonomous trading agent",
    status: "in-progress",
    description:
      "An agent built for Binance's Virtual Hackathon that trades autonomously on bStock — currently in progress. Full write-up, stack and results are coming as the project matures.",
    highlight: "Open item: swap this in once the project has a demo-able state.",
    stack: ["In progress"],
  },
];
