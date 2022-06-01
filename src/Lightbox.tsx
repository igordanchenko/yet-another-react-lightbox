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

const LightboxComponent = (props: LightboxProps) => {
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

type DeepPartial<T, K extends keyof T> = Omit<T, K> & {
    [P in keyof Pick<T, K>]?: Partial<Pick<T, K>[P]>;
};

export const Lightbox = (
    props: DeepPartial<Partial<LightboxProps>, "carousel" | "animation" | "render" | "toolbar" | "controller" | "on">
) => {
    const { carousel, animation, render, toolbar, controller, on, ...restProps } = props;
    const {
        carousel: defaultCarousel,
        animation: defaultAnimation,
        render: defaultRender,
        toolbar: defaultToolbar,
        controller: defaultController,
        on: defaultOn,
        ...restDefaultProps
    } = LightboxDefaultProps;

    return (
        <LightboxComponent
            carousel={{ ...defaultCarousel, ...carousel }}
            animation={{ ...defaultAnimation, ...animation }}
            render={{ ...defaultRender, ...render }}
            toolbar={{ ...defaultToolbar, ...toolbar }}
            controller={{ ...defaultController, ...controller }}
            on={{ ...defaultOn, ...on }}
            {...restDefaultProps}
            {...restProps}
        />
    );
};
