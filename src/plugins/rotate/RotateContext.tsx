import * as React from "react";

import {
  ComponentProps,
  getSlideKey,
  isImageSlide,
  makeUseContext,
  normalizeRotation,
  RotateRef,
  Slide,
  SlideRotationContext,
  useEventCallback,
  useLightboxProps,
  useLightboxState,
} from "../../index.js";
import { useRotateProps } from "./props.js";

export const RotateContext = React.createContext<RotateRef | null>(null);

export const useRotate = makeUseContext("useRotate", "RotateContext", RotateContext);

export function RotateContextProvider({ children }: ComponentProps) {
  // keyed by slide key rather than slide index, so that rotation survives navigation and slides changes
  const [rotations, setRotations] = React.useState<ReadonlyMap<string, number>>(() => new Map());

  const { currentSlide, currentIndex } = useLightboxState();
  const { on } = useLightboxProps();
  const { ref } = useRotateProps();

  const getRotation = React.useCallback(
    (slide: Slide) => {
      const key = getSlideKey(slide);
      if (!key || !isImageSlide(slide)) return 0;
      return normalizeRotation(rotations.get(key) ?? slide.rotation ?? 0);
    },
    [rotations],
  );

  const currentKey = currentSlide && isImageSlide(currentSlide) ? getSlideKey(currentSlide) : undefined;
  const rotation = currentSlide ? getRotation(currentSlide) : 0;
  const disabled = !currentKey;

  const rotateBy = useEventCallback((delta: number) => {
    if (!currentKey) return;

    const newRotation = normalizeRotation(rotation + delta);

    setRotations((prev) => new Map(prev).set(currentKey, newRotation));
    on.rotate?.({ index: currentIndex, rotation: newRotation });
  });

  const rotateClockwise = React.useCallback(() => rotateBy(90), [rotateBy]);

  const rotateCounterClockwise = React.useCallback(() => rotateBy(-90), [rotateBy]);

  const context = React.useMemo(
    () => ({ rotation, disabled, rotateClockwise, rotateCounterClockwise }),
    [rotation, disabled, rotateClockwise, rotateCounterClockwise],
  );

  React.useImperativeHandle(ref, () => context, [context]);

  return (
    <SlideRotationContext.Provider value={getRotation}>
      <RotateContext.Provider value={context}>{children}</RotateContext.Provider>
    </SlideRotationContext.Provider>
  );
}
