import { cssClass } from "../../core/index.js";

export function cssPrefix(className: string) {
    return cssClass(`slide_${className}`);
}
