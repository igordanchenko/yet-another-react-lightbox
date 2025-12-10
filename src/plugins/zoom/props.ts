import { LightboxProps } from "../../index.js";

export const defaultZoomProps = {
  minZoom: 1,
  maxZoomPixelRatio: 1,
  zoomInMultiplier: 2,
  doubleTapDelay: 300,
  doubleClickDelay: 500,
  doubleClickMaxStops: 2,
  keyboardMoveDistance: 50,
  wheelZoomDistanceFactor: 100,
  pinchZoomDistanceFactor: 100,
  pinchZoomV4: false,
  scrollToZoom: false,
};

function validateMinZoom(minZoom: number) {
  return Math.min(Math.max(minZoom, Number.EPSILON), 1);
}

export function resolveZoomProps(zoom: LightboxProps["zoom"]) {
  const { minZoom, ...rest } = { ...defaultZoomProps, ...zoom };
  return { minZoom: validateMinZoom(minZoom), ...rest };
}
