import { useController } from "../../core/index.js";
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
    const { video } = useController().getLightboxProps();
    return resolveVideoProps(video);
}
