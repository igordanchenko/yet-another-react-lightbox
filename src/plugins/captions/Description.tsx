import * as React from "react";

import { LightboxProps, Slide } from "../../types.js";
import { clsx, cssVar } from "../../core/index.js";
import { defaultCaptionsProps } from "./Captions.js";
import { cssPrefix } from "./utils.js";

type DescriptionProps = Pick<LightboxProps, "styles"> &
    Required<Pick<Slide, "description">> &
    Required<LightboxProps["captions"]>;

export const Description: React.FC<DescriptionProps> = ({
    description,
    descriptionTextAlign,
    descriptionMaxLines,
    styles,
}) => (
    <div
        style={styles.captionsDescriptionContainer}
        className={clsx(cssPrefix("captions_container"), cssPrefix("description_container"))}
    >
        <div
            className={cssPrefix("description")}
            style={{
                ...(descriptionTextAlign !== defaultCaptionsProps.descriptionTextAlign ||
                descriptionMaxLines !== defaultCaptionsProps.descriptionMaxLines
                    ? {
                          [cssVar("slide_description_text_align")]: descriptionTextAlign,
                          [cssVar("slide_description_max_lines")]: descriptionMaxLines,
                      }
                    : null),
                ...styles.captionsDescription,
            }}
        >
            {typeof description === "string"
                ? description.split("\n").flatMap((line, index) => [...(index > 0 ? [<br key={index} />] : []), line])
                : description}
        </div>
    </div>
);
