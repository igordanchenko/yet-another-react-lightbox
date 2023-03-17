import * as React from "react";

import { ComponentProps, Slide } from "../../types.js";
import { createModule } from "../config.js";
import { clsx, composePrefix, cssClass, cssVar, isImageSlide, parseLengthPercentage } from "../utils.js";
import { ImageSlide } from "../components/index.js";
import { useController } from "./Controller.js";
import { useEvents, useLightboxProps, useLightboxState } from "../contexts/index.js";
import { CLASS_FLEX_CENTER, CLASS_FULLSIZE, MODULE_CAROUSEL, YARL_EVENT_BACKDROP_CLICK } from "../consts.js";

function cssPrefix(value?: string) {
    return composePrefix(MODULE_CAROUSEL, value);
}

function cssSlidePrefix(value?: string) {
    return composePrefix("slide", value);
}

type CarouselSlideProps = {
    slide: Slide;
    offset: number;
};

function CarouselSlide({ slide, offset }: CarouselSlideProps) {
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const { publish } = useEvents();
    const { currentIndex } = useLightboxState().state;
    const { slideRect } = useController();
    const {
        render,
        carousel: { imageFit },
        on: { click: onClick },
    } = useLightboxProps();

    const renderSlide = () => {
        let rendered = render.slide?.({ slide, offset, rect: slideRect });

        if (!rendered && isImageSlide(slide)) {
            rendered = (
                <ImageSlide
                    slide={slide}
                    offset={offset}
                    render={render}
                    rect={slideRect}
                    imageFit={imageFit}
                    onClick={offset === 0 ? () => onClick?.({ index: currentIndex }) : undefined}
                />
            );
        }

        return rendered ? (
            <>
                {render.slideHeader?.({ slide })}
                {(render.slideContainer ?? (({ children }) => children))({ slide, children: rendered })}
                {render.slideFooter?.({ slide })}
            </>
        ) : null;
    };

    const handleBackdropClick: React.MouseEventHandler = (event) => {
        const container = containerRef.current;
        const target = event.target instanceof HTMLElement ? event.target : undefined;
        if (
            target &&
            container &&
            (target === container ||
                // detect zoom wrapper
                (Array.from(container.children).find((x) => x === target) &&
                    target.classList.contains(cssClass(CLASS_FULLSIZE))))
        ) {
            publish(YARL_EVENT_BACKDROP_CLICK);
        }
    };

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <div
            ref={containerRef}
            className={clsx(
                cssClass(cssSlidePrefix()),
                offset === 0 && cssClass(cssSlidePrefix("current")),
                cssClass(CLASS_FLEX_CENTER)
            )}
            onClick={handleBackdropClick}
        >
            {renderSlide()}
        </div>
    );
}

function Placeholder() {
    return <div className={cssClass("slide")} />;
}

export function Carousel({ carousel: { finite, preload, padding, spacing } }: ComponentProps) {
    const { slides, currentIndex, globalIndex } = useLightboxState().state;
    const { setCarouselRef } = useController();

    const spacingValue = parseLengthPercentage(spacing);
    const paddingValue = parseLengthPercentage(padding);

    const items = [];

    if (slides?.length > 0) {
        for (let i = currentIndex - preload; i < currentIndex; i += 1) {
            const key = globalIndex + i - currentIndex;
            items.push(
                !finite || i >= 0 ? (
                    <CarouselSlide
                        key={key}
                        slide={slides[(i + preload * slides.length) % slides.length]}
                        offset={i - currentIndex}
                    />
                ) : (
                    <Placeholder key={key} />
                )
            );
        }

        items.push(<CarouselSlide key={globalIndex} slide={slides[currentIndex]} offset={0} />);

        for (let i = currentIndex + 1; i <= currentIndex + preload; i += 1) {
            const key = globalIndex + i - currentIndex;
            items.push(
                !finite || i <= slides.length - 1 ? (
                    <CarouselSlide key={key} slide={slides[i % slides.length]} offset={i - currentIndex} />
                ) : (
                    <Placeholder key={key} />
                )
            );
        }
    }

    return (
        <div
            ref={setCarouselRef}
            className={clsx(cssClass(cssPrefix()), items.length > 0 && cssClass(cssPrefix("with_slides")))}
            style={
                {
                    [`${cssVar(cssPrefix("slides_count"))}`]: items.length,
                    [`${cssVar(cssPrefix("spacing_px"))}`]: spacingValue.pixel || 0,
                    [`${cssVar(cssPrefix("spacing_percent"))}`]: spacingValue.percent || 0,
                    [`${cssVar(cssPrefix("padding_px"))}`]: paddingValue.pixel || 0,
                    [`${cssVar(cssPrefix("padding_percent"))}`]: paddingValue.percent || 0,
                } as React.CSSProperties
            }
        >
            {items}
        </div>
    );
}

export const CarouselModule = createModule(MODULE_CAROUSEL, Carousel);
