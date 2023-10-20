import { act, fireEvent, render, screen } from "@testing-library/react";

import { expectCurrentImageToBe, findCurrentImage, findCurrentSlide, lightbox, withFakeTimers } from "./utils.js";

const fireWheelEvent = (element: Element, options: { deltaX?: number; deltaY?: number; ctrlKey?: boolean }) => {
  // noinspection TypeScriptValidateJSTypes
  fireEvent.wheel(element, options);
};

describe("Lightbox", () => {
  it("respects open prop", () => {
    const { rerender } = render(lightbox({ open: false }));
    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();

    rerender(lightbox());
    expect(screen.getByRole("presentation")).toBeInTheDocument();
  });

  it("presents basic controls", () => {
    render(lightbox());

    expect(screen.queryByRole("presentation")).toBeInTheDocument();
    expect(screen.queryByLabelText("Close")).toBeInTheDocument();
    expect(screen.queryByLabelText("Previous")).toBeInTheDocument();
    expect(screen.queryByLabelText("Next")).toBeInTheDocument();
  });

  it("respects index prop", () => {
    for (let i = 0; i < 3; i += 1) {
      const { unmount } = render(
        lightbox({
          slides: [{ src: "image1" }, { src: "image2" }, { src: "image3" }],
          index: i,
          carousel: { preload: 1 },
        }),
      );
      expect(findCurrentImage()).toContain(`image${i + 1}`);
      unmount();
    }
  });

  it("provides navigation buttons", () => {
    render(lightbox({ slides: [{ src: "image1" }, { src: "image2" }, { src: "image3" }] }));

    expectCurrentImageToBe("image1");

    act(() => {
      screen.getByLabelText("Next").click();
    });

    expectCurrentImageToBe("image2");

    act(() => {
      screen.getByLabelText("Previous").click();
    });
    act(() => {
      screen.getByLabelText("Previous").click();
    });

    expectCurrentImageToBe("image3");
  });

  it("supports wheel navigation", () =>
    withFakeTimers(({ runAllTimers }) => {
      render(
        lightbox({
          slides: [{ src: "image1" }, { src: "image2" }, { src: "image3" }],
          carousel: { finite: true },
        }),
      );

      expectCurrentImageToBe("image1");

      const slide = findCurrentSlide()!;

      // not a swipe
      runAllTimers();
      fireWheelEvent(slide, { deltaX: 1 });
      fireWheelEvent(slide, { ctrlKey: true });
      fireWheelEvent(slide, { deltaX: 100, deltaY: 200 });
      fireWheelEvent(slide, { deltaX: 500, deltaY: 1000 });
      runAllTimers();
      expectCurrentImageToBe("image1");

      // invalid swipe
      runAllTimers();
      fireWheelEvent(slide, { deltaX: -100 });
      fireWheelEvent(slide, { deltaX: -1000 });
      fireWheelEvent(slide, { deltaX: -1000 });
      runAllTimers();
      expectCurrentImageToBe("image1");

      // insufficient swipe
      runAllTimers();
      fireWheelEvent(slide, { deltaX: 50 });
      fireWheelEvent(slide, { deltaX: 100 });
      runAllTimers();
      expectCurrentImageToBe("image1");

      // valid swipe
      fireWheelEvent(slide, { deltaX: 10 });
      fireWheelEvent(slide, { deltaX: 20 });
      fireWheelEvent(slide, { deltaX: 30 });
      fireWheelEvent(slide, { deltaX: 100 });
      fireWheelEvent(slide, { deltaX: 300 });
      fireWheelEvent(slide, { deltaX: 100 });
      runAllTimers();
      fireWheelEvent(slide, { deltaX: 50 });
      expectCurrentImageToBe("image2");
    }));
});
