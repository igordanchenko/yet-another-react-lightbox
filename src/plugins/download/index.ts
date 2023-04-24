import { Callback, RenderFunction } from "../../types.js";
import { PLUGIN_DOWNLOAD } from "../../core/index.js";
import { Download } from "./Download.js";

declare module "../../types.js" {
    interface GenericSlide {
        /** download url */
        downloadUrl?: string;
        /** download filename override */
        downloadFilename?: string;
    }

    interface Render {
        /** render custom Download button */
        buttonDownload?: RenderFunction;
        /** render custom Download icon */
        iconDownload?: RenderFunction;
    }

    // noinspection JSUnusedGlobalSymbols
    interface Callbacks {
        /** a callback called on slide download */
        download?: Callback<DownloadCallbackProps>;
    }

    export interface DownloadCallbackProps {
        index: number;
    }

    // noinspection JSUnusedGlobalSymbols
    interface ToolbarButtonKeys {
        [PLUGIN_DOWNLOAD]: null;
    }
}

export default Download;
