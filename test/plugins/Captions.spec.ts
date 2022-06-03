import { act, render, screen } from "@testing-library/react";

import { lightbox } from "../utils.js";
import { Captions } from "../../src/plugins/index.js";

describe("Captions", () => {
    const slides = [
        { src: "image1", title: "title1" },
        { src: "image2", title: "title2", description: "description2" },
    ];

    it("renders title an description", () => {
        render(lightbox({ plugins: [Captions], slides, carousel: { preload: 0 } }));

        expect(screen.queryByText("title1")).toBeInTheDocument();
        expect(screen.queryByText("title2")).not.toBeInTheDocument();

        act(() => {
            screen.getByRole("button", { name: "Next" }).click();
        });

        expect(screen.queryByText("title1")).not.toBeInTheDocument();
        expect(screen.queryByText("title2")).toBeInTheDocument();
        expect(screen.queryByText("description2")).toBeInTheDocument();
    });
});
