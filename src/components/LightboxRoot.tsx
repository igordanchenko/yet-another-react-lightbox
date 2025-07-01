import * as React from "react";

import { clsx, cssClass } from "../utils.js";
import { useForkRef } from "../hooks/index.js";
import { DocumentContextProvider, useA11yContext } from "../contexts/index.js";

const LightboxRoot = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(function LightboxRoot(
  { className, children, onFocus, onBlur, ...rest },
  ref,
) {
  const nodeRef = React.useRef<HTMLDivElement>(null);
  const { trackFocusWithin } = useA11yContext();

  return (
    <DocumentContextProvider nodeRef={nodeRef}>
      <div
        ref={useForkRef(ref, nodeRef)}
        className={clsx(cssClass("root"), className)}
        {...trackFocusWithin(onFocus, onBlur)}
        {...rest}
      >
        {children}
      </div>
    </DocumentContextProvider>
  );
});

export { LightboxRoot };
