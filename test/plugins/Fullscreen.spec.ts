import * as React from "react";
import { act, render, screen } from "@testing-library/react";

import { lightbox } from "../utils.js";
import { Fullscreen } from "../../src/plugins/index.js";

describe("Fullscreen", () => {
    const dispatchFullscreenChangeEvent = () => {
        act(() => {
            document.dispatchEvent(new Event("fullscreenchange"));
        });
    };

    const init = (
        define = true,
        fullscreenEnabled = "fullscreenEnabled",
        fullscreenElement = "fullscreenElement",
        requestFullscreen = "requestFullscreen",
        exitFullscreen = "exitFullscreen"
    ) => {
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
                ? // eslint-disable-next-line func-names
                  function (this: HTMLElement) {
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
    };

    const getEnterFullscreenButton = () => screen.getByRole("button", { name: "Enter Fullscreen" });

    const queryEnterFullscreenButton = () => screen.queryByRole("button", { name: "Enter Fullscreen" });

    const getExitFullscreenButton = () => screen.getByRole("button", { name: "Exit Fullscreen" });

    const queryExitFullscreenButton = () => screen.queryByRole("button", { name: "Exit Fullscreen" });

    function expectToBeFullscreen() {
        expect(queryEnterFullscreenButton()).not.toBeInTheDocument();
        expect(queryExitFullscreenButton()).toBeInTheDocument();
    }

    function expectNotToBeFullscreen() {
        expect(queryEnterFullscreenButton()).toBeInTheDocument();
        expect(queryExitFullscreenButton()).not.toBeInTheDocument();
    }

    beforeEach(() => {
        init();
    });

    afterEach(() => {
        init(false);
    });

    const testMainScenario = (requestFullscreen = "requestFullscreen", exitFullscreen = "exitFullscreen") => {
        // @ts-ignore
        const requestFullscreenSpy = jest.spyOn(Element.prototype, requestFullscreen);

        // @ts-ignore
        const exitFullscreenSpy = jest.spyOn(document, exitFullscreen);

        const { unmount } = render(lightbox({ plugins: [Fullscreen] }));

        expectNotToBeFullscreen();

        getEnterFullscreenButton().click();
        expect(requestFullscreenSpy).toHaveBeenCalledTimes(1);
        expectToBeFullscreen();

        getExitFullscreenButton().click();
        expect(exitFullscreenSpy).toHaveBeenCalledTimes(1);
        expectNotToBeFullscreen();

        unmount();
    };

    it("enters and exits fullscreen mode", () => {
        testMainScenario();
    });

    it("auto opens", () => {
        render(
            lightbox({
                plugins: [Fullscreen],
                fullscreen: true,
            })
        );

        expect(getExitFullscreenButton()).toBeInTheDocument();
    });

    it("doesn't render when fullscreen is not supported", () => {
        init(false);

        render(lightbox({ plugins: [Fullscreen] }));

        expect(queryEnterFullscreenButton()).not.toBeInTheDocument();
        expect(queryExitFullscreenButton()).not.toBeInTheDocument();
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
                methods.exitFullscreen
            );

            testMainScenario(methods.requestFullscreen, methods.exitFullscreen);

            init(
                false,
                methods.fullscreenEnabled,
                methods.fullscreenElement,
                methods.requestFullscreen,
                methods.exitFullscreen
            );
        });
    });

    it("it handles requestFullscreen rejection", () => {
        Object.defineProperty(Element.prototype, "requestFullscreen", {
            value: () => Promise.reject(),
            writable: true,
        });

        render(lightbox({ plugins: [Fullscreen] }));

        getEnterFullscreenButton().click();
        expectNotToBeFullscreen();
    });

    it("it handles exitFullscreen rejection", () => {
        Object.defineProperty(document, "exitFullscreen", {
            value: () => Promise.reject(),
            writable: true,
        });

        render(lightbox({ plugins: [Fullscreen] }));

        getEnterFullscreenButton().click();
        expectToBeFullscreen();

        getExitFullscreenButton().click();
        expectToBeFullscreen();
    });

    it("supports custom button rendering", () => {
        render(
            lightbox({
                plugins: [Fullscreen],
                render: { buttonFullscreen: () => React.createElement("button", { type: "button" }, "Custom button") },
            })
        );

        expect(screen.queryByRole("button", { name: "Custom button" })).toBeInTheDocument();
    });
});
