import * as React from "react";
import PropTypes from "prop-types";

/** Image slide properties */
export interface SlideImage {
    /** image URL */
    src?: string;
    /** image 'alt' attribute */
    alt?: string;
    /** image aspect ratio */
    aspectRatio?: number;
    /** alternative images to be passed to the 'srcSet' */
    srcSet?: {
        /** image URL */
        src: string;
        /** image width in pixels */
        width: number;
    }[];
}

/** Supported slide types */
export interface SlideTypes {
    /** image slide type */
    SlideImage: SlideImage;
}

/** Slide */
export type Slide = SlideTypes[keyof SlideTypes];

/** Carousel settings */
export interface CarouselSettings {
    /** if `true`, the lightbox carousel doesn't wrap around */
    finite: boolean;
    /** the lightbox preloads (2 * preload + 1) slides */
    preload: number;
    /** padding around each slide */
    padding: string | number;
    /** spacing between slides (e.g., "100px", "50%" or 0) */
    spacing: string | number;
}

/** Animation settings */
export interface AnimationSettings {
    /** fade-in / fade-out animation duration */
    fade: number;
    /** swipe animation duration */
    swipe: number;
}

/** Controller settings */
export interface ControllerSettings {
    /** if true, the lightbox captures focus when it opens v     */
    focus: boolean;
}

/** Custom render functions. */
export interface Render {
    /** render custom slide type, or override the default image slide */
    slide?: (slide: Slide) => React.ReactNode;
    /** render custom Prev icon */
    iconPrev?: () => React.ReactNode;
    /** render custom Next icon */
    iconNext?: () => React.ReactNode;
    /** render custom Close icon */
    iconClose?: () => React.ReactNode;
    /** render custom Loading icon */
    iconLoading?: () => React.ReactNode;
    /** render custom Error icon */
    iconError?: () => React.ReactNode;
    /** render custom Prev button */
    buttonPrev?: () => React.ReactNode;
    /** render custom Next button */
    buttonNext?: () => React.ReactNode;
    /** render custom Close button */
    buttonClose?: () => React.ReactNode;
}

/** Lifecycle callbacks */
export interface Callbacks {
    /** a callback called when a slide becomes active */
    view?: (index: number) => void;
    /** a callback called when the portal starts opening */
    entering?: () => void;
    /** a callback called when the portal opens */
    entered?: () => void;
    /** a callback called when the portal starts closing */
    exiting?: () => void;
    /** a callback called when the portal closes */
    exited?: () => void;
}

/** Lightbox properties */
export interface LightboxProps {
    /** if `true`, the lightbox is open */
    open: boolean;
    /** a callback to close the lightbox */
    close: () => void;
    /**
     * Starting slide index. The lightbox reads this property only when it opens.
     * Changing this property while the lightbox is already open has no effect.
     */
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
}

export const ImageSlidePropTypes = PropTypes.shape({
    src: PropTypes.string,
    alt: PropTypes.string,
    aspectRatio: PropTypes.number,
    srcSet: PropTypes.arrayOf(
        PropTypes.shape({
            src: PropTypes.string.isRequired,
            width: PropTypes.number.isRequired,
        }).isRequired
    ),
});

export const SlideTypesPropTypes: PropTypes.Validator<any>[] = [ImageSlidePropTypes];

export const LightboxPropTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    slides: PropTypes.arrayOf(PropTypes.oneOfType(SlideTypesPropTypes).isRequired).isRequired,
    render: PropTypes.shape({
        slide: PropTypes.func,
        iconPrev: PropTypes.func,
        iconNext: PropTypes.func,
        iconClose: PropTypes.func,
        iconLoading: PropTypes.func,
        iconError: PropTypes.func,
        buttonPrev: PropTypes.func,
        buttonNext: PropTypes.func,
        buttonClose: PropTypes.func,
    }).isRequired,
    plugins: PropTypes.arrayOf(PropTypes.func.isRequired).isRequired,
    toolbar: PropTypes.shape({
        buttons: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.oneOf(["close"]), PropTypes.node])).isRequired,
    }).isRequired,
    labels: PropTypes.shape({}).isRequired,
    carousel: PropTypes.shape({
        finite: PropTypes.bool.isRequired,
        preload: PropTypes.number.isRequired,
        padding: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        spacing: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    }).isRequired,
    animation: PropTypes.shape({
        fade: PropTypes.number.isRequired,
        swipe: PropTypes.number.isRequired,
    }).isRequired,
    controller: PropTypes.shape({
        focus: PropTypes.bool.isRequired,
    }).isRequired,
    on: PropTypes.shape({
        view: PropTypes.func,
        entering: PropTypes.func,
        entered: PropTypes.func,
        exiting: PropTypes.func,
        exited: PropTypes.func,
    }).isRequired,
};

export const LightboxDefaultProps = {
    open: false,
    close: () => {},
    index: 0,
    slides: [] as Slide[],
    render: {} as Render,
    plugins: [] as Plugin[],
    toolbar: { buttons: ["close"] } as ToolbarSettings,
    labels: {} as Labels,
    animation: {
        fade: 330,
        swipe: 500,
    } as AnimationSettings,
    carousel: {
        finite: false,
        preload: 2,
        padding: "16px",
        spacing: "30%",
    } as CarouselSettings,
    controller: {
        focus: true,
    } as ControllerSettings,
    on: {} as Callbacks,
};

/** Custom UI labels */
export type Labels = { [key: string]: string };

/** Toolbar settings */
export interface ToolbarSettings {
    /** buttons to render in the toolbar */
    buttons: ("close" | React.ReactNode)[];
}

/** Lightbox component properties */
export type ComponentProps = Omit<LightboxProps, "plugins">;

/** Lightbox component */
export type Component = React.ComponentType<React.PropsWithChildren<ComponentProps>>;

/** Lightbox module */
export type Module = {
    /** module name */
    name: string;
    /** module component */
    component: Component;
};

/** Lightbox component tree node */
export type Node = {
    /** module */
    module: Module;
    /** module child nodes */
    children?: Node[];
};

/** Lightbox props augmentation */
export type Augmentation = (props: LightboxProps) => LightboxProps;

/** Plugin methods */
export type PluginMethods = {
    /** add module as parent */
    addParent: (target: string, module: Module) => void;
    /** add module as child */
    addChild: (target: string, module: Module, precede?: boolean) => void;
    /** add module as sibling */
    addSibling: (target: string, module: Module, precede?: boolean) => void;
    /** replace module */
    replace: (target: string, module: Module) => void;
    /** remove module */
    remove: (target: string) => void;
    /** augment lightbox props */
    augment: (augmentation: Augmentation) => void;
};

/** Lightbox plugin */
export type Plugin = ({ addParent, addChild, addSibling, replace, remove, augment }: PluginMethods) => void;
