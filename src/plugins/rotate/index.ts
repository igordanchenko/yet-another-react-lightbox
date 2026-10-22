import * as React from "react";

import { Callback, PLUGIN_ROTATE, RenderFunction } from "../../index.js";
import { Rotate } from "./Rotate.js";

declare module "../../types.js" {
  interface LightboxProps {
    /** Rotate plugin settings */
    rotate?: {
      /** Rotate plugin ref */
      ref?: React.ForwardedRef<RotateRef>;
      /** toolbar buttons to display (default: "both") */
      buttons?: "clockwise" | "counterclockwise" | "both";
    };
  }

  // noinspection JSUnusedGlobalSymbols
  interface SlideImage {
    /** initial clockwise image rotation in degrees (multiples of 90) */
    rotation?: number;
  }

  interface Render {
    /** render custom Rotate control in the toolbar */
    buttonRotate?: RenderFunction<RotateRef>;
    /** render custom Rotate Clockwise icon */
    iconRotateClockwise?: RenderFunction;
    /** render custom Rotate Counterclockwise icon */
    iconRotateCounterClockwise?: RenderFunction;
  }

  interface Labels {
    /** `Rotate clockwise` button title */
    "Rotate clockwise"?: string;
    /** `Rotate counterclockwise` button title */
    "Rotate counterclockwise"?: string;
  }

  // noinspection JSUnusedGlobalSymbols
  interface Callbacks {
    /** rotate callback */
    rotate?: Callback<RotateCallbackProps>;
  }

  /** Rotate callback props */
  interface RotateCallbackProps {
    /** index of the rotated slide */
    index: number;
    /** new clockwise rotation in degrees */
    rotation: number;
  }

  // noinspection JSUnusedGlobalSymbols
  interface ToolbarButtonKeys {
    [PLUGIN_ROTATE]: null;
  }

  /** Rotate plugin ref */
  interface RotateRef {
    /** clockwise rotation of the current slide in degrees (0, 90, 180 or 270) */
    rotation: number;
    /** if `true`, rotation is unavailable for the current slide */
    disabled: boolean;
    /** rotate the current slide 90 degrees clockwise */
    rotateClockwise: Callback;
    /** rotate the current slide 90 degrees counterclockwise */
    rotateCounterClockwise: Callback;
  }
}

export default Rotate;
