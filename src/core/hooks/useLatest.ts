import * as React from "react";

export const useLatest = <T>(value: T) => {
    const ref = React.useRef(value);
    ref.current = value;
    return ref;
};
