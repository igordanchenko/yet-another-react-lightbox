import * as React from "react";

import { LightboxProps, Slide } from "../../types.js";
import { clsx, cssVar } from "../../core/index.js";
import { useCaptions } from "./CaptionsContext.js";
import { cssPrefix } from "./utils.js";

export type TitleProps = Pick<LightboxProps, "styles"> & Pick<Slide, "title">;

export function Title({ title, styles }: TitleProps) {
    const { toolbarWidth } = useCaptions();

    return (
        <div
            style={styles.captionsTitleContainer}
            className={clsx(cssPrefix("captions_container"), cssPrefix("title_container"))}
        >
            <div
                style={styles.captionsTitle}
                className={cssPrefix("title")}
                {...(toolbarWidth ? { style: { [cssVar("toolbar_width")]: `${toolbarWidth}px` } } : null)}
            >
                {title}
            </div>
        </div>
    );
}
