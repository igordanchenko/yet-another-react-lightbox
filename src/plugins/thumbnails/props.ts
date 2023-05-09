import { LightboxProps, useLightboxProps } from "../../index.js";

export const defaultThumbnailsProps = {
    ref: null,
    position: "bottom" as const,
    width: 120,
    height: 80,
    border: 1,
    borderRadius: 4,
    padding: 4,
    gap: 16,
    imageFit: "contain" as const,
    vignette: true,
};

export const resolveThumbnailsProps = (thumbnails: LightboxProps["thumbnails"]) => ({
    ...defaultThumbnailsProps,
    ...thumbnails,
});

export function useThumbnailsProps() {
    const { thumbnails } = useLightboxProps();
    return resolveThumbnailsProps(thumbnails);
}
