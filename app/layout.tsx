import type { Metadata, Viewport } from "next";
import { Nunito_Sans, Quicksand } from "next/font/google";
import { AppProviders } from "@/components/AppProviders";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ["500", "600", "700"],
});

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Pulse — your gentle wellness companion",
  description: "A Tamagotchi-style burnout companion for one daily check-in.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fff8f0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${quicksand.variable} ${nunito.variable} h-full`}>
      <body className="min-h-dvh bg-cream font-body-md text-on-surface antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
