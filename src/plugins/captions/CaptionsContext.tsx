import * as React from "react";

import { CaptionsRef, ComponentProps, makeUseContext } from "../../index.js";
import { resolveCaptionsProps } from "./props.js";

export const CaptionsContext = React.createContext<CaptionsRef | null>(null);

export const useCaptions = makeUseContext("useCaptions", "CaptionsContext", CaptionsContext);

export function CaptionsContextProvider({ captions, children }: ComponentProps) {
  const { ref, hidden } = resolveCaptionsProps(captions);

  const [visible, setVisible] = React.useState(!hidden);

  const context = React.useMemo(
    () => ({
      visible,
      show: () => setVisible(true),
      hide: () => setVisible(false),
    }),
    [visible],
  );

  React.useImperativeHandle(ref, () => context, [context]);

  return <CaptionsContext.Provider value={context}>{children}</CaptionsContext.Provider>;
}
