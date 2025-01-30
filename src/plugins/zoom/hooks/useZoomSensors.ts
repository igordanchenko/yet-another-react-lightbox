import * as React from "react";

import {
  cleanup,
  EVENT_ON_KEY_DOWN,
  EVENT_ON_WHEEL,
  useController,
  useDocumentContext,
  useEventCallback,
  useLightboxState,
} from "../../../index.js";
import { useZoomProps } from "./useZoomProps.js";
import { useZoomState } from "./useZoomState.js";
import { usePointerEvents } from "../../../hooks/usePointerEvents.js";

function distance(pointerA: React.MouseEvent, pointerB: React.MouseEvent) {
  return ((pointerA.clientX - pointerB.clientX) ** 2 + (pointerA.clientY - pointerB.clientY) ** 2) ** 0.5;
}

function scaleZoom(value: number, delta: number, factor = 100, clamp = 2) {
  return value * Math.min(1 + Math.abs(delta / factor), clamp) ** Math.sign(delta);
}

export function useZoomSensors(
  zoom: number,
  maxZoom: number,
  disabled: boolean,
  changeZoom: ReturnType<typeof useZoomState>["changeZoom"],
  changeOffsets: ReturnType<typeof useZoomState>["changeOffsets"],
  zoomWrapperRef?: React.RefObject<HTMLDivElement | null>,
) {
  const activePointers = React.useRef<React.PointerEvent[]>([]);
  const lastPointerDown = React.useRef(0);
  const pinchZoomDistance = React.useRef<number>(undefined);

  const { globalIndex } = useLightboxState();
  const { getOwnerWindow } = useDocumentContext();
  const { containerRef, subscribeSensors } = useController();
  const {
    keyboardMoveDistance,
    zoomInMultiplier,
    wheelZoomDistanceFactor,
    scrollToZoom,
    doubleTapDelay,
    doubleClickDelay,
    doubleClickMaxStops,
    pinchZoomDistanceFactor,
  } = useZoomProps();

  const translateCoordinates = React.useCallback(
    (event: React.MouseEvent) => {
      if (containerRef.current) {
        const { pageX, pageY } = event;
        const { scrollX, scrollY } = getOwnerWindow();
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        return [pageX - left - scrollX - width / 2, pageY - top - scrollY - height / 2];
      }
      return [];
    },
    [containerRef, getOwnerWindow],
  );

  const onKeyDown = useEventCallback((event: React.KeyboardEvent) => {
    const preventDefault = () => {
      event.preventDefault();
      event.stopPropagation();
    };

    if (zoom > 1) {
      const move = (deltaX: number, deltaY: number) => {
        preventDefault();
        changeOffsets(deltaX, deltaY);
      };

      if (event.key === "ArrowDown") {
        move(0, keyboardMoveDistance);
      } else if (event.key === "ArrowUp") {
        move(0, -keyboardMoveDistance);
      } else if (event.key === "ArrowLeft") {
        move(-keyboardMoveDistance, 0);
      } else if (event.key === "ArrowRight") {
        move(keyboardMoveDistance, 0);
      }
    }

    const handleChangeZoom = (zoomValue: number) => {
      preventDefault();
      changeZoom(zoomValue);
    };

    const hasMeta = () => event.getModifierState("Meta");

    if (event.key === "+" || (event.key === "=" && hasMeta())) {
      handleChangeZoom(zoom * zoomInMultiplier);
    } else if (event.key === "-" || (event.key === "_" && hasMeta())) {
      handleChangeZoom(zoom / zoomInMultiplier);
    } else if (event.key === "0" && hasMeta()) {
      handleChangeZoom(1);
    }
  });

  const onWheel = useEventCallback((event: React.WheelEvent) => {
    if (event.ctrlKey || scrollToZoom) {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        event.stopPropagation();

        changeZoom(scaleZoom(zoom, -event.deltaY, wheelZoomDistanceFactor), true, ...translateCoordinates(event));

        return;
      }
    }

    if (zoom > 1) {
      event.stopPropagation();

      if (!scrollToZoom) {
        changeOffsets(event.deltaX, event.deltaY);
      }
    }
  });

  const clearPointer = React.useCallback((event: React.PointerEvent) => {
    const pointers = activePointers.current;
    pointers.splice(0, pointers.length, ...pointers.filter((p) => p.pointerId !== event.pointerId));
  }, []);

  const replacePointer = React.useCallback(
    (event: React.PointerEvent) => {
      clearPointer(event);
      event.persist();
      activePointers.current.push(event);
    },
    [clearPointer],
  );

  const onPointerDown = useEventCallback((event: React.PointerEvent) => {
    const pointers = activePointers.current;

    if (
      // ignore right button clicks (e.g., context menu)
      (event.pointerType === "mouse" && event.buttons > 1) ||
      // ignore clicks outside current slide (zoom icons, navigation buttons, etc.)
      !zoomWrapperRef?.current?.contains(event.target as unknown as Element)
    ) {
      return;
    }

    if (zoom > 1) {
      event.stopPropagation();
    }

    const { timeStamp } = event;
    if (
      pointers.length === 0 &&
      timeStamp - lastPointerDown.current < (event.pointerType === "touch" ? doubleTapDelay : doubleClickDelay)
    ) {
      lastPointerDown.current = 0;
      changeZoom(
        zoom !== maxZoom ? zoom * Math.max(maxZoom ** (1 / doubleClickMaxStops), zoomInMultiplier) : 1,
        false,
        ...translateCoordinates(event),
      );
    } else {
      lastPointerDown.current = timeStamp;
    }

    replacePointer(event);

    if (pointers.length === 2) {
      pinchZoomDistance.current = distance(pointers[0], pointers[1]);
    }
  });

  const onPointerMove = useEventCallback((event: React.PointerEvent) => {
    const pointers = activePointers.current;

    const activePointer = pointers.find((p) => p.pointerId === event.pointerId);

    if (pointers.length === 2 && pinchZoomDistance.current) {
      event.stopPropagation();

      replacePointer(event);

      const currentDistance = distance(pointers[0], pointers[1]);
      const delta = currentDistance - pinchZoomDistance.current;

      if (Math.abs(delta) > 0) {
        changeZoom(
          scaleZoom(zoom, delta, pinchZoomDistanceFactor),
          true,
          ...pointers
            .map((x) => translateCoordinates(x))
            .reduce((acc, coordinate) => coordinate.map((x, i) => acc[i] + x / 2)),
        );

        pinchZoomDistance.current = currentDistance;
      }

      return;
    }

    if (zoom > 1) {
      event.stopPropagation();

      if (activePointer) {
        if (pointers.length === 1) {
          changeOffsets((activePointer.clientX - event.clientX) / zoom, (activePointer.clientY - event.clientY) / zoom);
        }

        replacePointer(event);
      }
    }
  });

  const onPointerUp = React.useCallback(
    (event: React.PointerEvent) => {
      const pointers = activePointers.current;

      if (pointers.length === 2 && pointers.find((p) => p.pointerId === event.pointerId)) {
        pinchZoomDistance.current = undefined;
      }

      clearPointer(event);
    },
    [clearPointer],
  );

  const cleanupSensors = React.useCallback(() => {
    const pointers = activePointers.current;
    pointers.splice(0, pointers.length);

    lastPointerDown.current = 0;
    pinchZoomDistance.current = undefined;
  }, []);

  usePointerEvents(subscribeSensors, onPointerDown, onPointerMove, onPointerUp, disabled);

  React.useEffect(cleanupSensors, [globalIndex, cleanupSensors]);

  React.useEffect(() => {
    if (!disabled) {
      return cleanup(
        cleanupSensors,
        subscribeSensors(EVENT_ON_KEY_DOWN, onKeyDown),
        subscribeSensors(EVENT_ON_WHEEL, onWheel),
      );
    }
    return () => {};
  }, [disabled, subscribeSensors, cleanupSensors, onKeyDown, onWheel]);
}
