import * as React from "react";

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
}

export default Captions;
