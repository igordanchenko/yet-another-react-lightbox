import * as React from "react";
import { render } from "@testing-library/react";

import { findCurrentSlide, lightbox } from "./test-utils.js";
import { ImageFit, ImageSlide, isImageSlide, SlideImage } from "../../src/index.js";

const slide: SlideImage = {
  src: "image",
  width: 3000,
  height: 2000,
  srcSet: [
    { src: "image-small", width: 750, height: 500 },
    { src: "image-large", width: 3000, height: 2000 },
  ],
};

function renderImageSlide(rect: { width: number; height: number }, imageFit: ImageFit, rotation: number) {
  render(
    lightbox({
      slides: [slide],
      render: {
        slide: ({ slide: current }) =>
          isImageSlide(current)
            ? React.createElement(ImageSlide, { slide: current, rect, imageFit, rotation })
            : undefined,
      },
    }),
  );

  return findCurrentSlide()?.querySelector("img")?.getAttribute("sizes");
}

describe("ImageSlide", () => {
  it.each([
    // portrait rect: contain is limited by width, cover overflows horizontally
    [{ width: 300, height: 600 }, "contain", 0, "300px"],
    [{ width: 300, height: 600 }, "cover", 0, "900px"],
    [{ width: 300, height: 600 }, "contain", 90, "450px"],
    [{ width: 300, height: 600 }, "cover", 90, "600px"],
    // landscape rect: quarter-turn rotation transposes the rect, so cover overflows horizontally
    [{ width: 600, height: 300 }, "contain", 0, "450px"],
    [{ width: 600, height: 300 }, "cover", 0, "600px"],
    [{ width: 600, height: 300 }, "contain", 90, "300px"],
    [{ width: 600, height: 300 }, "cover", 90, "900px"],
  ] as const)("computes sizes for %o rect, %s fit and %s rotation", (rect, imageFit, rotation, expected) => {
    expect(renderImageSlide(rect, imageFit, rotation)).toBe(expected);
  });

  it("falls back to rect width without image dimensions", () => {
    render(
      lightbox({
        slides: [{ ...slide, width: undefined, height: undefined }],
        render: {
          slide: ({ slide: current }) =>
            isImageSlide(current)
              ? React.createElement(ImageSlide, {
                  slide: current,
                  rect: { width: 300, height: 600 },
                  imageFit: "cover",
                })
              : undefined,
        },
      }),
    );

    expect(findCurrentSlide()?.querySelector("img")?.getAttribute("sizes")).toBe("300px");
  });
});
