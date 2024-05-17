import * as React from "react";

import { clsx, cssClass } from "../utils.js";
import { useForkRef } from "../hooks/index.js";
import { DocumentContextProvider } from "../contexts/index.js";

const LightboxRoot = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(function LightboxRoot(
  { className, children, ...rest },
  ref,
) {
  const nodeRef = React.useRef<HTMLDivElement | null>(null);
  return (
    <DocumentContextProvider nodeRef={nodeRef}>
      <div ref={useForkRef(ref, nodeRef)} className={clsx(cssClass("root"), className)} {...rest}>
        {children}
      </div>
    </DocumentContextProvider>
  );
});

export { LightboxRoot };
