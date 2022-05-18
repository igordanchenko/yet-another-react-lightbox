import * as React from "react";

import { Component, LightboxDefaultProps, Render, Slide } from "../../types.js";
import { createModule } from "../config.js";
import { clsx, cssClass, cssVar } from "../utils.js";
import { ImageSlide } from "../components/index.js";
import { useController } from "./Controller.js";

type CarouselSlideProps = {
    slide: Slide;
    offset: number;
    renderSlide: Render["slide"];
};

const CarouselSlide = ({ slide, offset, renderSlide }: CarouselSlideProps) => (
    <div className={clsx(cssClass("slide"), cssClass("flex_center"))} style={{ [cssVar("slide_offset")]: offset }}>
        {renderSlide(slide) || ("src" in slide && <ImageSlide slide={slide} />)}
    </div>
);

export const Carousel: Component = (props) => {
    const {
        slides,
        carousel: { finite, preload, padding, spacing },
        render: { slide: renderSlide },
    } = props;

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
                        renderSlide={renderSlide}
                    />
                );
            }
        }

        items.push(
            <CarouselSlide key={globalIndex} slide={slides[currentIndex]} offset={0} renderSlide={renderSlide} />
        );

        for (let i = currentIndex + 1; i <= currentIndex + preload; i += 1) {
            if (!finite || i <= slides.length - 1) {
                items.push(
                    <CarouselSlide
                        key={globalIndex + i - currentIndex}
                        slide={slides[i % slides.length]}
                        offset={i - currentIndex}
                        renderSlide={renderSlide}
                    />
                );
            }
        }
    }

    return (
        <div
            className={cssClass("carousel")}
            style={{
                ...(padding !== LightboxDefaultProps.carousel.padding
                    ? { [cssVar("carousel_padding")]: padding }
                    : null),
                ...(spacing !== LightboxDefaultProps.carousel.spacing
                    ? { [cssVar("carousel_spacing")]: spacing !== 0 ? spacing : "0px" }
                    : null),
            }}
        >
            {items}
        </div>
    );
};

export const CarouselModule = createModule("carousel", Carousel);
