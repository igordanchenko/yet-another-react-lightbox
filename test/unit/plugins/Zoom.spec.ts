import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";

import { clickButton, expectLightboxToBeOpen, findCurrentSlide, lightbox, querySelector } from "../test-utils.js";
import { Zoom } from "../../../src/plugins/index.js";
import type { GenericSlide, Slide, ZoomRef } from "../../../src/types.js";

declare module "../../../src/types.js" {
  interface SlideTypes {
    "custom-slide": CustomSlide;
  }
}

interface CustomSlide extends GenericSlide {
  type: "custom-slide";
}

function customSlideRenderer({ slide }: { slide: Slide }) {
  if (slide.type === "custom-slide") {
    return React.createElement("div", { "data-testid": "custom-slide" });
  }
  return undefined;
}

describe("Zoom", () => {
  it("renders without crashing", async () => {
    render(
      lightbox({
        slides: Array.from({ length: 3 }).map((_, i) => ({
          src: `image${i + 1}`,
          width: 3000,
          height: 2000,
        })),
        plugins: [Zoom],
      }),
    );

    act(() => {
      screen.getByLabelText("Zoom in").click();
    });

    act(() => {
      screen.getByLabelText("Zoom out").click();
    });

    expectLightboxToBeOpen();
  });

  it("supports custom slide types", () => {
    render(
      lightbox({
        slides: [{ type: "custom-slide" }],
        plugins: [Zoom],
        zoom: { supports: ["custom-slide"] },
        render: { slide: customSlideRenderer },
      }),
    );

    const customSlide = findCurrentSlide()?.querySelector("[data-testid='custom-slide']");
    expect(customSlide).toBeInTheDocument();
    expect(customSlide?.closest(".yarl__slide_wrapper")).toBeInTheDocument();
  });

  it("does not wrap unsupported custom slide types", () => {
    render(
      lightbox({
        slides: [{ type: "custom-slide" }],
        plugins: [Zoom],
        render: { slide: customSlideRenderer },
      }),
    );

    const customSlide = findCurrentSlide()?.querySelector("[data-testid='custom-slide']");
    expect(customSlide).toBeInTheDocument();
    expect(customSlide?.closest(".yarl__slide_wrapper")).toBeNull();
  });

  it("supports maxZoom as a function", () => {
    render(
      lightbox({
        slides: [{ type: "custom-slide" }],
        plugins: [Zoom],
        zoom: {
          supports: ["custom-slide"],
          maxZoom: (slide: Slide) => (slide.type === "custom-slide" ? 5 : undefined),
        },
        render: { slide: customSlideRenderer },
      }),
    );

    const customSlide = findCurrentSlide()?.querySelector("[data-testid='custom-slide']");
    expect(customSlide).toBeInTheDocument();
    expect(customSlide?.closest(".yarl__slide_wrapper")).toBeInTheDocument();
  });

  describe("back-to-back zoom changes", () => {
    function renderZoom() {
      const ref = React.createRef<ZoomRef>();
      const zoom = vi.fn();

      render(
        lightbox({
          slides: [1, 2].map((i) => ({ src: `image${i}`, width: 8000, height: 6000 })),
          plugins: [Zoom],
          zoom: { ref },
          on: { zoom },
        }),
      );

      expect(ref.current!.maxZoom).toBeGreaterThan(4.5);

      return { ref, zoom };
    }

    it("accumulates back-to-back zoom changes before re-render", () => {
      const { ref, zoom } = renderZoom();

      act(() => {
        ref.current!.zoomIn();
        ref.current!.zoomIn();
      });
      expect(ref.current!.zoom).toBe(4);
      expect(zoom).toHaveBeenLastCalledWith({ zoom: 4 });

      act(() => {
        ref.current!.zoomOut();
        ref.current!.zoomIn();
        ref.current!.zoomOut();
      });
      expect(ref.current!.zoom).toBe(2);
      expect(zoom).toHaveBeenLastCalledWith({ zoom: 2 });

      // zoom of another slide does not build on the previous slide's zoom
      clickButton("Next");
      act(() => {
        ref.current!.zoomIn();
      });
      expect(ref.current!.zoom).toBe(2);
      expect(ref.current!.offsetX).toBe(0);
    });

    it("accumulates back-to-back offset changes before re-render", () => {
      const { ref } = renderZoom();

      act(() => {
        ref.current!.changeZoom(2, true, 100, 0);
        ref.current!.changeZoom(4, true, -100, 0);
      });
      expect(ref.current!.zoom).toBe(4);
      expect(ref.current!.offsetX).toBe(-25);
      expect(ref.current!.offsetY).toBe(0);
    });

    it("accumulates wheel events dispatched before re-render", () => {
      const { ref } = renderZoom();
      const container = querySelector(".yarl__container")!;

      act(() => {
        ref.current!.changeZoom(2, true);
      });

      // both wheel events are dispatched before re-render, so the second one must build on the first
      act(() => {
        fireEvent.wheel(container, { deltaY: -50, ctrlKey: true });
        fireEvent.wheel(container, { deltaY: -50, ctrlKey: true });
      });
      expect(ref.current!.zoom).toBe(4.5);

      act(() => {
        fireEvent.wheel(container, { deltaX: 10 });
        fireEvent.wheel(container, { deltaX: 10 });
      });
      expect(ref.current!.offsetX).toBe(-20);
    });
  });
});
