import { LightboxProps } from "../../index.js";

export const defaultDownloadProps = {
  download: undefined,
};

export const resolveDownloadProps = (download: LightboxProps["download"]) => ({
  ...defaultDownloadProps,
  ...download,
});
