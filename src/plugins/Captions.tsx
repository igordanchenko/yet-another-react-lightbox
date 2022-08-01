import * as React from "react";

import { Component, LightboxProps, Plugin, Slide } from "../types.js";
import { clsx, cssClass, cssVar, isDefined, makeUseContext } from "../core/utils.js";
import { useEvents } from "../core/contexts/Events.js";
import { createModule } from "../core/index.js";

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

const defaultTextAlign = "start";
const defaultMaxLines = 3;

const cssPrefix = (className: string) => cssClass(`slide_${className}`);

const hasTitle = (slide: Slide): slide is Slide & { title: string } =>
    "title" in slide ? typeof (slide as unknown as { title: unknown }).title === "string" : false;

const hasDescription = (slide: Slide): slide is Slide & { description: string } =>
    "description" in slide ? typeof (slide as unknown as { description: unknown }).description === "string" : false;

type CaptionsContextType = {
    toolbarWidth?: number;
};

const CaptionsContext = React.createContext<CaptionsContextType | null>(null);

const useCaptions = makeUseContext("useCaptions", "CaptionsContext", CaptionsContext);

type TitleProps = Pick<LightboxProps, "styles"> & {
    title: string;
};

const Title: React.FC<TitleProps> = ({ title, styles }) => {
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
};

type DescriptionProps = Pick<LightboxProps, "styles"> & {
    description: string;
    align: TextAlignment;
    maxLines: number;
};

const Description: React.FC<DescriptionProps> = ({ description, align, maxLines, styles }) => (
    <div
        style={styles.captionsDescriptionContainer}
        className={clsx(cssPrefix("captions_container"), cssPrefix("description_container"))}
    >
        <div
            className={cssPrefix("description")}
            style={{
                ...(align !== defaultTextAlign || maxLines !== defaultMaxLines
                    ? {
                          style: {
                              [cssVar("slide_description_text_align")]: align,
                              [cssVar("slide_description_max_lines")]: maxLines,
                          },
                      }
                    : null),
                ...styles.captionsDescription,
            }}
        >
            {description.split("\n").flatMap((line, index) => [...(index > 0 ? [<br key={index} />] : []), line])}
        </div>
    </div>
);

/** Captions plugin context holder */
export const CaptionsComponent: Component = ({ children }) => {
    const { subscribe } = useEvents();

    const [toolbarWidth, setToolbarWidth] = React.useState<number>();

    React.useEffect(
        () =>
            subscribe("toolbar-width", (event) => {
                if (!isDefined(event) || typeof event === "number") {
                    setToolbarWidth(event);
                }
            }),
        [subscribe]
    );

    const context = React.useMemo(() => ({ toolbarWidth }), [toolbarWidth]);

    return <CaptionsContext.Provider value={context}>{children}</CaptionsContext.Provider>;
};

/** Captions plugin module */
export const CaptionsModule = createModule("captions", CaptionsComponent);

/** Captions plugin */
export const Captions: Plugin = ({ augment, addParent }) => {
    addParent("controller", CaptionsModule);

    augment(({ render: { slideFooter: renderFooter, ...restRender }, captions, styles, ...restProps }) => ({
        render: {
            slideFooter: (slide) => (
                <>
                    {renderFooter?.(slide)}
                    {hasTitle(slide) && <Title styles={styles} title={slide.title} />}
                    {hasDescription(slide) && (
                        <Description
                            styles={styles}
                            description={slide.description}
                            align={captions?.descriptionTextAlign ?? defaultTextAlign}
                            maxLines={captions?.descriptionMaxLines ?? defaultMaxLines}
                        />
                    )}
                </>
            ),
            ...restRender,
        },
        styles,
        ...restProps,
    }));
};

// noinspection JSUnusedGlobalSymbols
export default Captions;
