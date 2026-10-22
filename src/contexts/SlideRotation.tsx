import * as React from "react";

import { Slide } from "../types.js";
import { normalizeRotation } from "../utils.js";

export type SlideRotationContextType = (slide: Slide) => number;

export const SlideRotationContext = React.createContext<SlideRotationContextType | null>(null);

/** clockwise rotation of the given slide in degrees (0, 90, 180 or 270; always `0` unless provided by a plugin) */
export function useSlideRotation(slide?: Slide) {
  const getRotation = React.useContext(SlideRotationContext);
  return slide && getRotation ? normalizeRotation(getRotation(slide)) : 0;
}
