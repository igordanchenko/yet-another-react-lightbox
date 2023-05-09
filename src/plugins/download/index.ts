import { Callback, PLUGIN_DOWNLOAD, RenderFunction } from "../../index.js";
import { Download } from "./Download.js";

declare module "../../types.js" {
    // noinspection JSUnusedGlobalSymbols
    interface GenericSlide {
        /** download url */
        downloadUrl?: string;
        /** download filename override */
        downloadFilename?: string;
    }

    // noinspection JSUnusedGlobalSymbols
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
