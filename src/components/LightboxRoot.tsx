import * as React from "react";

import { clsx, cssClass } from "../utils.js";
import { useForkRef } from "../hooks/index.js";
import { DocumentContextProvider, RTLContextProvider, useA11yContext } from "../contexts/index.js";

export const LightboxRoot = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(function LightboxRoot(
  { className, children, onFocus, onBlur, ...rest },
  ref,
) {
  const nodeRef = React.useRef<HTMLDivElement>(null);
  const [isRTL, setIsRTL] = React.useState(false);
  const { trackFocusWithin } = useA11yContext();

  const detectRTL = React.useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setIsRTL(window.getComputedStyle(node).direction === "rtl");
    }
  }, []);

  return (
    <DocumentContextProvider nodeRef={nodeRef}>
      <RTLContextProvider isRTL={isRTL}>
        <div
          ref={useForkRef(useForkRef(ref, nodeRef), detectRTL)}
          className={clsx(cssClass("root"), className)}
          {...trackFocusWithin(onFocus, onBlur)}
          {...rest}
        >
          {children}
        </div>
      </RTLContextProvider>
    </DocumentContextProvider>
  );
});
