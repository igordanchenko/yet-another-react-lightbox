import * as React from "react";

import { clsx, ComponentProps, cssClass, cssVar, LightboxRoot } from "../../index.js";

/** Inline plugin container */
export function InlineContainer({ inline: { className, style, ...rest } = {}, styles, children }: ComponentProps) {
  return (
    <LightboxRoot
      className={clsx(cssClass("relative"), className)}
      style={{ [cssVar("controller_overscroll_behavior")]: "contain auto", ...styles.root, ...style }}
      {...rest}
    >
      {children}
    </LightboxRoot>
  );
}
