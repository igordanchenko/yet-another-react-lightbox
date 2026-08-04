import { LightboxProps, useLightboxProps } from "../../index.js";

export type FilmstripScrollViewportMax = "full" | number | string | undefined;

export const defaultFilmstripProps = {
  ref: null,
  position: "bottom" as const,
  width: 120,
  height: 80,
  border: 1,
  borderRadius: 4,
  padding: 4,
  gap: 16,
  imageFit: "contain" as const,
  vignette: true,
  hidden: false,
  showToggle: false,
  hideScrollbar: false,
  scrollViewportMax: undefined as FilmstripScrollViewportMax,
};

export const resolveFilmstripProps = (filmstrip?: LightboxProps["filmstrip"]) => ({
  ...defaultFilmstripProps,
  ...filmstrip,
});

export type ResolvedFilmstripProps = ReturnType<typeof resolveFilmstripProps>;

export function useFilmstripProps() {
  const { filmstrip } = useLightboxProps();
  return resolveFilmstripProps(filmstrip);
}
