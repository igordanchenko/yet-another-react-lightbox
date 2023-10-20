import { LightboxProps } from "../../index.js";

export const defaultSlideshowProps = {
  autoplay: false,
  delay: 3000,
  ref: null,
};

export const resolveSlideshowProps = (slideshow: LightboxProps["slideshow"]) => ({
  ...defaultSlideshowProps,
  ...slideshow,
});
