import { LightboxProps } from "../../index.js";

export const defaultShareProps = {
  share: undefined,
};

export const resolveShareProps = (share: LightboxProps["share"]) => ({
  ...defaultShareProps,
  ...share,
});
