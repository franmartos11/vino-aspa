import type React from "react";
import { notFound } from "next/navigation";
import Header from "../components/Header";
import ReservaForm from "../components/ReservaForm";
import { getDictionary, hasLocale } from "./dictionaries";

const Arrow = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
    <path d="M7 17L17 7M9 7h8v8" />
  </svg>
);

const Peaks = () => (
  <svg width="36" height="13" viewBox="0 0 36 13" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
    <path d="M1 12 L9 4 L13 8 L20 1 L28 9 L31 6 L35 12" />
  </svg>
);

const Peak = () => (
  <span className="peak">
    <svg width="30" height="13" viewBox="0 0 30 13" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M1 12 L9 3 L13 7 L19 1 L29 12" />
    </svg>
  </span>
);

/** Título que aparece palabra por palabra (se anima cuando un ancestro recibe .is-in). */
const Words = ({ text }: { text: string }) => (
  <>
    {text.split(" ").map((w, i, all) => (
      <span key={i}>
        <span className="w">
          <span style={{ "--i": i } as React.CSSProperties}>{w}</span>
        </span>
        {i < all.length - 1 ? " " : null}
      </span>
    ))}
  </>
);

// Imágenes por posición; los textos vienen del diccionario de cada idioma.
const INSTANTES_IMG = [
  { img: "cava", pos: "50% 42%" },
  { img: "racimos", pos: "50% 50%" },
  { img: "barrica", pos: "50% 45%" },
  { img: "sala-barricas", pos: "70% 50%" },
  { img: "blanco", pos: "50% 50%" },
];
const EXPERIENCIAS_IMG = ["copas", "sala-barricas", "atardecer"];

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = getDictionary(lang);

  return (
    <>
      <Header lang={lang} t={t.nav} />
      <main style={{ overflow: "clip" }}>
        {/* HERO */}
        <section id="top" className="hero">
          <div className="hero-frame cut" data-parallax="-0.12">
            <div className="inner cut">
              <div className="photo cut">
                <img fetchPriority="high" className="fill h-img" src="/img/hero-vinedo.jpg" alt={t.hero.photoAlt} style={{ objectPosition: "56% 50%" }} />
              </div>
            </div>
          </div>

          <div className="hero-word" data-parallax="0.18">
            <div className="h-word" style={{ position: "relative" }}>
              <span className="pre">{t.hero.pre}</span>
              <h1 style={{ "--len": t.hero.word.length } as React.CSSProperties}>{t.hero.word}</h1>
              <span className="post">{t.hero.post}</span>
            </div>
          </div>

          <div aria-hidden="true" className="hero-shadow" />
          <div className="hero-bottle" data-parallax="-0.06">
            <div className="h-bottle" style={{ position: "relative", width: "100%", height: "100%" }}>
              <img fetchPriority="high" src="/img/bottle.png" alt={t.hero.bottleAlt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
            </div>
            <div aria-hidden="true" className="reflection">
              <img src="/img/bottle.png" alt="" />
            </div>
          </div>

          <a className="circ hero-badge" href="#origen">
            <Arrow size={22} />
            <span>
              {t.hero.badge[0]}
              <br />
              {t.hero.badge[1]}
            </span>
          </a>

          <div className="hero-meta">
            <span className="place">{t.hero.place}</span>
            <span className="temp">18°C</span>
            <span className="stat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M3 8h11a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h8" /></svg>
              2.1 m/s
            </span>
            <span className="stat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z" /></svg>
              31%
            </span>
          </div>
          <a href="#intro" className="hero-scroll">{t.hero.scroll} <i aria-hidden="true" /></a>
        </section>

        {/* MARQUESINA */}
        <div aria-hidden="true" className="marquee">
          <div className="track">
            {[0, 1].map((n) => (
              <span key={n} style={{ paddingRight: 48 }}>
                {t.marquee.map((w, i) => (
                  <span key={w}>
                    {i === 3 ? <em>{w}</em> : w} <Peak />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* INTRO */}
        <section id="intro" className="section pad-lg" style={{ paddingTop: 150, paddingBottom: 130 }}>
          <div className="up wrap">
            <h2 className="h-caps" style={{ marginBottom: 56, maxWidth: 900, fontSize: 58 }}>
              <Words text={t.intro.title} />
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "24px 64px", maxWidth: 1040 }} className="copy">
              <p style={{ margin: 0, flex: "1 1 320px", fontSize: 18 }}>{t.intro.p1}</p>
              <p style={{ margin: 0, flex: "1 1 320px", fontSize: 18 }}>{t.intro.p2}</p>
            </div>
          </div>
        </section>

        {/* ORIGEN */}
        <section id="origen" className="section" style={{ paddingTop: 40, paddingBottom: 160 }}>
          <div className="wrap origen-grid">
            <div className="origen-photos">
              <div className="a cut zoom rv">
                <div className="zi"><img loading="lazy" decoding="async" className="fill" src="/img/barrica.jpg" alt={t.origen.barrelAlt} style={{ objectPosition: "50% 42%" }} /></div>
              </div>
              <div className="b cut zoom rv" data-parallax="-0.1" style={{ "--d": "0.25s" } as React.CSSProperties}>
                <div className="zi"><img loading="lazy" decoding="async" className="fill" src="/img/racimos.jpg" alt={t.origen.grapesAlt} style={{ objectPosition: "40% 50%" }} /></div>
              </div>
            </div>
            <div className="up" style={{ flex: "1 1 420px", minWidth: 0 }}>
              <p className="kicker"><Peaks />{t.origen.kicker}</p>
              <h2 className="h-xl" style={{ marginBottom: 32, fontSize: 64 }}><Words text={t.origen.title} /></h2>
              <div className="copy" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <p style={{ margin: 0 }}>{t.origen.p1}</p>
                <p style={{ margin: 0 }}>{t.origen.p2}</p>
              </div>
              <a href="#vinedo" className="link-circle" style={{ marginTop: 40 }}>
                <span className="circ ring"><Arrow /></span>
                {t.origen.cta}
              </a>
            </div>
          </div>
        </section>

        {/* VIÑEDO */}
        <section id="vinedo" style={{ position: "relative" }}>
          <div className="expand vinedo" data-reveal>
            <div className="bg rv">
              <div><img loading="lazy" decoding="async" className="fill" src="/img/valle.jpg" alt={t.vinedo.alt} style={{ objectPosition: "50% 100%" }} /></div>
            </div>
            <div aria-hidden="true" className="frame" />
            <div className="up card-text">
              <p className="kicker"><Peaks />{t.vinedo.kicker}</p>
              <h2 className="h-xl" style={{ marginBottom: 24, fontSize: 54, lineHeight: 1.04 }}><Words text={t.vinedo.title} /></h2>
              <p className="copy" style={{ margin: "0 0 18px" }}>{t.vinedo.p1}</p>
              <p className="copy" style={{ margin: 0 }}>{t.vinedo.p2}</p>
            </div>
          </div>
        </section>

        {/* INSTANTES */}
        <section id="instantes" className="section pad-lg" style={{ paddingTop: 150, paddingBottom: 140 }}>
          <div className="wrap" style={{ maxWidth: 1360 }}>
            <div className="up" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 24, marginBottom: 52 }}>
              <h2 className="h-caps" style={{ fontSize: 52 }}><Words text={t.instantes.title} /></h2>
              <p className="copy" style={{ margin: 0, maxWidth: 360, fontSize: 16 }}>{t.instantes.lead}</p>
            </div>
            <div className="acc" data-reveal>
              {t.instantes.items.map((i, n) => (
                <div className="it" key={n} style={{ "--i": n } as React.CSSProperties}>
                  <img loading="lazy" decoding="async" className="fill" src={`/img/${INSTANTES_IMG[n].img}.jpg`} alt={i.alt} style={{ objectPosition: INSTANTES_IMG[n].pos }} />
                  <span className="num">{i.tag}</span>
                  <div className="cap"><b>{i.title}</b><span>{i.text}</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VINO */}
        <section id="vino" className="section" style={{ paddingTop: 20, paddingBottom: 160 }}>
          <div className="wrap wine-grid">
            <div className="wine-stage" data-reveal>
              <div aria-hidden="true" className="plate cut" />
              <div aria-hidden="true" className="ghost"><span data-parallax="0.12" style={{ display: "inline-block" }}>ASPA</span></div>
              <div aria-hidden="true" className="shadow" />
              <div className="bottle"><img loading="lazy" decoding="async" src="/img/bottle.png" alt={t.vino.bottleAlt} style={{ width: "100%", height: "100%" }} /></div>
              <div className="score">
                <span className="serif" data-count="95" style={{ fontSize: 54, lineHeight: 1 }}>95</span>
                <span className="marcellus" style={{ fontSize: 11, letterSpacing: ".24em", marginTop: 4 }}>{t.vino.points}</span>
              </div>
            </div>
            <div className="up" style={{ flex: "1 1 440px", minWidth: 0 }}>
              <p className="kicker"><Peaks />{t.vino.kicker}</p>
              <h2 className="h-xl" style={{ marginBottom: 28, fontSize: 68, lineHeight: 1 }}>
                ASPA <em style={{ fontWeight: 300, color: "var(--gold-dark)" }}>{t.vino.name}</em>
              </h2>
              <p className="copy" style={{ margin: "0 0 18px" }}>{t.vino.p1}</p>
              <p className="copy" style={{ margin: "0 0 36px" }}>{t.vino.p2}</p>
              <div className="specs">
                {t.vino.specs.map((s) => (
                  <div key={s.k}><span className="eyebrow">{s.k}</span><b>{s.v}</b></div>
                ))}
              </div>
              <figure style={{ margin: "0 0 40px", position: "relative", paddingTop: 34 }}>
                <span aria-hidden="true" className="serif" style={{ position: "absolute", left: -6, top: -26, fontSize: 110, lineHeight: 1, color: "var(--gold)" }}>“</span>
                <blockquote className="serif" style={{ margin: 0, fontStyle: "italic", fontSize: 30, lineHeight: 1.3 }}>{t.vino.quote}</blockquote>
                <figcaption className="marcellus" style={{ marginTop: 16, fontSize: 12, letterSpacing: ".2em", color: "#5a554c" }}>{t.vino.quoteBy}</figcaption>
              </figure>
              <a href="#reservar" className="link-circle">
                <span className="circ ring"><Arrow /></span>
                {t.vino.cta}
              </a>
            </div>
          </div>
        </section>

        {/* EXPERIENCIAS */}
        <section id="experiencias" className="section dark pad-lg" style={{ paddingTop: 140, paddingBottom: 150 }}>
          <div className="wrap">
            <div className="up" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: 28, marginBottom: 64 }}>
              <div style={{ maxWidth: 680 }}>
                <p className="kicker on-dark"><Peaks />{t.experiencias.kicker}</p>
                <h2 className="h-xl" style={{ fontWeight: 300, fontSize: 64 }}><Words text={t.experiencias.title} /></h2>
              </div>
              <p style={{ margin: 0, maxWidth: 380, fontSize: 16, lineHeight: 1.7, color: "#c9c4b8" }}>{t.experiencias.lead}</p>
            </div>
            <div className="cards">
              {t.experiencias.items.map((e, n) => (
                <a key={n} className="card up" href="#reservar" style={{ "--d": `${n * 0.15}s` } as React.CSSProperties}>
                  <div className="cut zoom rv" style={{ height: 460, position: "relative", "--d": `${n * 0.15 + 0.1}s` } as React.CSSProperties}>
                    <div className="zi"><img loading="lazy" decoding="async" className="fill" src={`/img/${EXPERIENCIAS_IMG[n]}.jpg`} alt={e.alt} /></div>
                  </div>
                  <div className="meta"><span>{e.a}</span><span>{e.b}</span></div>
                  <h3>{e.title}</h3>
                  <p>{e.text}</p>
                  <div className="price">
                    <span>{e.price} <small>{t.experiencias.perPerson}</small></span>
                    <span className="more">{t.experiencias.book}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* RESERVAR */}
        <section id="reservar" className="section pad-lg" style={{ paddingTop: 150, paddingBottom: 150 }}>
          <div className="wrap reserva-grid">
            <div className="up" style={{ flex: "1 1 440px", minWidth: 0 }}>
              <p className="kicker"><Peaks />{t.reservar.kicker}</p>
              <h2 className="h-xl" style={{ marginBottom: 28, fontSize: 72, lineHeight: 0.98 }}>
                {t.reservar.title} <em style={{ fontWeight: 300, color: "var(--gold-dark)" }}>{t.reservar.titleEm}</em>
              </h2>
              <p className="copy" style={{ margin: "0 0 44px", maxWidth: 420 }}>{t.reservar.lead}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 18, fontSize: 15, color: "var(--body)" }}>
                <div className="info-row">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a5e0e" strokeWidth="1.4" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
                  {t.reservar.address}
                </div>
                <div className="info-row">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a5e0e" strokeWidth="1.4" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                  {t.reservar.hours}
                </div>
                <div className="info-row">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a5e0e" strokeWidth="1.4" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
                  +54 9 261 555-0142
                </div>
              </div>
            </div>
            <ReservaForm t={t.form} experiences={t.experiencias.items.map((e) => e.title)} />
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer id="contacto" className="footer">
        <div className="wrap">
          <div className="footer-grid" data-reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <img loading="lazy" decoding="async" src="/img/logo-light.png" alt="ASPA" style={{ height: 64, width: "auto" }} />
                <span className="marcellus" style={{ fontSize: 13, letterSpacing: ".32em", color: "var(--paper)" }}>ASPA</span>
              </span>
              <span className="muted">
                {t.footer.addressLines.map((l, i) => (
                  <span key={i}>{l}<br /></span>
                ))}
              </span>
            </div>
            <div>
              <h4>{t.footer.hoursTitle}</h4>
              <span className="muted">
                {t.footer.hours.map((l, i) => (
                  <span key={i}>{l}<br /></span>
                ))}
              </span>
            </div>
            <div><h4>{t.footer.contactTitle}</h4><a href="tel:+5492615550142">+54 9 261 555-0142</a><a href="mailto:hola@vinoaspa.com.ar">hola@vinoaspa.com.ar</a></div>
            <div><h4>{t.footer.followTitle}</h4><a href="#">Instagram</a><a href="#">Facebook</a></div>
          </div>
          <div className="footer-bottom">
            <span>{t.footer.copyright}</span>
            <span>{t.footer.legal}</span>
            <span style={{ display: "flex", gap: 20 }}><a href="#">{t.footer.privacy}</a><a href="#">{t.footer.cookies}</a></span>
          </div>
        </div>
      </footer>
    </>
  );
}
