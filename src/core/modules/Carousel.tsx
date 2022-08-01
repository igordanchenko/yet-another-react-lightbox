import * as React from "react";

import { Component, Slide } from "../../types.js";
import { createModule } from "../config.js";
import { LightboxDefaultProps } from "../../props.js";
import { ContainerRect, useContainerRect } from "../hooks/index.js";
import { clsx, composePrefix, cssClass, cssVar, isImageSlide, parseSpacing } from "../utils.js";
import { ImageSlide } from "../components/index.js";
import { useController } from "./Controller.js";
import { useEvents } from "../contexts/Events.js";
import { useLightboxState } from "../contexts/LightboxState.js";
import { CLASS_FLEX_CENTER, CLASS_FULLSIZE, MODULE_CAROUSEL, YARL_EVENT_BACKDROP_CLICK } from "../consts.js";

const cssPrefix = (value?: string) => composePrefix(MODULE_CAROUSEL, value);

const cssSlidePrefix = (value?: string) => composePrefix("slide", value);

const sanitize = (value: string | number) => (value === 0 || value === "0" ? "0px" : value);

type CarouselSlideProps = {
    slide: Slide;
    offset: number;
};

const CarouselSlide: React.FC<CarouselSlideProps> = ({ slide, offset }) => {
    const { setContainerRef, containerRect, containerRef } = useContainerRect();

    const { publish } = useEvents();
    const {
        state: { currentIndex },
    } = useLightboxState();
    const { getLightboxProps } = useController();
    const {
        render,
        carousel: { imageFit },
        on: { click: onClick },
    } = getLightboxProps();

    const renderSlide = (rect: ContainerRect) => {
        let rendered = render.slide?.(slide, offset, rect);

        if (!rendered && isImageSlide(slide)) {
            rendered = (
                <ImageSlide
                    slide={slide}
                    offset={offset}
                    render={render}
                    rect={rect}
                    imageFit={imageFit}
                    onClick={offset === 0 ? () => onClick?.(currentIndex) : undefined}
                />
            );
        }

        return rendered ? (
            <>
                {render.slideHeader?.(slide)}
                {(render.slideContainer ?? ((_, x) => x))(slide, rendered)}
                {render.slideFooter?.(slide)}
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
            ref={setContainerRef}
            className={clsx(
                cssClass(cssSlidePrefix()),
                offset === 0 && cssClass(cssSlidePrefix("current")),
                cssClass(CLASS_FLEX_CENTER)
            )}
            onClick={handleBackdropClick}
        >
            {containerRect && renderSlide(containerRect)}
        </div>
    );
};

const Placeholder: React.FC = () => <div className={cssClass("slide")} />;

export const Carousel: Component = ({ slides, carousel: { finite, preload, padding, spacing } }) => {
    const {
        state: { currentIndex, globalIndex },
    } = useLightboxState();

    const { setCarouselRef } = useController();

    const spacingValue = parseSpacing(spacing);

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
            className={cssClass(cssPrefix())}
            style={
                {
                    [`${cssVar(cssPrefix("slides_count"))}`]: items.length,
                    [`${cssVar(cssPrefix("spacing_px"))}`]: spacingValue.pixel || 0,
                    [`${cssVar(cssPrefix("spacing_percent"))}`]: spacingValue.percent || 0,
                    ...(padding !== LightboxDefaultProps.carousel.padding
                        ? { [cssVar(cssPrefix("padding"))]: sanitize(padding) }
                        : null),
                } as React.CSSProperties
            }
        >
            {items}
        </div>
    );
};

export const CarouselModule = createModule(MODULE_CAROUSEL, Carousel);
