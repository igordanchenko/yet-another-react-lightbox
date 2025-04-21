import { render } from "@testing-library/react";
import { vi } from "vitest";

import { findCurrentSlide, lightbox } from "../test-utils.js";
import { Video } from "../../../src/plugins/index.js";
import { LightboxExternalProps } from "../../../src/index.js";

function renderLightbox(props?: LightboxExternalProps) {
  return render(
    lightbox({
      slides: [
        {
          type: "video",
          sources: [
            {
              src: "video1",
              type: "video/mp4",
            },
          ],
        },
        {
          type: "video",
          width: 800,
          height: 600,
          sources: [
            {
              src: "video2",
              type: "video/mp4",
            },
          ],
        },
        {
          src: "image1",
        },
      ],
      plugins: [Video],
      ...props,
    }),
  );
}

function findCurrentVideo() {
  return findCurrentSlide()?.querySelector("source")?.src;
}

describe("Video", () => {
  it("renders video slides", () => {
    renderLightbox();

    expect(findCurrentVideo()).toContain("video1");
  });

  it("doesn't override custom renderSlide", () => {
    const slide = vi.fn();
    renderLightbox({ render: { slide } });
    expect(slide).toHaveBeenCalled();
  });
});
