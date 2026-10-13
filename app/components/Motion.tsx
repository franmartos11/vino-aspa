"use client";

import { useEffect } from "react";

/**
 * Animaciones globales de la landing:
 * - [data-reveal]: agrega .is-in cuando el elemento entra en pantalla.
 * - [data-parallax="0.15"]: desplaza el elemento según el scroll (propiedad `translate`).
 * - [data-count="95"]: cuenta desde 0 hasta el número al aparecer.
 * - Barra de progreso de lectura y header que se oculta al bajar.
 * - Links internos (#seccion): desplazamiento suave con aceleración y frenado.
 * - Menú: marca el link de la sección visible.
 */
export default function Motion() {
  useEffect(() => {
    try {
      return setup();
    } catch (err) {
      document.documentElement.classList.remove("motion");
      console.error(err);
    }
  }, []);

  return <div className="progress" aria-hidden="true" />;
}

function setup() {
  const root = document.documentElement;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector<HTMLElement>(".site-header");

  // Al cambiar de idioma se vuelve a la misma altura de la página
  try {
    const saved = sessionStorage.getItem("aspa-scroll");
    if (saved !== null) {
      sessionStorage.removeItem("aspa-scroll");
      window.scrollTo(0, Number(saved));
    }
  } catch {}

  // ---- Aparición al entrar en pantalla ----
  // El contenido es visible por defecto. Solo se oculta (clase .motion en <html>) una vez que este
  // código está corriendo, y se revela por tres vías independientes: IntersectionObserver, el
  // evento scroll y un control periódico. Si una falla (Safari privado, navegador viejo), las otras
  // lo cubren; si falla todo el setup, .motion nunca se agrega y la página se ve completa.
  const viewportH = () => window.innerHeight || root.clientHeight || 800;
  const pending = new Set(document.querySelectorAll<HTMLElement>(".up, .rv, [data-reveal], [data-count]"));

  const reveal = (el: HTMLElement) => {
    if (!pending.delete(el)) return;
    el.classList.add("is-in");
    if (el.dataset.count) countUp(el, Number(el.dataset.count), reduced);
    io?.unobserve(el);
  };

  // Revela todo lo que ya esté a la vista o por encima (borde superior antes del 92 % de la pantalla)
  const sweep = () => {
    const limit = viewportH() * 0.92;
    for (const el of pending) {
      if (el.getBoundingClientRect().top < limit) reveal(el);
    }
    if (!pending.size) stopWatch();
  };

  // Lo visible al cargar se muestra sin animar, para que nada parpadee
  for (const el of pending) {
    if (el.getBoundingClientRect().top < viewportH()) {
      pending.delete(el);
      el.classList.add("is-in");
    }
  }

  let io: IntersectionObserver | null = null;
  try {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) reveal(e.target as HTMLElement);
      },
      // Sin umbral de área: los bloques muy altos (texto largo en móvil) también se revelan
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );
    pending.forEach((el) => io!.observe(el));
  } catch {}

  const watch = window.setInterval(sweep, 400);
  function stopWatch() {
    window.clearInterval(watch);
  }

  // Recién ahora, con los mecanismos de revelado andando, se activa el estado oculto
  root.classList.add("motion");

  // Sección activa en el menú
  const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(".nav-links a[href^='#']"));
  let spy: IntersectionObserver | null = null;
  try {
    spy = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const id = `#${e.target.id}`;
          navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === id));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("main > section[id], footer[id]").forEach((s) => spy!.observe(s));
  } catch {}

  // Desplazamiento suave hacia las anclas
  let autoScroll: { raf: number } | null = null;

  const stopAutoScroll = () => {
    if (!autoScroll) return;
    cancelAnimationFrame(autoScroll.raf);
    autoScroll = null;
    root.classList.remove("is-auto-scrolling");
  };

  const scrollToTarget = (hash: string) => {
    const target = hash === "#top" ? null : document.querySelector<HTMLElement>(hash);
    if (hash !== "#top" && !target) return false;

    const offset = header ? header.offsetHeight : 0;
    const max = root.scrollHeight - window.innerHeight;
    const to = target ? Math.min(max, Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset)) : 0;
    const from = window.scrollY;
    const distance = to - from;

    stopAutoScroll();
    header?.classList.remove("is-hidden");

    if (reduced || Math.abs(distance) < 2) {
      window.scrollTo(0, to);
    } else {
      // Más distancia = un poco más de tiempo, siempre entre 0,9 s y 2,2 s
      const duration = Math.min(2200, Math.max(900, 600 + Math.abs(distance) * 0.3));
      const start = performance.now();
      root.classList.add("is-auto-scrolling");
      const state = { raf: 0 };
      autoScroll = state;
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        window.scrollTo(0, from + distance * easeInOutCubic(t));
        if (t < 1 && autoScroll === state) {
          state.raf = requestAnimationFrame(step);
        } else if (autoScroll === state) {
          autoScroll = null;
          root.classList.remove("is-auto-scrolling");
          // Accesibilidad: el foco del teclado sigue al destino
          if (target) {
            if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
          }
        }
      };
      state.raf = requestAnimationFrame(step);
    }

    history.pushState(null, "", hash === "#top" ? location.pathname : hash);
    return true;
  };

  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as Element).closest?.("a[href^='#']") as HTMLAnchorElement | null;
    if (!a) return;
    const hash = a.getAttribute("href")!;
    if (hash.length < 2) return;
    if (scrollToTarget(hash)) e.preventDefault();
  };
  document.addEventListener("click", onClick);

  // Si el usuario toma el control, se corta la animación
  const cancelEvents = ["wheel", "touchstart", "keydown", "mousedown"] as const;
  cancelEvents.forEach((ev) => window.addEventListener(ev, stopAutoScroll, { passive: true }));

  // Scroll: parallax, progreso y header
  const parallax = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]")).map((el) => ({
    el,
    speed: Number(el.dataset.parallax) || 0.1,
    base: 0,
  }));
  // Scroll en el que cada elemento queda centrado (sin desplazamiento); el hero arranca en 0.
  const measure = () => {
    for (const p of parallax) {
      p.el.style.translate = "";
      const r = p.el.getBoundingClientRect();
      p.base = Math.max(0, r.top + window.scrollY + r.height / 2 - window.innerHeight / 2);
    }
  };
  measure();

  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;
    const max = root.scrollHeight - vh;
    root.style.setProperty("--progress", String(max > 0 ? y / max : 0));

    // Durante un desplazamiento automático el header queda visible
    if (header && !autoScroll) {
      header.classList.toggle("is-scrolled", y > 40);
      if (y > 400 && y > lastY + 4) header.classList.add("is-hidden");
      else if (y < lastY - 4 || y <= 400) header.classList.remove("is-hidden");
    } else if (header) {
      header.classList.toggle("is-scrolled", y > 40);
    }
    lastY = y;

    if (reduced) return;
    for (const p of parallax) {
      if (Math.abs(y - p.base) > vh * 1.5) continue;
      p.el.style.translate = `0 ${((p.base - y) * p.speed).toFixed(1)}px`;
    }
  };

  const onScroll = () => {
    if (pending.size) sweep();
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  const onResize = () => {
    measure();
    onScroll();
  };
  window.addEventListener("resize", onResize);

  return () => {
    io?.disconnect();
    spy?.disconnect();
    stopWatch();
    stopAutoScroll();
    document.removeEventListener("click", onClick);
    cancelEvents.forEach((ev) => window.removeEventListener(ev, stopAutoScroll));
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
  };
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function countUp(el: HTMLElement, to: number, reduced: boolean) {
  if (reduced) {
    el.textContent = String(to);
    return;
  }
  const start = performance.now();
  const dur = 1600;
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = String(Math.round(to * eased));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
