import type { Metadata } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import { themeInitScript } from "@/components/theme";
import { HOME_DESCRIPTION, HOME_TITLE, ON_DIJITALLY, SITE_URL } from "@/components/site";
import { GTM_SNIPPET, HUBSPOT_SRC, LEAD_SNIPPET, OPENAI_PIXEL_SNIPPET, STRUCTURED_DATA } from "@/components/tracking";
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

// Site-wide defaults. Each page states its own canonical and social card (on
// www.dijitally.com the site's QA checks for them).
export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  ...(ON_DIJITALLY && {
    metadataBase: new URL(SITE_URL),
    twitter: { card: "summary_large_image" },
  }),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-theme is set by the inline script before hydration, so React must not compare it
    <html lang="en" className={`${neuSans.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        {ON_DIJITALLY && (
          <>
            <script dangerouslySetInnerHTML={{ __html: OPENAI_PIXEL_SNIPPET }} />
            <script id="hs-script-loader" async defer src={HUBSPOT_SRC} />
            <script dangerouslySetInnerHTML={{ __html: GTM_SNIPPET }} />
            <script dangerouslySetInnerHTML={{ __html: LEAD_SNIPPET }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }} />
          </>
        )}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans font-book">
        {children}
      </body>
    </html>
  );
}
