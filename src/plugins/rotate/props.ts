import { LightboxProps, useLightboxProps } from "../../index.js";

export const defaultRotateProps = {
  ref: null,
  buttons: "both" as const,
};

export function resolveRotateProps(rotate: LightboxProps["rotate"]) {
  return { ...defaultRotateProps, ...rotate };
}

export function useRotateProps() {
  const { rotate } = useLightboxProps();
  return resolveRotateProps(rotate);
}
