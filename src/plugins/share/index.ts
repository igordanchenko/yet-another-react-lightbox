import { Callback, PLUGIN_SHARE, RenderFunction, Slide } from "../../index.js";
import { Share } from "./Share.js";

export { isShareSupported } from "./utils.js";

declare module "../../types.js" {
  interface GenericSlide {
    /** share url or share props */
    share?:
      | boolean
      | string
      | {
          /** share url  */
          url?: string;
          /** share text  */
          text?: string;
          /** share title  */
          title?: string;
        };
  }

  interface LightboxProps {
    /** Share plugin settings */
    share?: {
      /** custom share function */
      share?: ({ slide }: ShareFunctionProps) => void;
    };
  }

  interface Render {
    /** render custom Share button */
    buttonShare?: RenderFunction;
    /** render custom Share icon */
    iconShare?: RenderFunction;
  }

  interface Labels {
    /** `Share` button title */
    Share?: string;
  }

  // noinspection JSUnusedGlobalSymbols
  interface Callbacks {
    /** a callback called on slide share */
    share?: Callback<ShareCallbackProps>;
  }

  // noinspection JSUnusedGlobalSymbols
  interface ToolbarButtonKeys {
    [PLUGIN_SHARE]: null;
  }

  interface ShareCallbackProps {
    index: number;
  }

  interface ShareFunctionProps {
    slide: Slide;
  }
}

export default Share;
