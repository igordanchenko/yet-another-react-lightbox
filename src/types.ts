import * as React from "react";

/** Image fit setting */
export type ImageFit = "contain" | "cover";

/** Image source */
export interface ImageSource {
    /** image URL */
    src: string;
    /** image width in pixels */
    width: number;
    /** image height in pixels */
    height: number;
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

/** Supported slide types */
export interface SlideTypes {
    /** image slide type */
    SlideImage: SlideImage;
}

/** Slide */
export type Slide = SlideTypes[keyof SlideTypes];

/** Container rect */
export type ContainerRect = {
    width: number;
    height: number;
};

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

/** Customization slots */
export type Slot = SlotType[keyof SlotType];

/** Customization slot CSS properties */
interface SlotCSSProperties extends React.CSSProperties {
    [key: `--yarl__${string}`]: string | number;
}

/** Customization slots styles */
export type SlotStyles = { [key in Slot]?: SlotCSSProperties };

/** Carousel settings */
export interface CarouselSettings {
    /** if `true`, the lightbox carousel doesn't wrap around */
    finite: boolean;
    /** the lightbox preloads (2 * preload + 1) slides */
    preload: number;
    /** padding around each slide (e.g., "16px", "10px 20px" or 0) */
    padding: string | 0;
    /** spacing between slides (e.g., "100px", "50%" or 0) */
    spacing: string | 0;
    /** `object-fit` setting for image slides */
    imageFit: ImageFit;
}

/** Animation settings */
export interface AnimationSettings {
    /** fade-in / fade-out animation settings */
    fade: AnimationSpec;
    /** swipe animation settings */
    swipe: AnimationSpec;
    // TODO v3: consider decoupling `navigation` and `swipe` animation duration
    /** override for `swipe` animation settings when using keyboard navigation or navigation buttons */
    navigation?: AnimationSpec;
}

/** Animation duration or animation settings */
export type AnimationSpec =
    | {
          /** animation duration */
          duration?: number;
          /** animation easing function */
          easing?: string;
      }
    /** animation duration */
    | number;

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

/** Custom render functions. */
export interface Render {
    // TODO v3: convert arguments array to props object
    /** render custom slide type, or override the default image slide */
    slide?: (
        /** slide */
        slide: Slide,
        /** slide offset (`0` - current slide, `1` - next slide, `-1` - previous slide, etc.) */
        offset: number,
        /** container rect */
        rect: ContainerRect
    ) => React.ReactNode;
    /** render custom slide header */
    slideHeader?: (slide: Slide) => React.ReactNode;
    /** render custom slide footer */
    slideFooter?: (slide: Slide) => React.ReactNode;
    /** render custom slide container */
    slideContainer?: (slide: Slide, children: React.ReactNode) => React.ReactNode;
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
    /** a callback called when a slide is clicked */
    click?: (index: number) => void;
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
    /** customization styles */
    styles: SlotStyles;
    /** CSS class of the lightbox root element */
    className: string;
}

/** Custom UI labels */
export type Labels = { [key: string]: string };

/** Toolbar settings */
export interface ToolbarSettings {
    /** buttons to render in the toolbar */
    buttons: ("close" | React.ReactNode)[];
}

/** Lightbox component properties */
export type ComponentProps = React.PropsWithChildren<Omit<LightboxProps, "plugins">>;

/** Lightbox component */
export type Component = React.ComponentType<ComponentProps>;

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
};

/** Lightbox plugin */
export type Plugin = ({ addParent, addChild, addSibling, replace, remove, append, augment }: PluginMethods) => void;

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

/** Lightbox external props */
export type LightboxExternalProps = DeepPartial<
    Partial<LightboxProps>,
    "carousel" | "animation" | "controller" | "toolbar"
>;
