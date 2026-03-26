import * as React from "react";

import { createIcon, createIconDisabled, IconButton, useLightboxProps } from "../../index.js";
import { useFilmstrip } from "./FilmstripContext.js";

const filmstripIcon = () => (
  <>
    <path strokeWidth={2} stroke="currentColor" strokeLinejoin="round" fill="none" d="M3 5l18 0l0 14l-18 0l0-14z" />
    <path d="M5 14h4v3h-4zM10 14h4v3h-4zM15 14h4v3h-4z" />
  </>
);

const FilmstripVisible = createIcon("FilmstripVisible", filmstripIcon());

const FilmstripHidden = createIconDisabled("FilmstripHidden", filmstripIcon());

export function FilmstripButton() {
  const { visible, show, hide } = useFilmstrip();
  const { render } = useLightboxProps();

  if (render.buttonFilmstrip) {
    return <>{render.buttonFilmstrip({ visible, show, hide })}</>;
  }

  return (
    <IconButton
      label={visible ? "Hide filmstrip" : "Show filmstrip"}
      icon={visible ? FilmstripVisible : FilmstripHidden}
      renderIcon={visible ? render.iconFilmstripVisible : render.iconFilmstripHidden}
      onClick={visible ? hide : show}
    />
  );
}
