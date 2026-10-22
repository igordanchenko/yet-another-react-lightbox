import * as React from "react";

import { useLightboxProps } from "../../index.js";
import { useRotateProps } from "./props.js";
import { RotateButton } from "./RotateButton.js";
import { useRotate } from "./RotateContext.js";

export function RotateToolbarControl() {
  const { render } = useLightboxProps();
  const { buttons } = useRotateProps();
  const rotateRef = useRotate();

  if (render.buttonRotate) {
    return <>{render.buttonRotate(rotateRef)}</>;
  }

  return (
    <>
      {buttons !== "clockwise" && <RotateButton counterClockwise />}
      {buttons !== "counterclockwise" && <RotateButton />}
    </>
  );
}
