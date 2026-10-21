import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const neuSans = localFont({
  src: [
    { path: "../public/fonts/NeuSansTrial-Book.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/NeuSansTrial-Regular.otf", weight: "450", style: "normal" },
    { path: "../public/fonts/NeuSansTrial-Medium.otf", weight: "500", style: "normal" },
  ],
  variable: "--font-neusans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dijitally — Your ally",
  description:
    "Brands don’t need another agency. They need an ally that can flex with the ever-changing world around them.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${neuSans.variable} ${jetbrains.variable}`}>
      <body className="font-sans font-book">{children}</body>
    </html>
  );
}
