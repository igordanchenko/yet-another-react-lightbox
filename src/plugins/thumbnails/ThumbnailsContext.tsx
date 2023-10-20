import * as React from "react";

import { clsx, ComponentProps, cssClass, LightboxPropsProvider, makeUseContext, ThumbnailsRef } from "../../index.js";
import { cssPrefix } from "./utils.js";
import { ThumbnailsTrack } from "./ThumbnailsTrack.js";
import { resolveThumbnailsProps } from "./props.js";

export const ThumbnailsContext = React.createContext<ThumbnailsRef | null>(null);

export const useThumbnails = makeUseContext("useThumbnails", "ThumbnailsContext", ThumbnailsContext);

/** Thumbnails plugin component */
export function ThumbnailsContextProvider({ children, ...props }: ComponentProps) {
  const [visible, setVisible] = React.useState(true);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const { ref, position } = resolveThumbnailsProps(props.thumbnails);

  const context = React.useMemo(
    () => ({
      visible,
      show: () => setVisible(true),
      hide: () => setVisible(false),
    }),
    [visible],
  );

  React.useImperativeHandle(ref, () => context, [context]);

  return (
    <LightboxPropsProvider {...props}>
      <ThumbnailsContext.Provider value={context}>
        <div ref={containerRef} className={clsx(cssClass(cssPrefix()), cssClass(cssPrefix(`${position}`)))}>
          {["start", "top"].includes(position) && <ThumbnailsTrack containerRef={containerRef} visible={visible} />}
          <div className={cssClass(cssPrefix("wrapper"))}>{children}</div>
          {["end", "bottom"].includes(position) && <ThumbnailsTrack containerRef={containerRef} visible={visible} />}
        </div>
      </ThumbnailsContext.Provider>
    </LightboxPropsProvider>
  );
}
