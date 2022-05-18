import { render } from "@testing-library/react";

import { findCurrentSlide, lightbox } from "../utils.js";
import { Video } from "../../src/plugins/index.js";

const findCurrentVideo = () => findCurrentSlide()?.querySelector("source")?.src;

describe("Video", () => {
    it("renders video slides", () => {
        render(
            lightbox({
                slides: [
                    {
                        type: "video",
                        sources: [
                            {
                                src: "video1",
                                type: "video/mp4",
                            },
                        ],
                    },
                    {
                        type: "video",
                        width: 800,
                        height: 600,
                        sources: [
                            {
                                src: "video2",
                                type: "video/mp4",
                            },
                        ],
                    },
                    {
                        src: "image1",
                    },
                ],
                plugins: [Video],
            })
        );

        expect(findCurrentVideo()).toContain("video1");
    });
});
