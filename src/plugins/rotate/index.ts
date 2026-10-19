import { Callback, PLUGIN_ROTATE, RenderFunction } from "../../index.js";
import { Rotate } from "./Rotate.js";

declare module "../../types.js" {
  interface Render {
    /** render custom Rotate button */
    buttonRotate?: RenderFunction<RotateRef>;
    /** render custom Rotate icon */
    iconRotate?: RenderFunction;
  }

  interface Labels {
    /** `Rotate clockwise` button title */
    "Rotate clockwise"?: string;
  }

  interface Callbacks {
    /** a callback called on image rotation */
    rotate?: Callback<RotateCallbackProps>;
  }

  interface ToolbarButtonKeys {
    [PLUGIN_ROTATE]: null;
  }

  interface RotateRef {
    /** clockwise rotation applied by the plugin, in degrees */
    rotation: number;
    /** if `true`, the current slide cannot be rotated */
    disabled: boolean;
    /** rotate the current image 90 degrees clockwise */
    rotate: Callback;
  }

  interface RotateCallbackProps {
    index: number;
    rotation: number;
  }
}

export default Rotate;
