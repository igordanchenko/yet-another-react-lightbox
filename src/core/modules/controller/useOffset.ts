import * as React from "react";

import { useEventCallback } from "../../hooks/useEventCallback.js";

export const useOffset = (
    onChange: (offset: number) => void
): [number, React.Dispatch<React.SetStateAction<number>>] => {
    const [offset, setOffset] = React.useState(0);

    const handleOnChange = useEventCallback(() => {
        onChange(offset);
    });

    React.useEffect(handleOnChange, [offset, handleOnChange]);

    return [offset, setOffset];
};
