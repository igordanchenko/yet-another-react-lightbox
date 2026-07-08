import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { clickButton, lightbox, expectLightboxToBeOpen } from "../test-utils.js";
import { Download } from "../../../src/plugins/index.js";
import { LightboxExternalProps } from "../../../src/index.js";
import { parseContentDispositionFilename } from "../../../src/plugins/download/FileSaver.js";

function renderLightbox(props?: LightboxExternalProps) {
  return render(lightbox({ plugins: [Download], ...props }));
}

describe("Download", () => {
  it("renders the download button", () => {
    const download = vi.fn();

    renderLightbox({ slides: [{ src: "image1" }, { src: "image2" }], on: { download } });

    expect(screen.queryByLabelText("Download")).toBeInTheDocument();

    clickButton("Download");

    expect(download).toHaveBeenCalled();
  });

  it("doesn't crash with empty slides", () => {
    renderLightbox();

    expectLightboxToBeOpen();
  });

  it("supports custom download button", () => {
    const buttonDownload = vi.fn();

    renderLightbox({ render: { buttonDownload } });

    expect(buttonDownload).toHaveBeenCalled();
  });

  it("supports custom download function", () => {
    const download = vi.fn();

    renderLightbox({ slides: [{ src: "image", download: true }], download: { download } });

    clickButton("Download");

    expect(download).toHaveBeenCalled();
  });

  it("parses Content-Disposition filename", () => {
    expect(parseContentDispositionFilename(null)).toBeUndefined();
    expect(parseContentDispositionFilename("")).toBeUndefined();
    expect(parseContentDispositionFilename("inline")).toBeUndefined();
    expect(parseContentDispositionFilename('inline; filename=""')).toBeUndefined();

    expect(parseContentDispositionFilename('inline; filename="photo.jpg"')).toBe("photo.jpg");
    expect(parseContentDispositionFilename("attachment; filename=photo.jpg")).toBe("photo.jpg");
    expect(parseContentDispositionFilename("attachment; filename = photo.jpg ; size=1024")).toBe("photo.jpg");

    // RFC 5987 encoded filename takes precedence
    expect(parseContentDispositionFilename("attachment; filename*=UTF-8''na%C3%AFve.jpg")).toBe("naïve.jpg");
    expect(
      parseContentDispositionFilename("attachment; filename=\"fallback.jpg\"; filename*=UTF-8''f%C3%B8t%C3%B8.jpg"),
    ).toBe("føtø.jpg");

    // malformed percent-encoding falls back to the plain filename
    expect(parseContentDispositionFilename("attachment; filename*=UTF-8''%E0%A4%A; filename=\"fallback.jpg\"")).toBe(
      "fallback.jpg",
    );

    // empty encoded filename falls back to the plain filename
    expect(parseContentDispositionFilename("attachment; filename*=UTF-8'' ; filename=\"fallback.jpg\"")).toBe(
      "fallback.jpg",
    );
  });
});
