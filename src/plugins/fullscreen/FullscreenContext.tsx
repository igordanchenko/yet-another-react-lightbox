import * as React from "react";

import {
  CLASS_FULLSIZE,
  cleanup,
  clsx,
  ComponentProps,
  cssClass,
  FullscreenRef,
  makeUseContext,
  PLUGIN_FULLSCREEN,
  useDocumentContext,
  useEventCallback,
  useLayoutEffect,
} from "../../index.js";
import { resolveFullscreenProps } from "./props.js";

export const FullscreenContext = React.createContext<FullscreenRef | null>(null);

export const useFullscreen = makeUseContext("useFullscreen", "FullscreenContext", FullscreenContext);

export function FullscreenContextProvider({ fullscreen: fullscreenProps, on, children }: ComponentProps) {
  const { auto, ref } = resolveFullscreenProps(fullscreenProps);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const [disabled, setDisabled] = React.useState<boolean>();
  const [fullscreen, setFullscreen] = React.useState(false);
  const wasFullscreen = React.useRef<boolean>(false);

  const { getOwnerDocument } = useDocumentContext();

  useLayoutEffect(() => {
    const ownerDocument = getOwnerDocument();

    setDisabled(
      !(
        ownerDocument.fullscreenEnabled ??
        ownerDocument.webkitFullscreenEnabled ??
        ownerDocument.mozFullScreenEnabled ??
        ownerDocument.msFullscreenEnabled ??
        false
      ),
    );
  }, [getOwnerDocument]);

  const getFullscreenElement = React.useCallback(() => {
    const ownerDocument = getOwnerDocument();

    const fullscreenElement =
      ownerDocument.fullscreenElement ||
      ownerDocument.webkitFullscreenElement ||
      ownerDocument.mozFullScreenElement ||
      ownerDocument.msFullscreenElement;

    return fullscreenElement?.shadowRoot?.fullscreenElement || fullscreenElement;
  }, [getOwnerDocument]);

  const enter = React.useCallback(() => {
    const container = containerRef.current!;

    try {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {});
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
    } catch (err) {
      //
    }
  }, []);

  const exit = React.useCallback(() => {
    if (!getFullscreenElement()) return;

    const ownerDocument = getOwnerDocument();
    try {
      if (ownerDocument.exitFullscreen) {
        ownerDocument.exitFullscreen().catch(() => {});
      } else if (ownerDocument.webkitExitFullscreen) {
        ownerDocument.webkitExitFullscreen();
      } else if (ownerDocument.mozCancelFullScreen) {
        ownerDocument.mozCancelFullScreen();
      } else if (ownerDocument.msExitFullscreen) {
        ownerDocument.msExitFullscreen();
      }
    } catch (err) {
      //
    }
  }, [getFullscreenElement, getOwnerDocument]);

  React.useEffect(() => {
    const ownerDocument = getOwnerDocument();

    const listener = () => {
      setFullscreen(getFullscreenElement() === containerRef.current);
    };

    return cleanup(
      ...["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"].map((event) => {
        ownerDocument.addEventListener(event, listener);
        return () => ownerDocument.removeEventListener(event, listener);
      }),
    );
  }, [getFullscreenElement, getOwnerDocument]);

  const onEnterFullscreen = useEventCallback(() => on.enterFullscreen?.());

  const onExitFullscreen = useEventCallback(() => on.exitFullscreen?.());

  React.useEffect(() => {
    if (fullscreen) {
      wasFullscreen.current = true;
    }

    if (wasFullscreen.current) {
      (fullscreen ? onEnterFullscreen : onExitFullscreen)();
    }
  }, [fullscreen, onEnterFullscreen, onExitFullscreen]);

  const handleAutoFullscreen = useEventCallback(() => {
    (auto ? enter : null)?.();
    return exit;
  });

  React.useEffect(handleAutoFullscreen, [handleAutoFullscreen]);

  const context = React.useMemo(() => ({ fullscreen, disabled, enter, exit }), [fullscreen, disabled, enter, exit]);

  React.useImperativeHandle(ref, () => context, [context]);

  return (
    <div ref={containerRef} className={clsx(cssClass(PLUGIN_FULLSCREEN), cssClass(CLASS_FULLSIZE))}>
      <FullscreenContext.Provider value={context}>{children}</FullscreenContext.Provider>
    </div>
  );
}
