import * as React from "react";

import { ImageFit, PLUGIN_FILMSTRIP, RenderFunction } from "../../index.js";
import { Filmstrip } from "./Filmstrip.js";
import type { FilmstripRef } from "./FilmstripContext.js";
import type { FilmstripScrollViewportMax } from "./props.js";

declare module "../../types.js" {
  interface LightboxProps {
    /** Filmstrip plugin settings (scrollable virtualized rail). */
    filmstrip?: {
      ref?: React.ForwardedRef<FilmstripRef>;
      position?: "top" | "bottom" | "start" | "end";
      width?: number;
      height?: number;
      border?: number;
      borderStyle?: string;
      borderColor?: string;
      borderRadius?: number;
      padding?: number;
      gap?: number;
      imageFit?: ImageFit;
      vignette?: boolean;
      hidden?: boolean;
      showToggle?: boolean;
      /**
       * When `true`, hides scrollbars on the filmstrip viewport while keeping scroll.
       * Default `false` (native scrollbar visible).
       */
      hideScrollbar?: boolean;
      /**
       * Max size of the inner scroll viewport on the strip axis.
       * Omit for default compact cap; `'full'` for 100%; `number` for px (clamped with `min(..., 100%)`); `string` for raw CSS.
       */
      scrollViewportMax?: FilmstripScrollViewportMax;
    };
  }

  interface Render {
    buttonFilmstrip?: RenderFunction<FilmstripRef>;
    iconFilmstripVisible?: RenderFunction;
    iconFilmstripHidden?: RenderFunction;
  }

  interface Labels {
    /** Filmstrip nav `aria-label` */
    Filmstrip?: string;
    /** Show filmstrip toolbar button title */
    "Show filmstrip"?: string;
    /** Hide filmstrip toolbar button title */
    "Hide filmstrip"?: string;
  }

  interface SlotType {
    /** filmstrip rail shell (outer padding / background) */
    filmstripContainer: "filmstripContainer";
    /** filmstrip virtual track (width/height of the scrollable content) */
    filmstripTrack: "filmstripTrack";
    /** filmstrip cell button (`yarl__filmstrip_thumbnail`) */
    filmstripThumbnail: "filmstripThumbnail";
    /** inner scroll viewport of the filmstrip (max width / height, overflow) */
    filmstripScrollViewport: "filmstripScrollViewport";
  }

  interface ToolbarButtonKeys {
    [PLUGIN_FILMSTRIP]: null;
  }
}

export type { FilmstripRef } from "./FilmstripContext.js";
export type { FilmstripScrollViewportMax } from "./props.js";
export default Filmstrip;
