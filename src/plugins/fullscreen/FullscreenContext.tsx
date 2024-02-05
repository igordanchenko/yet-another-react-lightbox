import * as React from "react";

import {
  CLASS_FULLSIZE,
  clsx,
  ComponentProps,
  cssClass,
  FullscreenRef,
  makeUseContext,
  PLUGIN_FULLSCREEN,
  useEventCallback,
  useLayoutEffect,
} from "../../index.js";
import { resolveFullscreenProps } from "./props.js";

export const FullscreenContext = React.createContext<FullscreenRef | null>(null);

export const useFullscreen = makeUseContext("useFullscreen", "FullscreenContext", FullscreenContext);

export function FullscreenContextProvider({ fullscreen: fullscreenProps, on, children }: ComponentProps) {
  const { auto, ref } = resolveFullscreenProps(fullscreenProps);

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [disabled, setDisabled] = React.useState<boolean>();
  const [fullscreen, setFullscreen] = React.useState(false);
  const wasFullscreen = React.useRef<boolean>(false);

  useLayoutEffect(() => {
    setDisabled(
      !(
        document.fullscreenEnabled ??
        document.webkitFullscreenEnabled ??
        document.mozFullScreenEnabled ??
        document.msFullscreenEnabled ??
        false
      ),
    );
  }, []);

  const getFullscreenElement = React.useCallback(
    () =>
      document.fullscreenElement ??
      document.webkitFullscreenElement ??
      document.mozFullScreenElement ??
      document.msFullscreenElement,
    [],
  );

  const enter = React.useCallback(() => {
    const container = containerRef.current;
    if (container) {
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
    }
  }, []);

  const exit = React.useCallback(() => {
    if (getFullscreenElement()) {
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } catch (err) {
        //
      }
    }
  }, [getFullscreenElement]);

  React.useEffect(() => {
    const events = ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"];

    const fullscreenChangeListener = () => {
      setFullscreen(getFullscreenElement() === containerRef.current);
    };

    events.forEach((event) => {
      document.addEventListener(event, fullscreenChangeListener);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, fullscreenChangeListener);
      });
    };
  }, [getFullscreenElement]);

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

  const handleAutoFullscreen = useEventCallback(() => (auto ? enter : null)?.());

  React.useEffect(() => {
    handleAutoFullscreen();
    return () => exit();
  }, [handleAutoFullscreen, exit]);

  const context = React.useMemo(
    () => ({
      fullscreen,
      disabled,
      enter,
      exit,
    }),
    [fullscreen, disabled, enter, exit],
  );

  React.useImperativeHandle(ref, () => context, [context]);

  return (
    <div ref={containerRef} className={clsx(cssClass(PLUGIN_FULLSCREEN), cssClass(CLASS_FULLSIZE))}>
      <FullscreenContext.Provider value={context}>{children}</FullscreenContext.Provider>
    </div>
  );
}
