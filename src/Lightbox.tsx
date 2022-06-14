import * as React from "react";

import { LightboxDefaultProps, LightboxExternalProps, LightboxProps, Node } from "./types.js";
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

const LightboxComponent: React.FC<LightboxProps> = (props) => {
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

/** Lightbox component */
export const Lightbox: React.FC<LightboxExternalProps> = (props) => {
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
