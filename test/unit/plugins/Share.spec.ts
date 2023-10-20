import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { clickButton, lightbox } from "../utils.js";
import { Share } from "../../../src/plugins/index.js";
import { LightboxExternalProps } from "../../../src/index.js";

function renderLightbox(props?: LightboxExternalProps) {
  return render(lightbox({ plugins: [Share], ...props }));
}

describe("Share", () => {
  beforeAll(() => {
    const shareCopy = navigator.share;
    const canShareCopy = navigator.canShare;

    navigator.share = () => Promise.resolve();
    navigator.canShare = () => true;

    return () => {
      navigator.share = shareCopy;
      navigator.canShare = canShareCopy;
    };
  });

  it("renders the share button", () => {
    const share = vi.fn();

    renderLightbox({ slides: [{ src: "image1" }, { src: "image2" }], on: { share } });

    expect(screen.queryByLabelText("Share")).toBeInTheDocument();

    clickButton("Share");

    expect(share).toHaveBeenCalled();
  });

  it("doesn't crash with empty slides", () => {
    renderLightbox();

    expect(screen.queryByRole("presentation")).toBeInTheDocument();
  });

  it("supports custom share button", () => {
    const buttonShare = vi.fn();

    renderLightbox({ render: { buttonShare } });

    expect(buttonShare).toHaveBeenCalled();
  });

  it("supports custom share function", () => {
    const share = vi.fn();

    renderLightbox({ slides: [{ src: "image", share: true }], share: { share } });

    clickButton("Share");

    expect(share).toHaveBeenCalled();
  });
});
