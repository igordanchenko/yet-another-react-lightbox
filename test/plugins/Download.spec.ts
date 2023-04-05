import { render, screen } from "@testing-library/react";

import { lightbox } from "../utils.js";
import { Download } from "../../src/plugins/index.js";

describe("Download", () => {
    it("renders the counter", () => {
        render(lightbox({ slides: [{ src: "image1" }, { src: "image2" }], plugins: [Download] }));

        expect(screen.queryByLabelText("Download")).toBeInTheDocument();
    });

    it("doesn't crash with empty slides", () => {
        render(lightbox({ plugins: [Download] }));

        expect(screen.queryByRole("presentation")).toBeInTheDocument();
    });
});
