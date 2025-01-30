/*
 * Modified version of FileSaver.js
 * https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js
 */

function download(url: string, name?: string) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.responseType = "blob";
  xhr.onload = () => {
    saveAs(xhr.response, name);
  };
  xhr.onerror = () => {
    // eslint-disable-next-line no-console
    console.error("Failed to download file");
  };
  xhr.send();
}

function corsEnabled(url: string) {
  const xhr = new XMLHttpRequest();
  xhr.open("HEAD", url, false);
  try {
    xhr.send();
  } catch (_) {
    //
  }
  return xhr.status >= 200 && xhr.status <= 299;
}

function click(link: HTMLAnchorElement) {
  try {
    link.dispatchEvent(new MouseEvent("click"));
  } catch (_) {
    const event = document.createEvent("MouseEvents");
    event.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
    link.dispatchEvent(event);
  }
}

export function saveAs(source: string | Blob, name?: string) {
  const link = document.createElement("a");
  link.rel = "noopener";

  link.download = name || "";
  if (!link.download) {
    link.target = "_blank";
  }

  if (typeof source === "string") {
    link.href = source;
    if (link.origin !== window.location.origin) {
      if (corsEnabled(link.href)) {
        download(source, name);
      } else {
        link.target = "_blank";
        click(link);
      }
    } else {
      click(link);
    }
  } else {
    link.href = URL.createObjectURL(source);
    setTimeout(() => URL.revokeObjectURL(link.href), 30_000);
    setTimeout(() => click(link), 0);
  }
}
