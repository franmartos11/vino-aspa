"use client";

import { useState } from "react";
import type React from "react";
import type { Dictionary } from "../[lang]/dictionaries";

type Props = { t: Dictionary["form"]; experiences: string[] };

export default function ReservaForm({ t, experiences }: Props) {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="reserva-form up"
      style={{ "--d": "0.2s" } as React.CSSProperties}
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <label>
        {t.name}
        <input type="text" name="nombre" required placeholder={t.namePh} />
      </label>
      <label>
        {t.email}
        <input type="email" name="email" required placeholder={t.emailPh} />
      </label>
      <label>
        {t.experience}
        <select name="experiencia">
          {experiences.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label>
        {t.people}
        <select name="personas" defaultValue={t.peopleOptions[1]}>
          {t.peopleOptions.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </label>
      <label className="full">
        {t.date}
        <input type="date" name="fecha" />
      </label>
      <label className="full">
        {t.comments}
        <textarea name="comentarios" rows={3} placeholder={t.commentsPh} />
      </label>
      {sent ? (
        <p className="ok" role="status">{t.thanks}</p>
      ) : (
        <button type="submit">
          {t.submit}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f2b544" strokeWidth="1.4" aria-hidden="true">
            <path d="M7 17L17 7M9 7h8v8" />
          </svg>
        </button>
      )}
    </form>
  );
}
