import * as React from "react";

import { hasWindow } from "../utils.js";

export const useEnhancedEffect = hasWindow() ? React.useLayoutEffect : React.useEffect;
