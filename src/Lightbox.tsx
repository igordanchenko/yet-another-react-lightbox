import * as React from "react";

import { LightboxDefaultProps, LightboxProps, LightboxPropTypes, Node } from "./types.js";
import {
    CarouselModule,
    ControllerModule,
    CoreModule,
    createNode,
    NavigationModule,
    NoScrollModule,
    PortalModule,
    ToolbarModule,
    withPlugins,
} from "./core/index.js";

const renderNode = (node: Node, props: LightboxProps): React.ReactElement =>
    React.createElement(
        node.module.component,
        { key: node.module.name, ...props },
        node.children?.map((child) => renderNode(child, props))
    );

const LightboxComponent = (props: LightboxProps & typeof LightboxDefaultProps) => {
    const { plugins } = props;

    const { config, augmentation } = withPlugins(
        [
            createNode(PortalModule, [
                createNode(NoScrollModule, [
                    createNode(ControllerModule, [
                        createNode(CarouselModule),
                        createNode(ToolbarModule),
                        createNode(NavigationModule),
                    ]),
                ]),
            ]),
        ],
        plugins
    );

    const augmentedProps = augmentation(props);

    if (!augmentedProps.open) return null;

    return <>{renderNode(createNode(CoreModule, config), augmentedProps)}</>;
};

LightboxComponent.propTypes = LightboxPropTypes;
LightboxComponent.defaultProps = LightboxDefaultProps;

type ComponentProps<T> = T extends React.ComponentType<infer P> | React.Component<infer P>
    ? JSX.LibraryManagedAttributes<T, P>
    : never;

type MakePartial<T> = T extends object ? Partial<T> : T;

type NestedPartial<T extends object> = {
    [P in keyof T]?: MakePartial<T[P]>;
};

type NestedOptional<T, K extends keyof T> = Omit<T, K> & NestedPartial<Pick<T, K>>;

export const Lightbox = (
    props: NestedOptional<ComponentProps<typeof LightboxComponent>, "carousel" | "animation" | "render">
) => {
    const { carousel, animation, render, ...restProps } = props;
    const {
        carousel: defaultCarousel,
        animation: defaultAnimation,
        render: defaultRender,
        ...restDefaultProps
    } = LightboxDefaultProps;

    return (
        <LightboxComponent
            carousel={{ ...defaultCarousel, ...carousel }}
            animation={{ ...defaultAnimation, ...animation }}
            render={{ ...defaultRender, ...render }}
            {...restDefaultProps}
            {...restProps}
        />
    );
};
