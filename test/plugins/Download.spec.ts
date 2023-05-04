import { act, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { lightbox } from "../utils.js";
import { Download } from "../../src/plugins/index.js";
import { LightboxExternalProps } from "../../src/index.js";

function renderLightbox(props?: LightboxExternalProps) {
    return render(lightbox({ plugins: [Download], ...props }));
}

describe("Download", () => {
    it("renders the download button", () => {
        const download = vi.fn();

        renderLightbox({ slides: [{ src: "image1" }, { src: "image2" }], on: { download } });

        expect(screen.queryByLabelText("Download")).toBeInTheDocument();

        act(() => {
            screen.getByRole("button", { name: "Download" }).click();
        });

        expect(download).toHaveBeenCalled();
    });

    it("doesn't crash with empty slides", () => {
        renderLightbox();

        expect(screen.queryByRole("presentation")).toBeInTheDocument();
    });

    it("supports custom download button", () => {
        const buttonDownload = vi.fn();

        renderLightbox({ render: { buttonDownload } });

        expect(buttonDownload).toHaveBeenCalled();
    });
});
