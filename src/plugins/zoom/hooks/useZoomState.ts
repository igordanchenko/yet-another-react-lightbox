import * as React from "react";

import {
  ContainerRect,
  isImageSlide,
  round,
  useController,
  useEventCallback,
  useLayoutEffect,
  useLightboxState,
  useSlideRotation,
} from "../../../index.js";
import { useZoomProps } from "./useZoomProps.js";
import { useZoomAnimation } from "./useZoomAnimation.js";

export function useZoomState(
  imageRect: ContainerRect,
  maxZoom: number,
  zoomWrapperRef?: React.RefObject<HTMLDivElement | null>,
) {
  const [zoom, setZoom] = React.useState(1);
  const [offsetX, setOffsetX] = React.useState(0);
  const [offsetY, setOffsetY] = React.useState(0);
  // the latest zoom and offsets, which may not be committed yet when state changes are requested back-to-back
  const latest = React.useRef({ zoom, offsetX, offsetY });

  const animate = useZoomAnimation(zoom, offsetX, offsetY, zoomWrapperRef);

  const { currentSlide, globalIndex } = useLightboxState();
  const { containerRect, slideRect } = useController();
  const { minZoom, zoomInMultiplier } = useZoomProps();

  // TODO v4: use `slide.key` to reset zoom on reactive slide replacement for custom slide types
  const currentSource = currentSlide && isImageSlide(currentSlide) ? currentSlide.src : undefined;
  const rotation = useSlideRotation(currentSlide);
  const disabled = !zoomWrapperRef?.current;

  useLayoutEffect(() => {
    latest.current = { zoom: 1, offsetX: 0, offsetY: 0 };
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
  }, [globalIndex, currentSource, rotation]);

  const changeOffsets = React.useCallback(
    (dx?: number, dy?: number, targetZoom?: number) => {
      const newZoom = targetZoom || latest.current.zoom;

      const newOffsetX = latest.current.offsetX - (dx || 0);
      const newOffsetY = latest.current.offsetY - (dy || 0);

      const maxOffsetX = (imageRect.width * newZoom - slideRect.width) / 2 / newZoom;
      const maxOffsetY = (imageRect.height * newZoom - slideRect.height) / 2 / newZoom;

      latest.current.offsetX = Math.min(Math.abs(newOffsetX), Math.max(maxOffsetX, 0)) * Math.sign(newOffsetX);
      latest.current.offsetY = Math.min(Math.abs(newOffsetY), Math.max(maxOffsetY, 0)) * Math.sign(newOffsetY);

      setOffsetX(latest.current.offsetX);
      setOffsetY(latest.current.offsetY);
    },
    [slideRect, imageRect.width, imageRect.height],
  );

  const changeZoom = React.useCallback(
    (targetZoom: number, rapid?: boolean, dx?: number, dy?: number) => {
      const newZoom = round(
        targetZoom + 0.01 < maxZoom ? (targetZoom - 0.01 > minZoom ? targetZoom : minZoom) : maxZoom,
        5,
      );

      if (!rapid) {
        animate();
      }

      const { zoom: currentZoom } = latest.current;
      changeOffsets(
        dx ? dx * (1 / currentZoom - 1 / newZoom) : 0,
        dy ? dy * (1 / currentZoom - 1 / newZoom) : 0,
        newZoom,
      );

      latest.current.zoom = newZoom;
      setZoom(newZoom);
    },
    [minZoom, maxZoom, changeOffsets, animate],
  );

  const getZoom = React.useCallback(() => latest.current.zoom, []);

  const handleControllerRectChange = useEventCallback(() => {
    const currentZoom = getZoom();
    if (currentZoom > 1) {
      if (currentZoom > maxZoom) {
        changeZoom(maxZoom, true);
      }

      changeOffsets();
    }
  });

  useLayoutEffect(handleControllerRectChange, [containerRect.width, containerRect.height, handleControllerRectChange]);

  const zoomIn = React.useCallback(() => {
    const currentZoom = getZoom();
    const targetZoom = currentZoom * zoomInMultiplier;
    changeZoom(currentZoom < 1 && targetZoom > 1 ? 1 : targetZoom);
  }, [zoomInMultiplier, getZoom, changeZoom]);

  const zoomOut = React.useCallback(() => {
    const currentZoom = getZoom();
    const targetZoom = currentZoom / zoomInMultiplier;
    changeZoom(currentZoom > 1 && targetZoom < 1 ? 1 : targetZoom);
  }, [zoomInMultiplier, getZoom, changeZoom]);

  return { zoom, offsetX, offsetY, disabled, getZoom, changeOffsets, changeZoom, zoomIn, zoomOut };
}
