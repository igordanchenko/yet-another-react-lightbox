import * as React from "react";

import { YARL_EVENT_BACKDROP_CLICK } from "../consts.js";
import { Component, Slide } from "../../types.js";
import { LightboxDefaultProps } from "../../props.js";
import { ContainerRect, useContainerRect } from "../hooks/index.js";
import { createModule } from "../config.js";
import { clsx, cssClass, cssVar, isImageSlide } from "../utils.js";
import { ImageSlide } from "../components/index.js";
import { useController } from "./Controller.js";
import { useEvents } from "../contexts/Events.js";

type CarouselSlideProps = {
    slide: Slide;
    offset: number;
};

const CarouselSlide: React.FC<CarouselSlideProps> = ({ slide, offset }) => {
    const { setContainerRef, containerRect, containerRef } = useContainerRect();

    const { publish } = useEvents();
    const { latestProps, currentIndex } = useController();
    const { render } = latestProps.current;

    const renderSlide = (rect: ContainerRect) => {
        let rendered = render.slide?.(slide, offset, rect);

        if (!rendered && isImageSlide(slide)) {
            rendered = (
                <ImageSlide
                    slide={slide}
                    offset={offset}
                    render={render}
                    rect={rect}
                    imageFit={latestProps.current.carousel.imageFit}
                    onClick={
                        latestProps.current.on.click && offset === 0
                            ? () => {
                                  latestProps.current.on.click?.(currentIndex);
                              }
                            : undefined
                    }
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
                    target.classList.contains(cssClass("fullsize"))))
        ) {
            publish(YARL_EVENT_BACKDROP_CLICK);
        }
    };

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        <div
            ref={setContainerRef}
            className={clsx(cssClass("slide"), cssClass("flex_center"))}
            style={{ [cssVar("slide_offset")]: offset }}
            onClick={handleBackdropClick}
        >
            {containerRect && renderSlide(containerRect)}
        </div>
    );
};

export const Carousel: Component = ({ slides, carousel: { finite, preload, padding, spacing } }) => {
    const { currentIndex, globalIndex } = useController();

    const items = [];

    if (slides?.length > 0) {
        for (let i = currentIndex - preload; i < currentIndex; i += 1) {
            if (!finite || i >= 0) {
                items.push(
                    <CarouselSlide
                        key={globalIndex + i - currentIndex}
                        slide={slides[(i + preload * slides.length) % slides.length]}
                        offset={i - currentIndex}
                    />
                );
            }
        }

        items.push(<CarouselSlide key={globalIndex} slide={slides[currentIndex]} offset={0} />);

        for (let i = currentIndex + 1; i <= currentIndex + preload; i += 1) {
            if (!finite || i <= slides.length - 1) {
                items.push(
                    <CarouselSlide
                        key={globalIndex + i - currentIndex}
                        slide={slides[i % slides.length]}
                        offset={i - currentIndex}
                    />
                );
            }
        }
    }

    const sanitize = (value: string | 0) =>
        value === 0 || value.trim() === "" || value.trim() === "0" ? "0px" : value;

    return (
        <div
            className={cssClass("carousel")}
            style={{
                ...(padding !== LightboxDefaultProps.carousel.padding
                    ? { [cssVar("carousel_padding")]: sanitize(padding) }
                    : null),
                ...(spacing !== LightboxDefaultProps.carousel.spacing
                    ? { [cssVar("carousel_spacing")]: sanitize(spacing) }
                    : null),
            }}
        >
            {items}
        </div>
    );
};

export const CarouselModule = createModule("carousel", Carousel);
