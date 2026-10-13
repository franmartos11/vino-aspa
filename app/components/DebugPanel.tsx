"use client";

import { useEffect, useState } from "react";
import type { DebugState } from "./Motion";

/**
 * Panel de diagnóstico: solo aparece con ?debug=1 en la URL.
 * Muestra el estado de las animaciones y qué elemento ocupa el centro de la pantalla,
 * para depurar navegadores donde no podemos conectarnos (Safari en iPhone).
 */
export default function DebugPanel() {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    if (!/[?&]debug/.test(location.search)) return;
    const errors: string[] = [];
    const onErr = (e: ErrorEvent) => errors.push(`${e.message} @${(e.filename || "").split("/").pop()}:${e.lineno}`);
    const onRej = (e: PromiseRejectionEvent) => errors.push("promise: " + String(e.reason));
    window.addEventListener("error", onErr);
    window.addEventListener("unhandledrejection", onRej);

    const describe = (el: Element | null) => {
      if (!el) return "nada";
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return `<${el.tagName.toLowerCase()} class="${String(el.className).slice(0, 40)}"> op=${cs.opacity} vis=${cs.visibility} tr=${cs.translate}/${cs.transform.slice(0, 20)} clip=${cs.clipPath.slice(0, 20)} top=${Math.round(r.top)} h=${Math.round(r.height)}`;
    };

    const tick = () => {
      const d = (window as Window & { __aspaDebug?: DebugState }).__aspaDebug ?? {};
      const all = [...document.querySelectorAll(".up, .rv, [data-reveal]")];
      const center = document.elementFromPoint(innerWidth / 2, innerHeight / 2);
      // Cadena de ancestros del elemento central con opacidad/visibilidad que lo ocultan
      const hiders: string[] = [];
      for (let el = center; el && el !== document.documentElement; el = el.parentElement) {
        const cs = getComputedStyle(el);
        if (cs.opacity !== "1" || cs.visibility !== "visible" || cs.clipPath !== "none" || cs.display === "none")
          hiders.push(`${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]} op=${cs.opacity} clip=${cs.clipPath.slice(0, 18)}`);
      }
      const firstUp = document.querySelector("#intro .up");
      setText(
        [
          `UA: ${navigator.userAgent}`,
          `vp=${innerWidth}x${innerHeight} client=${document.documentElement.clientHeight} y=${Math.round(scrollY)} H=${document.documentElement.scrollHeight} dpr=${devicePixelRatio}`,
          `html: "${document.documentElement.className.replace(/__variable_\w+|[a-z]+_[a-z0-9]+__variable/g, "").trim()}"`,
          `effect=${d.effectRan} setupOk=${d.setupOk} err=${d.setupError ?? "-"} pending=${d.pending?.() ?? "?"}`,
          `revelados ${all.filter((e) => e.classList.contains("is-in")).length}/${all.length} · IO=${typeof IntersectionObserver} · timeline=${CSS.supports("animation-timeline: view()")} · translate=${CSS.supports("translate: 0 1px")}`,
          `intro .up: ${describe(firstUp)}`,
          `centro: ${describe(center)}`,
          `ocultan: ${hiders.join(" > ") || "nada"}`,
          `errores: ${errors.join(" | ") || "ninguno"}`,
        ].join("\n"),
      );
    };
    tick();
    const id = setInterval(tick, 700);
    return () => {
      clearInterval(id);
      window.removeEventListener("error", onErr);
      window.removeEventListener("unhandledrejection", onRej);
    };
  }, []);

  if (!text) return null;
  return (
    <pre
      style={{
        position: "fixed", left: 6, right: 6, bottom: 6, zIndex: 9999, margin: 0, padding: 8,
        maxHeight: "45vh", overflow: "auto", background: "rgba(0,0,0,.85)", color: "#9f9",
        font: "10px/1.35 ui-monospace, Menlo, monospace", whiteSpace: "pre-wrap", wordBreak: "break-all", borderRadius: 6,
      }}
    >
      {text}
    </pre>
  );
}
