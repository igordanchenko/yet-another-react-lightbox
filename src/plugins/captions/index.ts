import * as React from "react";

import { Callback, RenderFunction } from "../../types.js";
import { Captions } from "./Captions.js";

declare module "../../types.js" {
    export type TextAlignment = "start" | "end" | "center";

    interface GenericSlide {
        /** slide title */
        title?: React.ReactNode;
        /** slide description */
        description?: React.ReactNode;
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
