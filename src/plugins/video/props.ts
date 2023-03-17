import { useLightboxProps } from "../../core/index.js";
import { LightboxProps } from "../../types.js";

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
