import * as React from "react";

import { PluginProps, addToolbarButton, createModule, PLUGIN_CAPTIONS } from "../../index.js";
import { Title } from "./Title.js";
import { Description } from "./Description.js";
import { CaptionsButton } from "./CaptionsButton.js";
import { CaptionsContextProvider } from "./CaptionsContext.js";
import { resolveCaptionsProps } from "./props.js";

/** Captions plugin */
export function Captions({ augment, addModule }: PluginProps) {
  augment(
    ({ captions: captionsProps, render: { slideFooter: renderFooter, ...restRender }, toolbar, ...restProps }) => {
      const captions = resolveCaptionsProps(captionsProps);
      return {
        render: {
          slideFooter: ({ slide }) => (
            <>
              {renderFooter?.({ slide })}

              {slide.title && <Title title={slide.title} />}

              {slide.description && <Description description={slide.description} />}
            </>
          ),
          ...restRender,
        },
        toolbar: addToolbarButton(toolbar, PLUGIN_CAPTIONS, captions.showToggle ? <CaptionsButton /> : null),
        captions,
        ...restProps,
      };
    },
  );

  addModule(createModule(PLUGIN_CAPTIONS, CaptionsContextProvider));
}
