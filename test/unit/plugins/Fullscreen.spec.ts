import * as React from "react";
import { act, render } from "@testing-library/react";
import { vi } from "vitest";

import { clickButton, expectNotToContainButton, expectToContainButton, lightbox } from "../test-utils.js";
import { Fullscreen, Thumbnails } from "../../../src/plugins/index.js";
import { LightboxExternalProps } from "../../../src/index.js";

function renderLightbox(props?: LightboxExternalProps) {
  return render(lightbox({ plugins: [Fullscreen], ...props }));
}

function dispatchFullscreenChangeEvent() {
  act(() => {
    document.dispatchEvent(new Event("fullscreenchange"));
  });
}

function init(
  define = true,
  fullscreenEnabled = "fullscreenEnabled",
  fullscreenElement = "fullscreenElement",
  requestFullscreen = "requestFullscreen",
  exitFullscreen = "exitFullscreen",
) {
  let element: HTMLElement | null = null;

  Object.defineProperty(document, fullscreenEnabled, {
    get: define ? () => true : undefined,
    configurable: true,
  });

  Object.defineProperty(document, fullscreenElement, {
    get: define ? () => element : undefined,
    configurable: true,
  });

  Object.defineProperty(Element.prototype, requestFullscreen, {
    value: define
      ? function (this: HTMLElement) {
          // eslint-disable-next-line @typescript-eslint/no-this-alias
          element = this;
          dispatchFullscreenChangeEvent();
          return Promise.resolve();
        }
      : undefined,
    writable: true,
  });

  Object.defineProperty(document, exitFullscreen, {
    value: define
      ? () => {
          element = null;
          dispatchFullscreenChangeEvent();
          return Promise.resolve();
        }
      : undefined,
    writable: true,
  });
}

const ENTER_FULLSCREEN = "Enter Fullscreen";
const EXIT_FULLSCREEN = "Exit Fullscreen";

function clickEnterFullscreenButton() {
  clickButton(ENTER_FULLSCREEN);
}

function clickExitFullscreenButton() {
  clickButton(EXIT_FULLSCREEN);
}

function expectToBeFullscreen() {
  expectNotToContainButton(ENTER_FULLSCREEN);
  expectToContainButton(EXIT_FULLSCREEN);
}

function expectNotToBeFullscreen() {
  expectToContainButton(ENTER_FULLSCREEN);
  expectNotToContainButton(EXIT_FULLSCREEN);
}

describe("Fullscreen", () => {
  beforeEach(() => {
    init();
  });

  afterEach(() => {
    init(false);
  });

  const testMainScenario = (requestFullscreen = "requestFullscreen", exitFullscreen = "exitFullscreen") => {
    const requestFullscreenSpy = vi.spyOn(Element.prototype, requestFullscreen as "requestFullscreen");

    const exitFullscreenSpy = vi.spyOn(document, exitFullscreen as "exitFullscreen");

    const { unmount } = renderLightbox();

    expectNotToBeFullscreen();

    clickEnterFullscreenButton();
    expect(requestFullscreenSpy).toHaveBeenCalledTimes(1);
    expectToBeFullscreen();

    clickExitFullscreenButton();
    expect(exitFullscreenSpy).toHaveBeenCalledTimes(1);
    expectNotToBeFullscreen();

    unmount();
  };

  it("enters and exits fullscreen mode", () => {
    testMainScenario();
  });

  it("works with Thumbnails", () => {
    // Thumbnails plugin must be listed first
    render(lightbox({ plugins: [Thumbnails, Fullscreen] }));

    expectNotToBeFullscreen();
  });

  it("doesn't render when fullscreen is not supported", () => {
    init(false);

    renderLightbox();

    expectNotToContainButton(ENTER_FULLSCREEN);
    expectNotToContainButton(EXIT_FULLSCREEN);
  });

  it("supports vendor-specific methods", () => {
    init(false);

    [
      {
        fullscreenEnabled: "webkitFullscreenEnabled",
        fullscreenElement: "webkitFullscreenElement",
        requestFullscreen: "webkitRequestFullscreen",
        exitFullscreen: "webkitExitFullscreen",
      },
      {
        fullscreenEnabled: "mozFullScreenEnabled",
        fullscreenElement: "mozFullScreenElement",
        requestFullscreen: "mozRequestFullScreen",
        exitFullscreen: "mozCancelFullScreen",
      },
      {
        fullscreenEnabled: "msFullscreenEnabled",
        fullscreenElement: "msFullscreenElement",
        requestFullscreen: "msRequestFullscreen",
        exitFullscreen: "msExitFullscreen",
      },
    ].forEach((methods) => {
      init(
        true,
        methods.fullscreenEnabled,
        methods.fullscreenElement,
        methods.requestFullscreen,
        methods.exitFullscreen,
      );

      testMainScenario(methods.requestFullscreen, methods.exitFullscreen);

      init(
        false,
        methods.fullscreenEnabled,
        methods.fullscreenElement,
        methods.requestFullscreen,
        methods.exitFullscreen,
      );
    });
  });

  it("it handles requestFullscreen rejection", () => {
    [
      () => Promise.reject(),
      () => {
        throw new Error("Not implemented");
      },
    ].forEach((value) => {
      Object.defineProperty(Element.prototype, "requestFullscreen", { value, writable: true });

      renderLightbox();

      clickEnterFullscreenButton();
      expectNotToBeFullscreen();
    });
  });

  it("it handles exitFullscreen rejection", () => {
    [
      () => Promise.reject(),
      () => {
        throw new Error("Not implemented");
      },
    ].forEach((value) => {
      Object.defineProperty(document, "exitFullscreen", { value, writable: true });

      renderLightbox();

      clickEnterFullscreenButton();
      expectToBeFullscreen();

      clickExitFullscreenButton();
      expectToBeFullscreen();
    });
  });

  it("supports custom button rendering", () => {
    renderLightbox({
      render: { buttonFullscreen: () => React.createElement("button", { type: "button" }, "Custom button") },
    });

    expectToContainButton("Custom button");
  });
});
