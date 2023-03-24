import { render, screen } from "@testing-library/react";

import { lightbox } from "../utils.js";
import { Counter } from "../../src/plugins/index.js";

describe("Counter", () => {
    it("renders the counter", () => {
        render(lightbox({ slides: [{ src: "image1" }, { src: "image2" }], plugins: [Counter] }));

        expect(screen.queryByText("1 / 2")).toBeInTheDocument();
    });

    it("doesn't crash with empty slides", () => {
        render(lightbox({ plugins: [Counter] }));

        expect(screen.queryByRole("presentation")).toBeInTheDocument();
    });
});
