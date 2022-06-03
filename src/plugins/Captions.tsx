import * as React from "react";

import { Plugin, Slide } from "../types.js";
import { cssClass, cssVar } from "../core/utils.js";

type TextAlignment = "start" | "end" | "center";

declare module "../types.js" {
    interface SlideImage {
        /** slide title */
        title?: string;
        /** slide description */
        description?: string;
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
}

const defaultTextAlign = "start";
const defaultMaxLines = 3;

const cls = (className: string) => cssClass(`slide_${className}`);

const hasTitle = (slide: Slide): slide is Slide & { title: string } =>
    "title" in slide ? typeof (slide as unknown as { title: unknown }).title === "string" : false;

const hasDescription = (slide: Slide): slide is Slide & { description: string } =>
    "description" in slide ? typeof (slide as unknown as { description: unknown }).description === "string" : false;

type TitleProps = {
    title: string;
};

const Title: React.FC<TitleProps> = ({ title }) => (
    <div className={cls(`title_container`)}>
        <div className={cls("title")}>{title}</div>
    </div>
);

type DescriptionProps = {
    description: string;
    align: TextAlignment;
    maxLines: number;
};

const Description: React.FC<DescriptionProps> = ({ description, align, maxLines }) => (
    <div className={cls("description_container")}>
        <div
            className={cls("description")}
            {...(align !== defaultTextAlign || maxLines !== defaultMaxLines
                ? {
                      style: {
                          [cssVar("slide_description_text_align")]: align,
                          [cssVar("slide_description_max_lines")]: maxLines,
                      },
                  }
                : null)}
        >
            {description.split("\n").flatMap((line, index) => [...(index > 0 ? [<br key={index} />] : []), line])}
        </div>
    </div>
);

/** Captions plugin */
export const Captions: Plugin = ({ augment }) => {
    augment(({ render: { slideFooter: renderFooter, ...restRender }, captions, ...restProps }) => ({
        render: {
            slideFooter: (slide) => (
                <>
                    {renderFooter?.(slide)}
                    {hasTitle(slide) && <Title title={slide.title} />}
                    {hasDescription(slide) && (
                        <Description
                            description={slide.description}
                            align={captions?.descriptionTextAlign ?? defaultTextAlign}
                            maxLines={captions?.descriptionMaxLines ?? defaultMaxLines}
                        />
                    )}
                </>
            ),
            ...restRender,
        },
        ...restProps,
    }));
};

export default Captions;
