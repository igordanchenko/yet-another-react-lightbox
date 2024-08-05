import * as React from "react";

import { ComponentProps, Slide } from "../types.js";
import { createModule } from "../config.js";
import {
  calculatePreload,
  clsx,
  composePrefix,
  cssClass,
  cssVar,
  getSlide,
  getSlideKey,
  hasSlides,
  isImageSlide,
  parseLengthPercentage,
} from "../utils.js";
import { ImageSlide } from "../components/index.js";
import { useController } from "./Controller/index.js";
import { useLightboxProps, useLightboxState } from "../contexts/index.js";
import { CLASS_FLEX_CENTER, CLASS_SLIDE_WRAPPER, MODULE_CAROUSEL } from "../consts.js";

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

  const { currentIndex } = useLightboxState();
  const { slideRect, close } = useController();
  const {
    render,
    carousel: { imageFit, imageProps },
    on: { click: onClick },
    controller: { closeOnBackdropClick },
    styles: { slide: style },
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
          imageProps={imageProps}
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
      closeOnBackdropClick &&
      target &&
      container &&
      (target === container ||
        // detect Zoom and Video wrappers
        (Array.from(container.children).find((x) => x === target) &&
          target.classList.contains(cssClass(CLASS_SLIDE_WRAPPER))))
    ) {
      close();
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      ref={containerRef}
      className={clsx(
        cssClass(cssSlidePrefix()),
        offset === 0 && cssClass(cssSlidePrefix("current")),
        cssClass(CLASS_FLEX_CENTER),
      )}
      aria-hidden={offset !== 0}
      onClick={handleBackdropClick}
      style={style}
    >
      {renderSlide()}
    </div>
  );
}

function Placeholder() {
  const style = useLightboxProps().styles.slide;
  return <div className={cssClass("slide")} style={style} />;
}

export function Carousel({ carousel }: ComponentProps) {
  const { slides, currentIndex, globalIndex } = useLightboxState();
  const { setCarouselRef } = useController();

  const spacingValue = parseLengthPercentage(carousel.spacing);
  const paddingValue = parseLengthPercentage(carousel.padding);

  const preload = calculatePreload(carousel, slides, 1);
  const items: ({ key: React.Key } & ({ slide: Slide; offset: number } | { slide?: never; offset?: never }))[] = [];

  if (hasSlides(slides)) {
    for (let index = currentIndex - preload; index <= currentIndex + preload; index += 1) {
      const slide = getSlide(slides, index);
      const key = globalIndex - currentIndex + index;
      const placeholder = carousel.finite && (index < 0 || index > slides.length - 1);

      items.push(
        !placeholder
          ? {
              key: [`${key}`, getSlideKey(slide)].filter(Boolean).join("|"),
              offset: index - currentIndex,
              slide,
            }
          : { key },
      );
    }
  }

  return (
    <div
      ref={setCarouselRef}
      className={clsx(cssClass(cssPrefix()), items.length > 0 && cssClass(cssPrefix("with_slides")))}
      style={{
        [`${cssVar(cssPrefix("slides_count"))}`]: items.length,
        [`${cssVar(cssPrefix("spacing_px"))}`]: spacingValue.pixel || 0,
        [`${cssVar(cssPrefix("spacing_percent"))}`]: spacingValue.percent || 0,
        [`${cssVar(cssPrefix("padding_px"))}`]: paddingValue.pixel || 0,
        [`${cssVar(cssPrefix("padding_percent"))}`]: paddingValue.percent || 0,
      }}
    >
      {items.map(({ key, slide, offset }) =>
        slide ? <CarouselSlide key={key} slide={slide} offset={offset} /> : <Placeholder key={key} />,
      )}
    </div>
  );
}

export const CarouselModule = createModule(MODULE_CAROUSEL, Carousel);
