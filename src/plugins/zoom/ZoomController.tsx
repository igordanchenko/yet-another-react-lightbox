import * as React from "react";

import { ComponentProps, ContainerRect, ZoomRef } from "../../types.js";
import { makeUseContext, useController } from "../../core/index.js";
import { useZoomCallback, useZoomImageRect, useZoomProps, useZoomSensors, useZoomState } from "./hooks/index.js";

export type ActiveZoomWrapper = {
    zoomWrapperRef: React.RefObject<HTMLDivElement>;
    imageDimensions?: ContainerRect;
};

export type ZoomControllerContextType = ZoomRef & {
    setZoomWrapper: React.Dispatch<React.SetStateAction<ActiveZoomWrapper | undefined>>;
};

export const ZoomControllerContext = React.createContext<ZoomControllerContextType | null>(null);

export const useZoom = makeUseContext("useZoom", "ZoomControllerContext", ZoomControllerContext);

export function ZoomContextProvider({ children }: ComponentProps) {
    const [zoomWrapper, setZoomWrapper] = React.useState<ActiveZoomWrapper>();

    const { imageRect, maxZoom } = useZoomImageRect(useController().slideRect, zoomWrapper?.imageDimensions);

    const { zoom, offsetX, offsetY, disabled, changeZoom, changeOffsets, zoomIn, zoomOut } = useZoomState(
        imageRect,
        maxZoom,
        zoomWrapper?.zoomWrapperRef
    );

    useZoomCallback(zoom, disabled);

    useZoomSensors(zoom, maxZoom, disabled, changeZoom, changeOffsets, zoomWrapper?.zoomWrapperRef);

    const zoomRef = React.useMemo(
        () => ({ zoom, maxZoom, offsetX, offsetY, disabled, zoomIn, zoomOut }),
        [zoom, maxZoom, offsetX, offsetY, disabled, zoomIn, zoomOut]
    );

    React.useImperativeHandle(useZoomProps().ref, () => zoomRef, [zoomRef]);

    const context = React.useMemo(() => ({ ...zoomRef, setZoomWrapper }), [zoomRef, setZoomWrapper]);

    return <ZoomControllerContext.Provider value={context}>{children}</ZoomControllerContext.Provider>;
}
