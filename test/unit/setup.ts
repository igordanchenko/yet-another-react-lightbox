import "@testing-library/jest-dom/vitest";

Object.defineProperties(window.HTMLElement.prototype, {
    clientWidth: {
        get() {
            const className = (this.className || "") as string;
            if (className.includes("yarl__container")) {
                return window.innerWidth;
            }
            if (className.includes("yarl__toolbar")) {
                return 240;
            }
            return 0;
        },
    },
});
