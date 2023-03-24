import { Counter } from "./Counter.js";

declare module "../../types.js" {
    interface LightboxProps {
        /** HTML div element attributes to be passed to the Counter plugin container */
        counter?: React.HTMLAttributes<HTMLDivElement>;
    }
}

export default Counter;
