import * as React from "react";

import { Counter } from "./Counter.js";

declare module "../../types.js" {
  interface LightboxProps {
    // TODO v4: remove html attributes from `counter` prop
    /** Counter plugin settings */
    counter?: React.HTMLAttributes<HTMLDivElement> & {
      /** custom separator */
      separator?: string;
      /** counter container HTML attributes */
      container?: React.HTMLAttributes<HTMLDivElement>;
    };
  }
}

export default Counter;
