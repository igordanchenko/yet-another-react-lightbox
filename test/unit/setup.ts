import "@testing-library/jest-dom/vitest";

// Suppress the "outdated JSX transform" warning from React 19+.
// The codebase intentionally uses React.createElement for backward compatibility
// with older React versions. This warning will go away after migrating to react-jsx.
// eslint-disable-next-line no-console
const originalConsoleWarn = console.warn;
// eslint-disable-next-line no-console
console.warn = (...args: Parameters<typeof console.warn>) => {
  if (typeof args[0] === "string" && args[0].includes("outdated JSX transform")) {
    return;
  }
  originalConsoleWarn(...args);
};

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
