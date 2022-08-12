import * as React from "react";

export const setRef = <T>(
    ref: React.MutableRefObject<T | null> | ((instance: T | null) => void) | null | undefined,
    value: T | null
): void => {
    if (typeof ref === "function") {
        ref(value);
    } else if (ref) {
        ref.current = value;
    }
};

export const useForkRef = <InstanceA, InstanceB>(
    refA: React.Ref<InstanceA> | null | undefined,
    refB: React.Ref<InstanceB> | null | undefined
): React.Ref<InstanceA & InstanceB> | null =>
    React.useMemo(
        () =>
            refA == null && refB == null
                ? null
                : (refValue) => {
                      setRef(refA, refValue);
                      setRef(refB, refValue);
                  },
        [refA, refB]
    );
