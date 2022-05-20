import * as React from "react";
import PropTypes from "prop-types";

export interface SlideImage {
    src?: string;
    title?: string;
    aspectRatio?: number;
    srcSet?: { src: string; width: number }[];
}

export interface SlideTypes {
    SlideImage: SlideImage;
}

export type Slide = SlideTypes[keyof SlideTypes];

export interface Carousel {
    finite: boolean;
    preload: number;
    padding: string | number;
    spacing: string | number;
}

export interface Animation {
    fade: number;
    swipe: number;
}

export interface Render {
    slide?: (slide: Slide) => React.ReactNode;
    iconPrev?: () => React.ReactNode;
    iconNext?: () => React.ReactNode;
    iconClose?: () => React.ReactNode;
    iconLoading?: () => React.ReactNode;
    iconError?: () => React.ReactNode;
    buttonPrev?: () => React.ReactNode;
    buttonNext?: () => React.ReactNode;
    buttonClose?: () => React.ReactNode;
}

export interface Callbacks {
    view?: (index: number) => void;
    entering?: () => void;
    entered?: () => void;
    exiting?: () => void;
    exited?: () => void;
}

export interface LightboxProps {
    open: boolean;
    close: () => void;
    index: number;
    slides: Slide[];
    render: Render;
    labels: Labels;
    plugins: Plugin[];
    toolbar: Toolbar;
    carousel: Carousel;
    animation: Animation;
    on: Callbacks;
}

export const SlideTypesPropTypes: PropTypes.Validator<any>[] = [
    PropTypes.shape({
        src: PropTypes.string.isRequired,
        title: PropTypes.string,
        aspectRatio: PropTypes.number,
        srcSet: PropTypes.oneOfType([
            PropTypes.string.isRequired,
            PropTypes.arrayOf(
                PropTypes.shape({
                    src: PropTypes.string.isRequired,
                    width: PropTypes.number.isRequired,
                }).isRequired
            ).isRequired,
        ]),
    }),
];

export const LightboxPropTypes = {
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    slides: PropTypes.arrayOf(PropTypes.oneOfType(SlideTypesPropTypes).isRequired).isRequired,
    render: PropTypes.shape({}).isRequired,
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
    on: PropTypes.shape({}).isRequired,
};

export const LightboxDefaultProps = {
    open: false,
    close: () => {},
    index: 0,
    slides: [] as Slide[],
    render: {} as Render,
    plugins: [] as Plugin[],
    toolbar: { buttons: ["close"] } as Toolbar,
    labels: {} as Labels,
    animation: {
        fade: 330,
        swipe: 500,
    } as Animation,
    carousel: {
        finite: false,
        preload: 2,
        padding: "16px",
        spacing: "30%",
    } as Carousel,
    on: {} as Callbacks,
};

export type Labels = { [key: string]: string };

export interface Toolbar {
    buttons: ("close" | React.ReactNode)[];
}

export type ComponentProps = Omit<LightboxProps, "plugins">;

export type Component = React.ComponentType<React.PropsWithChildren<ComponentProps>>;

export type Module = {
    name: string;
    component: Component;
};

export type Node = {
    module: Module;
    children?: Node[];
};

export type Augmentation = (props: LightboxProps) => LightboxProps;

export type Plugin = ({
    addParent,
    addChild,
    addSibling,
    replace,
    remove,
}: {
    addParent: (target: string, module: Module) => void;
    addChild: (target: string, module: Module, precede?: boolean) => void;
    addSibling: (target: string, module: Module, precede?: boolean) => void;
    replace: (target: string, module: Module) => void;
    remove: (target: string) => void;
    augment: (augmentation: Augmentation) => void;
}) => void;
