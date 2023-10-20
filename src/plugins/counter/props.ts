import { LightboxProps } from "../../index.js";

export const defaultCounterProps = {
  separator: "/",
  container: {},
} as Required<NonNullable<LightboxProps["counter"]>>;

export const resolveCounterProps = (counter: LightboxProps["counter"]) => ({
  ...defaultCounterProps,
  ...counter,
});
