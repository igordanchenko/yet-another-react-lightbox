export function isChromium() {
  return (
    (navigator as { userAgentData?: { brands: { brand: string }[] } }).userAgentData?.brands.some(
      ({ brand }) => brand === "Chromium",
    ) || !!(window as { chrome?: unknown }).chrome
  );
}

export function isWebKit() {
  return /^((?!chrome|android).)*(safari|mobile)/i.test(navigator.userAgent);
}
