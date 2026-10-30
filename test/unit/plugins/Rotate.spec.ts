import * as React from "react";
import { act, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import {
  clickButton,
  expectCurrentImageToBe,
  expectNotToContainButton,
  expectToContainButton,
  findCurrentSlide,
  lightbox,
  querySelector,
} from "../test-utils.js";
import { Rotate, Thumbnails, Zoom } from "../../../src/plugins/index.js";
import {
  ContainerRect,
  ImageSlide,
  isImageSlide,
  LightboxExternalProps,
  RotateRef,
  Slide,
  ZoomRef,
} from "../../../src/index.js";

const slides: Slide[] = [{ src: "image1" }, { src: "image2" }, { src: "image3" }];

function renderLightbox(props?: LightboxExternalProps) {
  return render(lightbox({ slides, plugins: [Rotate], ...props }));
}

function currentRotation() {
  return findCurrentSlide()?.querySelector("img")?.style.rotate || "";
}

function expectCurrentRotationToBe(rotation: number) {
  expect(currentRotation()).toBe(rotation ? `${rotation}deg` : "");
}

describe("Rotate", () => {
  it("rotates the current slide clockwise", () => {
    const rotate = vi.fn();

    renderLightbox({ on: { rotate } });

    expectToContainButton("Rotate clockwise");
    expectToContainButton("Rotate counterclockwise");

    clickButton("Rotate clockwise");
    expectCurrentRotationToBe(90);
    expect(rotate).toHaveBeenLastCalledWith({ index: 0, rotation: 90 });

    clickButton("Rotate clockwise");
    clickButton("Rotate clockwise");
    clickButton("Rotate clockwise");
    expectCurrentRotationToBe(0);
    expect(rotate).toHaveBeenLastCalledWith({ index: 0, rotation: 0 });
  });

  it("supports buttons configuration", () => {
    const { unmount } = renderLightbox({ rotate: { buttons: "counterclockwise" } });

    expectNotToContainButton("Rotate clockwise");
    clickButton("Rotate counterclockwise");
    expectCurrentRotationToBe(270);

    unmount();

    renderLightbox({ rotate: { buttons: "clockwise" } });

    expectNotToContainButton("Rotate counterclockwise");
    clickButton("Rotate clockwise");
    expectCurrentRotationToBe(90);
  });

  it("preserves rotation across navigation", () => {
    renderLightbox();

    clickButton("Rotate clockwise");
    clickButton("Next");
    expectCurrentRotationToBe(0);

    clickButton("Previous");
    expectCurrentRotationToBe(90);
  });

  it("preserves rotation when slides are added or removed", () => {
    const { rerender } = renderLightbox({ index: 1 });

    clickButton("Rotate clockwise");
    expectCurrentRotationToBe(90);

    rerender(lightbox({ slides: [{ src: "image0" }, ...slides], index: 2, plugins: [Rotate] }));
    expectCurrentRotationToBe(90);

    rerender(lightbox({ slides: slides.filter((slide) => slide !== slides[0]), index: 0, plugins: [Rotate] }));
    expectCurrentRotationToBe(90);
  });

  it("supports initial slide rotation", () => {
    renderLightbox({
      slides: [
        { src: "image1", rotation: 450 },
        { src: "image2", rotation: -90 },
      ],
    });

    expectCurrentRotationToBe(90);

    clickButton("Next");
    expectCurrentRotationToBe(270);
  });

  it("ignores non-finite slide rotation", () => {
    const rotate = vi.fn();

    renderLightbox({ slides: [{ src: "image1", rotation: Number.NaN }], on: { rotate } });

    expectCurrentRotationToBe(0);

    clickButton("Rotate clockwise");
    expectCurrentRotationToBe(90);
    expect(rotate).toHaveBeenLastCalledWith({ index: 0, rotation: 90 });
  });

  it.each([
    [Number.NaN, 0],
    [Number.POSITIVE_INFINITY, 0],
    [60, 90],
  ])("normalizes ImageSlide rotation prop %s to %s", (rotation, expected) => {
    let slideRect: ContainerRect | undefined;

    render(
      lightbox({
        slides,
        render: {
          slide: ({ slide, rect }) => {
            slideRect = rect;
            return isImageSlide(slide) ? React.createElement(ImageSlide, { slide, rect, rotation }) : undefined;
          },
        },
      }),
    );

    expectCurrentRotationToBe(expected);
    // quarter-turn rotations swap the size limits to pixel values of the transposed slide rect
    expect(findCurrentSlide()?.querySelector("img")?.style.maxWidth).toBe(
      expected % 180 === 0 ? "100%" : `${slideRect?.height}px`,
    );
  });

  it("ignores slide rotation without the plugin", () => {
    render(lightbox({ slides: [{ src: "image1", rotation: 90 }] }));

    expectCurrentRotationToBe(0);
  });

  it("disables rotation for non-image slides", () => {
    renderLightbox({
      slides: [{ type: "custom" } as unknown as Slide],
      render: { slide: () => React.createElement("div") },
    });

    expect(screen.getByRole("button", { name: "Rotate clockwise" })).toBeDisabled();
  });

  it("supports rotate ref", () => {
    const ref = React.createRef<RotateRef>();

    renderLightbox({ rotate: { ref } });

    act(() => {
      ref.current!.rotateCounterClockwise();
    });
    expectCurrentRotationToBe(270);
    expect(ref.current!.rotation).toBe(270);

    act(() => {
      ref.current!.rotateClockwise();
    });
    expectCurrentRotationToBe(0);
    expect(ref.current!.rotation).toBe(0);
  });

  it("accumulates back-to-back rotations before re-render", () => {
    const ref = React.createRef<RotateRef>();
    const rotate = vi.fn();

    renderLightbox({ rotate: { ref }, on: { rotate } });

    act(() => {
      ref.current!.rotateClockwise();
      ref.current!.rotateClockwise();
    });
    expectCurrentRotationToBe(180);
    expect(rotate.mock.calls).toEqual([[{ index: 0, rotation: 90 }], [{ index: 0, rotation: 180 }]]);

    act(() => {
      ref.current!.rotateClockwise();
      ref.current!.rotateCounterClockwise();
    });
    expectCurrentRotationToBe(180);

    // rotation of another slide does not build on the previous slide's rotation
    clickButton("Next");
    act(() => {
      ref.current!.rotateCounterClockwise();
    });
    expectCurrentRotationToBe(270);

    clickButton("Previous");
    expectCurrentRotationToBe(180);
  });

  it("keeps rotate ref stable across re-renders", () => {
    const ref = React.createRef<RotateRef>();
    const rotate = vi.fn();

    const { rerender } = renderLightbox({ rotate: { ref }, on: { rotate } });

    const handle = ref.current;

    // a new `on` object on every render must not recreate the ref handle
    rerender(lightbox({ slides, plugins: [Rotate], rotate: { ref }, on: { rotate } }));
    expect(ref.current).toBe(handle);

    // callbacks still reach the latest `on` props
    const latestRotate = vi.fn();
    rerender(lightbox({ slides, plugins: [Rotate], rotate: { ref }, on: { rotate: latestRotate } }));

    act(() => {
      ref.current!.rotateClockwise();
    });
    expect(rotate).not.toHaveBeenCalled();
    expect(latestRotate).toHaveBeenCalledWith({ index: 0, rotation: 90 });
  });

  it("supports custom rotate control", () => {
    renderLightbox({
      render: {
        buttonRotate: ({ rotateClockwise }) =>
          React.createElement("button", { type: "button", onClick: rotateClockwise }, "Custom rotate"),
      },
    });

    expectNotToContainButton("Rotate clockwise");
    clickButton("Custom rotate");
    expectCurrentRotationToBe(90);
  });

  it.each([
    ["Rotate, Thumbnails", [Rotate, Thumbnails]],
    ["Thumbnails, Rotate", [Thumbnails, Rotate]],
  ])("rotates thumbnails regardless of plugin order (%s)", (_, plugins) => {
    render(lightbox({ slides, plugins }));

    clickButton("Rotate clockwise");

    const thumbnail = querySelector(".yarl__thumbnails_thumbnail_active img") as HTMLImageElement | null;
    expect(thumbnail?.style.rotate).toBe("90deg");
  });

  // captures the slide rect without replacing the default slide rendering
  function captureSlideRect() {
    const captured: { rect?: ContainerRect } = {};
    const slide = ({ rect }: { rect: ContainerRect }) => {
      captured.rect = rect;
      return undefined;
    };
    return { captured, slide };
  }

  it("fits rotated cover images into the transposed slide rect", () => {
    const { captured, slide } = captureSlideRect();

    renderLightbox({ carousel: { imageFit: "cover" }, render: { slide } });

    clickButton("Rotate clockwise");

    const { width, height } = captured.rect!;
    expect(height).toBeGreaterThan(0);

    const style = findCurrentSlide()?.querySelector("img")?.style;
    expect(style?.width).toBe(`${height}px`);
    expect(style?.height).toBe(`${width}px`);
  });

  it("sizes rotated contain images explicitly", () => {
    const { captured, slide } = captureSlideRect();

    renderLightbox({ slides: [{ src: "image1", width: 3840, height: 5760 }], render: { slide } });

    // unrotated images keep their intrinsic size
    const image = () => findCurrentSlide()?.querySelector("img");
    expect(image()?.style.width).toBe("");

    clickButton("Rotate clockwise");

    // the image fits into the transposed slide rect regardless of which srcSet source is loaded
    const { width, height } = captured.rect!;
    const scale = Math.min(height / 3840, width / 5760);
    expect(parseFloat(image()!.style.width)).toBeCloseTo(3840 * scale, 5);
    expect(parseFloat(image()!.style.height)).toBeCloseTo(5760 * scale, 5);
  });

  it("computes max zoom for the rotated image", () => {
    const ref = React.createRef<ZoomRef>();
    const { captured, slide } = captureSlideRect();

    render(
      lightbox({
        slides: [{ src: "image1", width: 4000, height: 1000 }],
        plugins: [Rotate, Zoom],
        zoom: { ref },
        render: { slide },
      }),
    );

    // mirrors the contain-fit math in useZoomImageRect
    const expectedMaxZoom = (width: number, height: number) => {
      const rect = captured.rect!;
      return width / Math.round(Math.min(rect.width, (rect.height / height) * width, width));
    };

    const maxZoom = ref.current!.maxZoom;
    expect(maxZoom).toBeCloseTo(expectedMaxZoom(4000, 1000), 4);

    clickButton("Rotate clockwise");

    expect(ref.current!.maxZoom).toBeCloseTo(expectedMaxZoom(1000, 4000), 4);
    expect(ref.current!.maxZoom).not.toBeCloseTo(maxZoom, 4);
  });

  it("resets zoom on rotation", () => {
    const ref = React.createRef<ZoomRef>();

    render(
      lightbox({
        slides: [{ src: "image1", width: 4000, height: 3000 }],
        plugins: [Rotate, Zoom],
        zoom: { ref },
      }),
    );

    act(() => {
      ref.current!.zoomIn();
    });
    expect(ref.current!.zoom).toBeGreaterThan(1);

    clickButton("Rotate clockwise");
    expect(ref.current!.zoom).toBe(1);
  });

  describe("with responsive images", () => {
    // a portrait image in a landscape slide fits a wider box once rotated
    const responsiveSlide = (rotation?: number) => ({
      src: "image1",
      width: 1000,
      height: 4000,
      rotation,
      srcSet: [
        { src: "image1-200", width: 200, height: 800 },
        { src: "image1-400", width: 400, height: 1600 },
        { src: "image1-1000", width: 1000, height: 4000 },
      ],
    });

    function renderResponsiveLightbox(rotation?: number, ref?: React.Ref<ZoomRef>) {
      const { captured, slide } = captureSlideRect();

      render(
        lightbox({
          slides: [responsiveSlide(rotation)],
          plugins: [Rotate, Zoom],
          zoom: { ref },
          render: { slide },
        }),
      );

      return captured;
    }

    it("sizes unrotated images relative to the slide", () => {
      renderResponsiveLightbox();

      expectCurrentImageToBe("image1-200");
      expect(findCurrentSlide()?.querySelector("img")?.style.height).toBe("100%");
    });

    it("sizes rotated images to the transposed slide rect", () => {
      const captured = renderResponsiveLightbox(90);

      expectCurrentImageToBe("image1-400");

      const style = findCurrentSlide()?.querySelector("img")?.style;
      expect(style?.width).toBe("auto");
      expect(style?.height).toBe(`${captured.rect!.width}px`);
      expect(style?.rotate).toBe("90deg");
    });

    it("selects a larger source when zooming rotated images", () => {
      const ref = React.createRef<ZoomRef>();

      renderResponsiveLightbox(90, ref);

      act(() => {
        ref.current!.zoomIn();
      });

      // the larger source is preloaded next to the current one
      expect(findCurrentSlide()?.querySelector('img[src="image1-1000"]')).toBeInTheDocument();
    });
  });
});
