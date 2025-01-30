import * as React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { cleanup, clsx, cssClass, cssVar, label, makeUseContext } from "../../../src/utils.js";
import { Labels } from "../../../src/types.js";

describe("utils", () => {
  describe("cslx", () => {
    it("can be called with no arguments", () => {
      expect(clsx()).toBe("");
    });

    it("can be called with empty string argument", () => {
      expect(clsx("")).toBe("");
    });

    it("can be called with multiple empty string arguments", () => {
      expect(clsx("", "")).toBe("");
    });

    it("can be called with single class name argument", () => {
      expect(clsx("class1")).toBe("class1");
    });

    it("can be called with multiple class name arguments", () => {
      expect(clsx("class1", "class2")).toBe("class1 class2");
    });
  });

  describe("label", () => {
    const labels: Labels = {
      Previous: "previous",
      Next: "next",
    };

    it("can be called with no labels", () => {
      expect(label(undefined, "Previous")).toBe("Previous");
    });

    it("handles absent translation correctly", () => {
      // @ts-expect-error - expected error
      expect(label(labels, "Other")).toBe("Other");
    });

    it("translates labels correctly", () => {
      expect(label(labels, "Previous")).toBe("previous");
      expect(label(labels, "Next")).toBe("next");
    });
  });

  describe("cssClass", () => {
    it("prepends css class prefix", () => {
      expect(cssClass("class")).toBe("yarl__class");
    });
  });

  describe("cssVar", () => {
    it("prepends css var prefix", () => {
      expect(cssVar("var")).toBe("--yarl__var");
    });
  });

  describe("cleanup", () => {
    it("returns cleanup function", () => {
      expect(typeof cleanup() === "function").toBeTruthy();
    });

    it("calls cleanup methods", () => {
      const cleaners: (() => void)[] = Array.from({ length: 3 }).map(() => vi.fn());
      cleanup(...cleaners)();
      cleaners.forEach((cleaner) => {
        expect(cleaner).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("makeUseContext", () => {
    const context = {};
    const Context = React.createContext<typeof context | null>(null);

    function Test() {
      const useContext = makeUseContext("useContext", "Context", Context);
      return React.createElement("div", null, useContext() === context ? "pass" : "fail");
    }

    it("returns context", () => {
      render(React.createElement(Context.Provider, { value: context }, React.createElement(Test)));

      expect(screen.queryByText("pass")).toBeInTheDocument();
    });

    it("throws error when used outside of context provider", () => {
      class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, { error: boolean }> {
        constructor(props: React.PropsWithChildren<{}>) {
          super(props);
          this.state = { error: false };
        }

        // noinspection JSUnusedGlobalSymbols
        componentDidCatch() {
          this.setState({ error: true });
        }

        render() {
          const { props, state } = this;
          if (state.error) {
            return React.createElement("div", null, "error");
          }
          return props.children;
        }
      }

      const suppressConsoleError = (event: ErrorEvent) => {
        event.preventDefault();
      };
      window.addEventListener("error", suppressConsoleError);

      try {
        render(React.createElement(ErrorBoundary, null, React.createElement(Test)));
      } finally {
        window.removeEventListener("error", suppressConsoleError);
      }

      expect(screen.queryByText("error")).toBeInTheDocument();
      expect(screen.queryByText("pass")).not.toBeInTheDocument();
      expect(screen.queryByText("fail")).not.toBeInTheDocument();
    });
  });
});
