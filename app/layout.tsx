import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Top Advantage Duel",
  description: "Jon and David rank Obvious's top marketing advantages, one duel at a time.",
  manifest: "/manifest.json",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
