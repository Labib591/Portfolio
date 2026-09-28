import type { Metadata, Viewport } from "next";
import { profile } from "@/content/profile";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Mahir Mohammed Labib", template: "%s — Mahir Mohammed Labib" },
  description:
    "An aspiring entrepreneur who loves to build products. Founder of cubiee, running entire, and building the biggest social fashion commerce platform in Bangladesh.",
  authors: [{ name: profile.name }],
  openGraph: {
    title: "Mahir Mohammed Labib",
    description: "An aspiring entrepreneur who loves to build products.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#eceae6",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const CONTRACT = `<!--
  THESIS: A scroll you are driven through, not a page you browse. The reader
  never chooses a nav item; the page decides what is in front of them and holds
  it there. Refuses the portfolio grid of equal cards and the recruiter
  hierarchy with it — this site was briefed for its owner.
  OWN-WORLD: Bone field (#ECEAE6), ink mark (#0A0A0A), one signal red (#FF3B2F)
  under 5% of pixels and never as text on the light ground. Three greys, no
  fourth. Bricolage Grotesque across weight, WIDTH and optical size carries
  everything from the 300px numeral to the 11px corner label; Geist sets prose;
  Geist Mono is reserved for measurement — indices, clocks, live values.
  Rules and space separate things, never stacked grey boxes.
  STORY: He builds products and runs an agency. Ventures lead, the degree is a
  footnote he asked to demote, the art is real and was made before the code, and
  every list on the site is in his own words or visibly blank.
  FIRST VIEWPORT: His own line at 148px, four masked lines rising out of the
  page in sequence, name demoted to a corner label. Beneath it a one-sentence
  statement of what he actually does and a mono index of the four sections with
  live counts. Two running clocks, Newark and Dhaka, pinned top-right.
  FORM: Scroll-driven editorial, pinned sections. Chosen by the user after
  seeing and rejecting a first build; references supplied were alisadik.com and
  huyml.co. Direction roll seed 3ea3e051 (experience) informed raises only.
  FINISH: unreviewed and undocumented is unfinished; this build ends with the
  finish review, the verdict, DESIGN.md, and every shipping raster carrying its
  provenance
-->`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/display.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/text.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {/* Emitted as a real HTML comment — a JSX brace-comment is JavaScript and
            never reaches the markup, so the contract would not survive the build. */}
        <div hidden dangerouslySetInnerHTML={{ __html: CONTRACT }} />
        {children}
      </body>
    </html>
  );
}
