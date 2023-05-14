import { PLUGIN_SHARE } from "../../index.js";
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

    interface Callbacks {
        /** a callback called on slide share */
        share?: Callback<ShareCallbackProps>;
    }

    interface ToolbarButtonKeys {
        [PLUGIN_SHARE]: null;
    }

    export interface ShareCallbackProps {
        index: number;
    }

    export interface ShareFunctionProps {
        slide: Slide;
    }
}

export default Share;
