import * as React from "react";

import { Inline } from "./Inline.js";

declare module "../../types.js" {
    interface LightboxProps {
        /** HTML div element attributes to be passed to the Inline plugin container */
        inline?: React.HTMLAttributes<HTMLDivElement>;
    }
}

export default Inline;
