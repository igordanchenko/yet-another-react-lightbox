import * as React from "react";
import { useDocumentContext } from "../contexts";
import { useEventCallback } from "./useEventCallback";

export function useFocusWithin<T extends HTMLElement | null>(ref: React.RefObject<T>) {
  const { getOwnerDocument } = useDocumentContext();

  const [isFocusWithin, setIsFocusWithin] = React.useState(false);

  const handleFocusIn = React.useCallback(
    (event: FocusEvent) => {
      if (ref.current && ref.current.contains(event.target as Node)) {
        setIsFocusWithin(true);
      }
    },
    [ref, setIsFocusWithin],
  );

  const handleFocusOut = React.useCallback(
    (event: FocusEvent) => {
      if (ref.current && !ref.current.contains(event.relatedTarget as Node)) {
        setIsFocusWithin(false);
      }
    },
    [ref, setIsFocusWithin],
  );

  const onMount = useEventCallback(() => {
    setIsFocusWithin(ref.current && ref.current.contains(getOwnerDocument().activeElement));
  });

  React.useEffect(onMount, [onMount]);

  React.useEffect(() => {
    getOwnerDocument().addEventListener("focusin", handleFocusIn);
    getOwnerDocument().addEventListener("focusout", handleFocusOut);

    return () => {
      getOwnerDocument().removeEventListener("focusin", handleFocusIn);
      getOwnerDocument().removeEventListener("focusout", handleFocusOut);
    };
  }, [handleFocusIn, handleFocusOut, getOwnerDocument]);

  return { isFocusWithin };
}
