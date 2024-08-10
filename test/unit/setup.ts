import "@testing-library/jest-dom/vitest";

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
