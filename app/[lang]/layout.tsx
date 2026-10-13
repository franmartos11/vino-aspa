import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Italiana, Lato, Marcellus, Playfair_Display } from "next/font/google";
import Motion from "../components/Motion";
import { getDictionary, hasLocale, locales } from "./dictionaries";
import "../globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});
const italiana = Italiana({ variable: "--font-italiana", subsets: ["latin"], weight: "400" });
const marcellus = Marcellus({ variable: "--font-marcellus", subsets: ["latin"], weight: "400" });
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getDictionary(lang);
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${playfair.variable} ${italiana.variable} ${marcellus.variable} ${lato.variable}`}
    >
      <head>
        {/* Activa las animaciones de aparición antes del primer pintado (sin JS el contenido se ve igual) */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('motion')" }} />
      </head>
      <body>
        <Motion />
        {children}
      </body>
    </html>
  );
}
