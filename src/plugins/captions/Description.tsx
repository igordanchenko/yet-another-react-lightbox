import * as React from "react";

import { clsx, cssVar, Slide, useLightboxProps } from "../../index.js";
import { cssPrefix } from "./utils.js";
import { defaultCaptionsProps, useCaptionsProps } from "./props.js";
import { useCaptions } from "./CaptionsContext.js";

export type DescriptionProps = Pick<Slide, "description">;

export function Description({ description }: DescriptionProps) {
  const { descriptionTextAlign, descriptionMaxLines } = useCaptionsProps();
  const { styles } = useLightboxProps();
  const { visible } = useCaptions();

  if (!visible) return null;

  // noinspection SuspiciousTypeOfGuard
  return (
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
}
