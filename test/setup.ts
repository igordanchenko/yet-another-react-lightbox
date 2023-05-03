import "@testing-library/jest-dom";

Object.defineProperties(window.HTMLElement.prototype, {
    clientWidth: {
        get() {
            return ((this.className || "") as string).includes("yarl__container") ? window.innerWidth : 0;
        },
    },
});
