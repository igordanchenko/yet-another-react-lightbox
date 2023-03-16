import { LightboxProps } from "../../types.js";

export const defaultThumbnailsProps = {
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
