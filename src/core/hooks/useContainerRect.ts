import * as React from "react";

export type ContainerRect = {
    width: number;
    height: number;
};

export const useContainerRect = <T extends HTMLElement = HTMLElement>() => {
    const [containerRect, setContainerRect] = React.useState<ContainerRect>();
    const containerRef = React.useRef<T | null>(null);
    const observerRef = React.useRef<ResizeObserver>();

    const setContainerRef = React.useCallback((node: T | null) => {
        containerRef.current = node;

        if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = undefined;
        }

        const updateContainerRect = () => {
            const width = node?.clientWidth;
            const height = node?.clientHeight;

            setContainerRect(
                width !== undefined && height !== undefined
                    ? {
                          width,
                          height,
                      }
                    : undefined
            );
        };

        updateContainerRect();

        if (node && typeof ResizeObserver !== "undefined") {
            observerRef.current = new ResizeObserver(updateContainerRect);
            observerRef.current.observe(node);
        }
    }, []);

    return React.useMemo(
        () => ({
            setContainerRef,
            containerRef,
            containerRect,
        }),
        [setContainerRef, containerRef, containerRect]
    );
};
