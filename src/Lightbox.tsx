import * as React from "react";

import { ComponentProps, LightboxExternalProps, Node } from "./types.js";
import { LightboxDefaultProps } from "./props.js";
import {
    CarouselModule,
    ControllerModule,
    createNode,
    EventsProvider,
    LightboxStateProvider,
    NavigationModule,
    NoScrollModule,
    PortalModule,
    RootModule,
    TimeoutsProvider,
    ToolbarModule,
    withPlugins,
} from "./core/index.js";

function renderNode(node: Node, props: ComponentProps): React.ReactElement {
    return React.createElement(
        node.module.component,
        { key: node.module.name, ...props },
        node.children?.map((child) => renderNode(child, props))
    );
}

/** Lightbox component */
export function Lightbox(props: LightboxExternalProps) {
    const { carousel, animation, render, toolbar, controller, on, plugins, slides, index, ...restProps } = props;
    const {
        carousel: defaultCarousel,
        animation: defaultAnimation,
        render: defaultRender,
        toolbar: defaultToolbar,
        controller: defaultController,
        on: defaultOn,
        slides: defaultSlides,
        index: defaultIndex,
        plugins: defaultPlugins,
        ...restDefaultProps
    } = LightboxDefaultProps;

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
        plugins || defaultPlugins
    );

    const augmentedProps = augmentation({
        carousel: { ...defaultCarousel, ...carousel },
        animation: { ...defaultAnimation, ...animation },
        render: { ...defaultRender, ...render },
        toolbar: { ...defaultToolbar, ...toolbar },
        controller: { ...defaultController, ...controller },
        on: { ...defaultOn, ...on },
        ...restDefaultProps,
        ...restProps,
    });

    if (!augmentedProps.open) return null;

    return (
        <LightboxStateProvider slides={slides || defaultSlides} index={index || defaultIndex}>
            <TimeoutsProvider>
                <EventsProvider>{renderNode(createNode(RootModule, config), augmentedProps)}</EventsProvider>
            </TimeoutsProvider>
        </LightboxStateProvider>
    );
}
