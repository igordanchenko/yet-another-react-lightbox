import { LightboxProps } from "../../types.js";

export const defaultShareProps = {
    share: undefined,
};

export const resolveShareProps = (share: LightboxProps["share"]) => ({
    ...defaultShareProps,
    ...share,
});
