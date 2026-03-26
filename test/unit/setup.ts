import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
  configurable: true,
  writable: true,
  value: vi.fn(),
});

Object.defineProperties(window.HTMLElement.prototype, {
  clientWidth: {
    get() {
      if (this instanceof Element) {
        if (this.classList.contains("yarl__container")) {
          return window.innerWidth;
        }
        if (this.classList.contains("yarl__toolbar")) {
          return 240;
        }
      }
      return 0;
    },
  },
});
