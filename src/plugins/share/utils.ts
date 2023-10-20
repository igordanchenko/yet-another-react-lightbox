export function isShareSupported() {
  return typeof navigator !== "undefined" && Boolean(navigator.canShare);
}
