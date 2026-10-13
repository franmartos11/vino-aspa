"use client";

import { useState } from "react";
import type { Dictionary } from "../[lang]/dictionaries";
import { locales, type Locale } from "../[lang]/locales";

type Props = { lang: Locale; t: Dictionary["nav"] };

/** Guarda el idioma elegido y la posición actual para retomarla en la otra versión. */
function rememberLocale(l: Locale) {
  document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; samesite=lax`;
  try {
    sessionStorage.setItem("aspa-scroll", String(window.scrollY));
  } catch {}
}

function LangSwitch({ lang, t, center }: Props & { center?: boolean }) {
  return (
    <div className="langs" role="group" aria-label={t.language} style={center ? { justifyContent: "center" } : undefined}>
      {locales.map((l, i) => (
        <span key={l} style={{ display: "contents" }}>
          {i > 0 && <span aria-hidden="true" style={{ color: "#9a958a" }}>/</span>}
          <a
            href={`/${l}`}
            hrefLang={l}
            lang={l}
            aria-current={l === lang ? "true" : undefined}
            className={l === lang ? "is-current" : undefined}
            onClick={() => rememberLocale(l)}
          >
            {l.toUpperCase()}
          </a>
        </span>
      ))}
    </div>
  );
}

export default function Header({ lang, t }: Props) {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#origen", label: t.origen },
    { href: "#vino", label: t.vino },
    { href: "#experiencias", label: t.experiencias },
    { href: "#contacto", label: t.contacto },
  ];

  return (
    <>
      <header className="site-header">
        <nav aria-label={t.sections} className="nav-links">
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
        <a href="#top" aria-label={t.home} className="logo-link">
          <img src="/img/logo.png" alt="" style={{ height: 46, width: "auto" }} />
          <span className="word">ASPA</span>
        </a>
        <div className="header-right">
          <LangSwitch lang={lang} t={t} />
          <a href="#reservar" className="btn-outline">{t.book}</a>
        </div>
        <button className="burger" aria-label={t.openMenu} aria-expanded={open} onClick={() => setOpen(true)}>
          <span style={{ width: 30 }} />
          <span style={{ width: 22 }} />
          <span style={{ width: 30 }} />
        </button>
      </header>

      {open && (
        <div className="menu-overlay" role="dialog" aria-modal="true" aria-label={t.menu}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 76 }}>
            <span className="marcellus" style={{ fontSize: 12, letterSpacing: ".32em" }}>ASPA</span>
            <button className="burger" aria-label={t.closeMenu} onClick={() => setOpen(false)} style={{ display: "flex", fontSize: 34, lineHeight: 1 }}>
              ×
            </button>
          </div>
          <nav>
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
          </nav>
          <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
            <a href="#reservar" className="btn-outline" onClick={() => setOpen(false)} style={{ justifyContent: "center" }}>
              {t.book}
            </a>
            <LangSwitch lang={lang} t={t} center />
          </div>
        </div>
      )}
    </>
  );
}
