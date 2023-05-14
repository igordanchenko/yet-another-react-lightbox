import { PLUGIN_DOWNLOAD } from "../../index.js";
import { Download } from "./Download.js";

declare module "../../types.js" {
    interface GenericSlide {
        /** @deprecated - use `download` instead */
        downloadUrl?: string;
        /** @deprecated - use `download` instead */
        downloadFilename?: string;
        /** download url or download props */
        download?:
            | boolean
            | string
            | {
                  /** download url */
                  url: string;
                  /** download filename override */
                  filename: string;
              };
    }

    interface LightboxProps {
        /** Download plugin settings */
        download?: {
            /** Custom download function */
            download?: ({ slide, saveAs }: DownloadFunctionProps) => void;
        };
    }

    interface Render {
        /** render custom Download button */
        buttonDownload?: RenderFunction;
        /** render custom Download icon */
        iconDownload?: RenderFunction;
    }

    interface Callbacks {
        /** a callback called on slide download */
        download?: Callback<DownloadCallbackProps>;
    }

    // noinspection JSUnusedGlobalSymbols
    interface ToolbarButtonKeys {
        [PLUGIN_DOWNLOAD]: null;
    }

    export interface DownloadCallbackProps {
        index: number;
    }

    export interface DownloadFunctionProps {
        slide: Slide;
        saveAs: (source: string | Blob, name?: string) => void;
    }
}

export default Download;
