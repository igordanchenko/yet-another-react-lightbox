import * as React from "react";

import { clsx, ComponentProps, cssClass, LightboxPropsProvider, makeUseContext, type Callback } from "../../index.js";
import { FilmstripTrack } from "./FilmstripTrack.js";
import { resolveFilmstripProps } from "./props.js";
import { cssFilmstripPrefix } from "./utils.js";

export interface FilmstripRef {
  visible: boolean;
  show: Callback;
  hide: Callback;
}

export const FilmstripContext = React.createContext<FilmstripRef | null>(null);

export const useFilmstrip = makeUseContext("useFilmstrip", "FilmstripContext", FilmstripContext);

/** Filmstrip plugin component */
export function FilmstripContextProvider({ children, ...props }: ComponentProps) {
  const { ref, position, hidden } = resolveFilmstripProps(props.filmstrip);

  const [visible, setVisible] = React.useState(!hidden);

  const context = React.useMemo(
    () => ({
      visible,
      show: () => setVisible(true),
      hide: () => setVisible(false),
    }),
    [visible],
  );

  React.useImperativeHandle(ref, () => context, [context]);

  return (
    <LightboxPropsProvider {...props}>
      <FilmstripContext.Provider value={context}>
        <div className={clsx(cssClass(cssFilmstripPrefix()), cssClass(cssFilmstripPrefix(`${position}`)))}>
          {["start", "top"].includes(position) && <FilmstripTrack visible={visible} />}
          <div className={cssClass(cssFilmstripPrefix("wrapper"))}>{children}</div>
          {["end", "bottom"].includes(position) && <FilmstripTrack visible={visible} />}
        </div>
      </FilmstripContext.Provider>
    </LightboxPropsProvider>
  );
}
