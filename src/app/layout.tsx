import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Lab — Chen Letao",
  description:
    "CS student at NUS building AI systems — computer vision, agents, and everything in between. ArcLab, PixelProof, and more.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-[#060c0b] font-mono text-slate-200">{children}</body>
    </html>
  );
}
