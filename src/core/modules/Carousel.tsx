import * as React from "react";

import { Component, LightboxDefaultProps, Slide } from "../../types.js";
import { ContainerRect, useContainerRect } from "../hooks/index.js";
import { createModule } from "../config.js";
import { clsx, cssClass, cssVar } from "../utils.js";
import { ImageSlide } from "../components/index.js";
import { useController } from "./Controller.js";

type CarouselSlideProps = {
    slide: Slide;
    offset: number;
};

const CarouselSlide: React.FC<CarouselSlideProps> = ({ slide, offset }) => {
    const { setContainerRef, containerRect } = useContainerRect();

    const { latestProps } = useController();
    const { render } = latestProps.current;

    const renderSlide = (rect: ContainerRect) => {
        let rendered = render.slide?.(slide, offset, rect);

        if (!rendered && "src" in slide) {
            rendered = (
                <ImageSlide
                    slide={slide}
                    offset={offset}
                    render={render}
                    rect={rect}
                    imageFit={latestProps.current.carousel.imageFit}
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

    return (
        <div
            ref={setContainerRef}
            className={clsx(cssClass("slide"), cssClass("flex_center"))}
            style={{ [cssVar("slide_offset")]: offset }}
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
