import { act, render, screen } from "@testing-library/react";

import { lightbox } from "../utils.js";
import { Zoom } from "../../../src/plugins/index.js";

describe("Zoom", () => {
  it("renders without crashing", async () => {
    render(
      lightbox({
        slides: Array.from({ length: 3 }).map((_, i) => ({
          src: `image${i + 1}`,
          width: 3000,
          height: 2000,
        })),
        plugins: [Zoom],
      }),
    );

    act(() => {
      screen.getByLabelText("Zoom in").click();
    });

    act(() => {
      screen.getByLabelText("Zoom out").click();
    });

    expect(screen.getByRole("presentation")).toBeInTheDocument();
  });
});
