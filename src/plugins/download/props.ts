import { LightboxProps } from "../../types.js";

export const defaultDownloadProps = {
    download: undefined,
};

export const resolveDownloadProps = (download: LightboxProps["download"]) => ({
    ...defaultDownloadProps,
    ...download,
});
