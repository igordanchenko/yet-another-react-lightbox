import * as React from "react";

import {
  clsx,
  ComponentProps,
  createModule,
  cssClass,
  MODULE_CONTROLLER,
  PLUGIN_COUNTER,
  PluginProps,
  useLightboxState,
} from "../../index.js";
import { resolveCounterProps } from "./props.js";

export function CounterComponent({ counter }: ComponentProps) {
  const { slides, currentIndex } = useLightboxState();

  const {
    separator,
    container: { className, ...rest },
    // TODO v4: remove legacy configuration options
    className: legacyClassName,
    ...legacyRest
  } = resolveCounterProps(counter);

  if (slides.length === 0) return null;

  return (
    <div
      className={clsx(cssClass("counter"), className || legacyClassName)}
      {...legacyRest}
      {...rest}
      // slides already provide the "k of N" label, so there is no need to override the `aria-hidden` attribute here
      aria-hidden
    >
      {currentIndex + 1} {separator} {slides.length}
    </div>
  );
}

/** Counter plugin */
export function Counter({ augment, addChild }: PluginProps) {
  augment(({ counter, ...restProps }) => ({
    counter: resolveCounterProps(counter),
    ...restProps,
  }));

  addChild(MODULE_CONTROLLER, createModule(PLUGIN_COUNTER, CounterComponent));
}
