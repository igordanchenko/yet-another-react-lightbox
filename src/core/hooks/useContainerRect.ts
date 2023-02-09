import * as React from "react";

import { ContainerRect } from "../../types.js";

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
            if (node) {
                const styles = window.getComputedStyle(node);

                const parse = (value: string) => parseFloat(value) || 0;

                setContainerRect({
                    width: Math.round(node.clientWidth - parse(styles.paddingLeft) - parse(styles.paddingRight)),
                    height: Math.round(node.clientHeight - parse(styles.paddingTop) - parse(styles.paddingBottom)),
                });
            } else {
                setContainerRect(undefined);
            }
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
