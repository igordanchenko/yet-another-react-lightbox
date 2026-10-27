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

  it("normalizes the provided rotation", () => {
    const { result } = renderWithRotation(-90);

    expect(result.current).toBe(270);
  });
});
