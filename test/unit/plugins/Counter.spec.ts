import { render, screen } from "@testing-library/react";

import { lightbox, expectLightboxToBeOpen } from "../test-utils.js";
import { Counter } from "../../../src/plugins/index.js";
import { LightboxExternalProps } from "../../../src/index.js";

function renderLightbox(props?: LightboxExternalProps) {
  return render(lightbox({ plugins: [Counter], ...props }));
}

describe("Counter", () => {
  it("renders the counter", () => {
    renderLightbox({ slides: [{ src: "image1" }, { src: "image2" }] });

    expect(screen.queryByText("1 / 2")).toBeInTheDocument();
  });

  it("doesn't crash with empty slides", () => {
    renderLightbox();

    expectLightboxToBeOpen();
  });
});
