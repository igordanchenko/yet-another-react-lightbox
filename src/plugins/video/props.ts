import { LightboxProps, useLightboxProps } from "../../index.js";

export const defaultVideoProps = {
  controls: true,
  playsInline: true,
};

export const resolveVideoProps = (video: LightboxProps["video"]) => ({
  ...defaultVideoProps,
  ...video,
});

export function useVideoProps() {
  const { video } = useLightboxProps();
  return resolveVideoProps(video);
}
