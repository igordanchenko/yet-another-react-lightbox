import * as React from "react";

import {
  ComponentProps,
  isImageSlide,
  LightboxStateContext,
  makeUseContext,
  RotateRef,
  useLayoutEffect,
  useLightboxProps,
  useLightboxState,
} from "../../index.js";

const RotateContext = React.createContext<RotateRef | null>(null);

export const useRotate = makeUseContext("useRotate", "RotateContext", RotateContext);

export function RotateContextProvider({ children }: ComponentProps) {
  const [rotation, setRotation] = React.useState(0);
  const state = useLightboxState();
  const { currentSlide, currentIndex, globalIndex } = state;
  const { on } = useLightboxProps();
  const disabled = !currentSlide || !isImageSlide(currentSlide);
  const source = currentSlide && isImageSlide(currentSlide) ? currentSlide.src : undefined;

  useLayoutEffect(() => setRotation(0), [globalIndex, source]);

  const rotate = () => {
    if (!disabled) {
      const nextRotation = (rotation + 90) % 360;
      setRotation(nextRotation);
      on.rotate?.({ index: currentIndex, rotation: nextRotation });
    }
  };

  const slides = React.useMemo(
    () =>
      rotation
        ? state.slides.map((slide, index) =>
            index === currentIndex && isImageSlide(slide)
              ? { ...slide, rotation: ((slide.rotation || 0) + rotation) % 360 }
              : slide,
          )
        : state.slides,
    [state.slides, currentIndex, rotation],
  );
  const rotatedState = { ...state, slides, currentSlide: slides[currentIndex] };

  return (
    <RotateContext.Provider value={{ rotation, disabled, rotate }}>
      <LightboxStateContext.Provider value={{ ...rotatedState, state: rotatedState }}>
        {children}
      </LightboxStateContext.Provider>
    </RotateContext.Provider>
  );
}
