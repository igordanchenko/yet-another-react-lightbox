import * as React from "react";
import { act, screen } from "@testing-library/react";
import { vi } from "vitest";

import Lightbox from "../../src/index.js";

export function lightbox(props?: Parameters<typeof Lightbox>[0]) {
  return <Lightbox open {...props} />;
}

export function querySelector(selector: string) {
  return screen.getByRole("presentation").querySelector(selector);
}

export function findCurrentSlide() {
  return querySelector("div.yarl__slide_current");
}

export function findCurrentImage() {
  return findCurrentSlide()?.querySelector("img")?.src;
}

export function expectCurrentImageToBe(source: string) {
  expect(findCurrentImage()).toContain(source);
}

export function clickButton(name: string) {
  act(() => {
    screen.getByRole("button", { name }).click();
  });
}

export function queryButton(name: string) {
  return screen.queryByRole("button", { name });
}

export function expectToContainButton(name: string) {
  expect(queryButton(name)).toBeInTheDocument();
}

export function expectNotToContainButton(name: string) {
  expect(queryButton(name)).not.toBeInTheDocument();
}

// Workaround for @testing-library/user-event fake timers bug
// https://github.com/testing-library/react-testing-library/issues/1197
export async function withFakeTimers(callback: (props: { runAllTimers: () => void }) => void) {
  const jestCopy = globalThis.jest;

  globalThis.jest = {
    ...globalThis.jest,
    advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
  };

  try {
    vi.useFakeTimers();

    await callback({
      runAllTimers: () => {
        act(() => {
          vi.runAllTimers();
        });
      },
    });
  } finally {
    vi.useRealTimers();

    globalThis.jest = jestCopy;
  }
}
