import * as React from "react";

import {
  addToolbarButton,
  createModule,
  MODULE_CONTROLLER,
  PLUGIN_FILMSTRIP,
  PLUGIN_FULLSCREEN,
  PluginProps,
} from "../../index.js";
import { FilmstripContextProvider } from "./FilmstripContext.js";
import { FilmstripButton } from "./FilmstripButton.js";
import { resolveFilmstripProps } from "./props.js";

/** Filmstrip plugin */
export function Filmstrip({ augment, contains, append, addParent }: PluginProps) {
  augment(({ filmstrip: fp, toolbar, ...rest }) => {
    const f = resolveFilmstripProps(fp);
    return {
      filmstrip: f,
      toolbar: addToolbarButton(toolbar, PLUGIN_FILMSTRIP, f.showToggle ? <FilmstripButton /> : null),
      ...rest,
    };
  });

  const module = createModule(PLUGIN_FILMSTRIP, FilmstripContextProvider);
  if (contains(PLUGIN_FULLSCREEN)) {
    append(PLUGIN_FULLSCREEN, module);
  } else {
    addParent(MODULE_CONTROLLER, module);
  }
}
