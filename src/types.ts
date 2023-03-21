import * as React from "react";

/** Lightbox external props */
export type LightboxExternalProps = DeepPartial<
    Partial<LightboxProps>,
    "carousel" | "animation" | "controller" | "toolbar"
>;

/** Lightbox properties */
export interface LightboxProps {
    /** if `true`, the lightbox is open */
    open: boolean;
    /** a callback to close the lightbox */
    close: Callback;
    /** starting slide index */
    index: number;
    /** slides to display in the lightbox */
    slides: Slide[];
    /** custom render functions */
    render: Render;
    /** custom UI labels */
    labels: Labels;
    /** enabled plugins */
    plugins: Plugin[];
    /** toolbar settings */
    toolbar: ToolbarSettings;
    /** carousel settings */
    carousel: CarouselSettings;
    /** animation settings */
    animation: AnimationSettings;
    /** controller settings */
    controller: ControllerSettings;
    /** lifecycle callbacks */
    on: Callbacks;
    /** customization styles */
    styles: SlotStyles;
    /** CSS class of the lightbox root element */
    className: string;
}

/** Slide */
export type Slide = SlideTypes[keyof SlideTypes];

/** Supported slide types */
export interface SlideTypes {
    /** image slide type */
    SlideImage: SlideImage;
}

/** Generic slide */
export interface GenericSlide {}

/** Image slide properties */
export interface SlideImage extends GenericSlide {
    /** slide type */
    type?: "image";
    /** image URL */
    src: string;
    /** image 'alt' attribute */
    alt?: string;
    /** image width in pixels */
    width?: number;
    /** image height in pixels */
    height?: number;
    /** `object-fit` setting */
    imageFit?: ImageFit;
    /** alternative images to be passed to the 'srcSet' */
    srcSet?: ImageSource[];
}

/** Image source */
export interface ImageSource {
    /** image URL */
    src: string;
    /** image width in pixels */
    width: number;
    /** image height in pixels */
    height: number;
}

/** Image fit setting */
export type ImageFit = "contain" | "cover";

/** Lightbox component */
export type Component = React.ComponentType<ComponentProps>;

/** Lightbox component properties */
export type ComponentProps = React.PropsWithChildren<Omit<LightboxProps, "slides" | "index" | "plugins">>;

/** Lightbox component tree node */
export type Node = {
    /** module */
    module: Module;
    /** module child nodes */
    children?: Node[];
};

/** Lightbox module */
export type Module = {
    /** module name */
    name: string;
    /** module component */
    component: Component;
};

/** Lightbox props augmentation */
export type Augmentation = (props: ComponentProps) => ComponentProps;

/** Container rect */
export type ContainerRect = {
    width: number;
    height: number;
};

/** Customization slots */
export type Slot = SlotType[keyof SlotType];

/** Supported customization slots */
export interface SlotType {
    /** lightbox root customization slot */
    root: "root";
    /** lightbox container customization slot */
    container: "container";
    /** lightbox button customization slot */
    button: "button";
    /** lightbox icon customization slot */
    icon: "icon";
}

/** Customization slot CSS properties */
interface SlotCSSProperties extends React.CSSProperties {
    [key: `--yarl__${string}`]: string | number;
}

/** Customization slots styles */
export type SlotStyles = {
    [key in Slot]?: SlotCSSProperties;
};

/** Carousel settings */
export interface CarouselSettings {
    /** if `true`, the lightbox carousel doesn't wrap around */
    finite: boolean;
    /** the lightbox preloads (2 * preload + 1) slides */
    preload: number;
    /** padding around each slide (e.g., "16px", "10%" or 0) */
    padding: LengthOrPercentage;
    /** spacing between slides (e.g., "100px", "50%" or 0) */
    spacing: LengthOrPercentage;
    /** `object-fit` setting for image slides */
    imageFit: ImageFit;
}

export type LengthOrPercentage = `${number}px` | `${number}%` | number;

/** Animation settings */
export interface AnimationSettings {
    /** fade-in / fade-out animation settings */
    fade: AnimationSpec;
    /** swipe animation settings */
    swipe: AnimationSpec;
    /** override for `swipe` animation settings when using keyboard navigation or navigation buttons */
    navigation?: AnimationSpec;
}

/** Animation duration or animation settings */
export type AnimationSpec =
    /** animation duration */
    | number
    | {
          /** animation duration */
          duration?: number;
          /** animation easing function */
          easing?: string;
      };

/** Controller settings */
export interface ControllerSettings {
    /** if true, the lightbox captures focus when it opens */
    focus: boolean;
    /** controller `touch-action` */
    touchAction: "none" | "pan-y";
    /** if `true`, set ARIA attributes on the controller div */
    aria: boolean;
    /** if `true`, close the lightbox when the backdrop is clicked */
    closeOnBackdropClick: boolean;
}

/** Render function */
export type RenderFunction<T = void> = (props: T) => React.ReactNode;

/** `render.slide` render function props */
export interface RenderSlideProps {
    /** slide */
    slide: Slide;
    /** slide offset (`0` - current slide, `1` - next slide, `-1` - previous slide, etc.) */
    offset: number;
    /** container rect */
    rect: ContainerRect;
}

/** `render.slideHeader` render function props */
export interface RenderSlideHeaderProps {
    slide: Slide;
}

/** `render.slideFooter` render function props */
export interface RenderSlideFooterProps {
    slide: Slide;
}

/** `render.slideContainer` render function props */
export interface RenderSlideContainerProps extends React.PropsWithChildren {
    slide: Slide;
}

/** Custom render functions. */
export interface Render {
    /** render custom slide type, or override the default image slide */
    slide?: RenderFunction<RenderSlideProps>;
    /** render custom slide header */
    slideHeader?: RenderFunction<RenderSlideHeaderProps>;
    /** render custom slide footer */
    slideFooter?: RenderFunction<RenderSlideFooterProps>;
    /** render custom slide container */
    slideContainer?: RenderFunction<RenderSlideContainerProps>;
    /** render custom Prev icon */
    iconPrev?: RenderFunction;
    /** render custom Next icon */
    iconNext?: RenderFunction;
    /** render custom Close icon */
    iconClose?: RenderFunction;
    /** render custom Loading icon */
    iconLoading?: RenderFunction;
    /** render custom Error icon */
    iconError?: RenderFunction;
    /** render custom Prev button */
    buttonPrev?: RenderFunction;
    /** render custom Next button */
    buttonNext?: RenderFunction;
    /** render custom Close button */
    buttonClose?: RenderFunction;
}

export type Callback<T = void> = (props: T) => void;

export interface ViewCallbackProps {
    index: number;
}

export interface ClickCallbackProps {
    index: number;
}

/** Lifecycle callbacks */
export interface Callbacks {
    /** a callback called when a slide becomes active */
    view?: Callback<ViewCallbackProps>;
    /** a callback called when a slide is clicked */
    click?: Callback<ClickCallbackProps>;
    /** a callback called when the portal starts opening */
    entering?: Callback;
    /** a callback called when the portal opens */
    entered?: Callback;
    /** a callback called when the portal starts closing */
    exiting?: Callback;
    /** a callback called when the portal closes */
    exited?: Callback;
}

/** Custom UI labels */
export type Labels = {
    [key: string]: string;
};

/** Toolbar settings */
export interface ToolbarSettings {
    /** buttons to render in the toolbar */
    buttons: ("close" | React.ReactNode)[];
}

/** Plugin methods */
export interface PluginProps {
    /** test if a target module is present */
    contains: (target: string) => boolean;
    /** add module as a parent */
    addParent: (target: string, module: Module) => void;
    /** add module as a child */
    addChild: (target: string, module: Module, precede?: boolean) => void;
    /** add module as a sibling */
    addSibling: (target: string, module: Module, precede?: boolean) => void;
    /** replace module */
    replace: (target: string, module: Module) => void;
    /** add module as a child and inherit all existing children */
    append: (target: string, module: Module) => void;
    /** remove module */
    remove: (target: string) => void;
    /** augment lightbox props */
    augment: (augmentation: Augmentation) => void;
}

/** Lightbox plugin */
export type Plugin = (props: PluginProps) => void;

/** Deep partial utility type */
export type DeepPartial<T, K extends keyof T> = Omit<T, K> & {
    [P in keyof Pick<T, K>]?: Partial<Pick<T, K>[P]>;
};

/** Deep non-nullable utility type */
export type DeepNonNullable<T> = T extends {}
    ? {
          [K in keyof T]-?: NonNullable<T[K]>;
      }
    : never;
