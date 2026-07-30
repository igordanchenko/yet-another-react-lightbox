import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { TimeoutsProvider } from "../../../src/contexts/Timeouts.js";
import { useThrottle } from "../../../src/hooks/useThrottle.js";

describe("useThrottle", () => {
  it("passes the arguments through to the callback", async () => {
    const callback = vi.fn();

    const { result } = renderHook(() => useThrottle(callback, 0), { wrapper: TimeoutsProvider });

    result.current("first", "second");

    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith("first", "second");
    });
  });

  it("calls the callback with no arguments when invoked with none", async () => {
    const callback = vi.fn();

    const { result } = renderHook(() => useThrottle(callback, 0), { wrapper: TimeoutsProvider });

    result.current();

    await waitFor(() => {
      expect(callback).toHaveBeenCalledWith();
    });
  });
});
