import { act, render, screen } from "@testing-library/react";

import { lightbox } from "../utils.js";
import { Thumbnails } from "../../src/plugins/index.js";

describe("Thumbnails", () => {
    it("renders without crashing", () => {
        render(
            lightbox({
                slides: [{ src: "image1" }, { src: "image2" }, { src: "image3" }],
                plugins: [Thumbnails],
            })
        );

        act(() => {
            screen.getByLabelText("Next").click();
        });

        expect(screen.getByRole("presentation")).toBeInTheDocument();
    });
});
