import * as React from "react";

import { Callback, PLUGIN_CAPTIONS, RenderFunction } from "../../index.js";

import { Captions } from "./Captions.js";

declare module "../../types.js" {
    export type TextAlignment = "start" | "end" | "center";

    // noinspection JSUnusedGlobalSymbols
    interface GenericSlide {
        /** slide title */
        title?: React.ReactNode;
        /** slide description */
        description?: React.ReactNode;
    }

    // noinspection JSUnusedGlobalSymbols
    interface ToolbarButtonKeys {
        [PLUGIN_CAPTIONS]: null;
    }

    interface LightboxProps {
        /** Captions plugin settings */
        captions?: {
            /** Captions plugin ref */
            ref?: React.ForwardedRef<CaptionsRef>;
            /** if `true`, show Captions Toggle button in the toolbar */
            showToggle?: boolean;
            /** description text alignment */
            descriptionTextAlign?: TextAlignment;
            /** maximum number of lines to display in the description section */
            descriptionMaxLines?: number;
        };
    }

    // noinspection JSUnusedGlobalSymbols
    interface SlotType {
        /** captions title customization slot */
        captionsTitle: "captionsTitle";
        /** captions title container customization slot */
        captionsTitleContainer: "captionsTitleContainer";
        /** captions description customization slot */
        captionsDescription: "captionsDescription";
        /** captions description container customization slot */
        captionsDescriptionContainer: "captionsDescriptionContainer";
    }

    // noinspection JSUnusedGlobalSymbols
    interface Render {
        /** render custom Captions Visible icon */
        iconCaptionsVisible?: RenderFunction;
        /** render custom Captions Hidden icon */
        iconCaptionsHidden?: RenderFunction;
        /** render custom Captions button */
        buttonCaptions?: RenderFunction<CaptionsRef>;
    }

    /** Captions plugin ref */
    export interface CaptionsRef {
        /** if `true`, captions are visible */
        visible: boolean;
        /** show captions */
        show: Callback;
        /** hide captions */
        hide: Callback;
    }
}

export default Captions;
