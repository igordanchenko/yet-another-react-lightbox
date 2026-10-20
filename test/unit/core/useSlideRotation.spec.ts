import * as React from "react";
import { renderHook } from "@testing-library/react";

import { SlideRotationContext, useSlideRotation } from "../../../src/contexts/SlideRotation.js";

function renderWithRotation(rotation: number) {
  return renderHook(() => useSlideRotation({ src: "image1" }), {
    wrapper: ({ children }) => React.createElement(SlideRotationContext.Provider, { value: () => rotation }, children),
  });
}

describe("useSlideRotation", () => {
  it("returns 0 without a provider", () => {
    const { result } = renderHook(() => useSlideRotation({ src: "image1" }));

    expect(result.current).toBe(0);
  });

  it("returns 0 without a slide", () => {
    const { result } = renderHook(() => useSlideRotation(), {
      wrapper: ({ children }) => React.createElement(SlideRotationContext.Provider, { value: () => 90 }, children),
    });

    expect(result.current).toBe(0);
  });

  it.each([
    [90, 90],
    [450, 90],
    [-90, 270],
    [45, 90],
    [Number.NaN, 0],
    [Number.POSITIVE_INFINITY, 0],
  ])("normalizes provided rotation %s to %s", (rotation, expected) => {
    const { result } = renderWithRotation(rotation);

    expect(result.current).toBe(expected);
  });
});
