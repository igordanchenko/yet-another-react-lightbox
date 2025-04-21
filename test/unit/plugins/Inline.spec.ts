import * as React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { lightbox, expectLightboxToBeOpen } from "../test-utils.js";
import { Inline } from "../../../src/plugins/index.js";
import { ControllerRef, LightboxExternalProps } from "../../../src/index.js";

function renderLightbox(props?: LightboxExternalProps) {
  return render(lightbox({ plugins: [Inline], ...props }));
}

function testMainScenario() {
  expectLightboxToBeOpen();
  expect(screen.queryByLabelText("Close")).not.toBeInTheDocument();
  expect(screen.queryByLabelText("Previous")).toBeInTheDocument();
  expect(screen.queryByLabelText("Next")).toBeInTheDocument();
}

describe("Inline", () => {
  it("renders inline lightbox", () => {
    renderLightbox();

    testMainScenario();
  });

  it("ignores open prop", () => {
    renderLightbox({ open: false });

    testMainScenario();
  });

  it("doesn't close", () => {
    const close = vi.fn();
    const ref = React.createRef<ControllerRef>();

    renderLightbox({ controller: { ref }, close });

    ref.current!.close();

    expect(close).not.toHaveBeenCalled();

    testMainScenario();
  });
});
