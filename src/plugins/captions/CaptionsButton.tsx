import * as React from "react";

import { createIcon, createIconDisabled, IconButton, useLightboxProps } from "../../index.js";
import { useCaptions } from "./CaptionsContext.js";

const captionsIcon = () => (
  <>
    <path strokeWidth={2} stroke="currentColor" strokeLinejoin="round" fill="none" d="M3 5l18 0l0 14l-18 0l0-14z" />
    <path d="M7 15h3c.55 0 1-.45 1-1v-1H9.5v.5h-2v-3h2v.5H11v-1c0-.55-.45-1-1-1H7c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm7 0h3c.55 0 1-.45 1-1v-1h-1.5v.5h-2v-3h2v.5H18v-1c0-.55-.45-1-1-1h-3c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1z" />
  </>
);

const CaptionsVisible = createIcon("CaptionsVisible", captionsIcon());

const CaptionsHidden = createIconDisabled("CaptionsVisible", captionsIcon());

export function CaptionsButton() {
  const { visible, show, hide } = useCaptions();
  const { render } = useLightboxProps();

  if (render.buttonCaptions) {
    return <>{render.buttonCaptions({ visible, show, hide })}</>;
  }

  return (
    <IconButton
      label={visible ? "Hide captions" : "Show captions"}
      icon={visible ? CaptionsVisible : CaptionsHidden}
      renderIcon={visible ? render.iconCaptionsVisible : render.iconCaptionsHidden}
      onClick={visible ? hide : show}
    />
  );
}
