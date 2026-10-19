import * as React from "react";

import { createIcon, IconButton, useLightboxProps } from "../../index.js";
import { useRotate } from "./RotateContext.js";

const RotateIcon = createIcon(
  "RotateIcon",
  <path d="M16.05 7.1A5.96 5.96 0 0 0 12 5a6 6 0 1 0 6 6h2a8 8 0 1 1-8-8c2.2 0 4.2.9 5.65 2.35L21 2v8h-8z" />,
);

export function RotateButton() {
  const { render } = useLightboxProps();
  const ref = useRotate();

  if (render.buttonRotate) return <>{render.buttonRotate(ref)}</>;

  return (
    <IconButton
      label="Rotate clockwise"
      icon={RotateIcon}
      renderIcon={render.iconRotate}
      disabled={ref.disabled}
      onClick={ref.rotate}
    />
  );
}
