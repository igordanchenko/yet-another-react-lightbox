import { act, render, screen } from "@testing-library/react";

import { findCurrentImage, lightbox } from "./utils.js";

describe("Lightbox", () => {
    it("respects open prop", () => {
        const { rerender } = render(lightbox({ open: false }));
        expect(screen.queryByRole("presentation")).not.toBeInTheDocument();

        rerender(lightbox());
        expect(screen.getByRole("presentation")).toBeInTheDocument();
    });

    it("presents basic controls", () => {
        render(lightbox());

        expect(screen.queryByRole("presentation")).toBeInTheDocument();
        expect(screen.queryByLabelText("Close")).toBeInTheDocument();
        expect(screen.queryByLabelText("Previous Image")).toBeInTheDocument();
        expect(screen.queryByLabelText("Next Image")).toBeInTheDocument();
    });

    it("respects index prop", () => {
        for (let i = 0; i < 3; i += 1) {
            const { unmount } = render(
                lightbox({
                    slides: [{ src: "image1" }, { src: "image2" }, { src: "image3" }],
                    index: i,
                    carousel: { preload: 1 },
                })
            );
            expect(findCurrentImage()).toContain(`image${i + 1}`);
            unmount();
        }
    });

    it("provides navigation buttons", () => {
        render(lightbox({ slides: [{ src: "image1" }, { src: "image2" }, { src: "image3" }] }));

        expect(findCurrentImage()).toContain("image1");

        act(() => {
            screen.getByLabelText("Next Image").click();
        });

        expect(findCurrentImage()).toContain("image2");

        act(() => {
            screen.getByLabelText("Previous Image").click();
        });
        act(() => {
            screen.getByLabelText("Previous Image").click();
        });

        expect(findCurrentImage()).toContain("image3");
    });
});
