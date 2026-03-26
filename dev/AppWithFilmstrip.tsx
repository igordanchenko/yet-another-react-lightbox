/* To test the filmstrip plugin, replace the import of App.js with AppWithFilmstrip.js in index.tsx */

import * as React from "react";

import Lightbox from "../src/index.js";
import Counter from "../src/plugins/counter/index.js";
import Captions from "../src/plugins/captions/index.js";
import Download from "../src/plugins/download/index.js";
import Fullscreen from "../src/plugins/fullscreen/index.js";
import Share from "../src/plugins/share/index.js";
import Slideshow from "../src/plugins/slideshow/index.js";
import Filmstrip from "../src/plugins/filmstrip/index.js";
import Video from "../src/plugins/video/index.js";
import Zoom from "../src/plugins/zoom/index.js";

import "../src/styles.scss";
import "../src/plugins/counter/counter.scss";
import "../src/plugins/captions/captions.scss";
import "../src/plugins/filmstrip/filmstrip.scss";

import slides from "./slides.js";

type Example = {
  id: string;
  title: string;
  slides?: React.ComponentProps<typeof Lightbox>["slides"];
  carousel?: { finite?: boolean; preload?: number };
  filmstrip?: NonNullable<React.ComponentProps<typeof Lightbox>["filmstrip"]>;
};

const EXAMPLES: Example[] = [
  {
    id: "default",
    title: "Default",
  },
  {
    id: "finite",
    title: "Finite carousel",
    carousel: { finite: true },
  },
  {
    id: "single-slide-default-viewport",
    title: "Single slide, default filmstrip viewport",
    slides: slides.slice(0, 1),
  },
  {
    id: "preload-2-viewport-full",
    title: "Many slides, full-width filmstrip viewport",
    carousel: { preload: 2 },
    filmstrip: { scrollViewportMax: "full" },
  },
  {
    id: "start",
    title: "Vertical rail on the start edge",
    filmstrip: { position: "start" },
  },
  {
    id: "hidden-start",
    title: "Hidden until the user shows it",
    filmstrip: { hidden: true, showToggle: true },
  },
  {
    id: "hide-scrollbar",
    title: "Hide scrollbar",
    filmstrip: { hideScrollbar: true },
  },
  {
    id: "styling",
    title: "Styling the filmstrip",
    filmstrip: {
      width: 72,
      height: 48,
      gap: 8,
      padding: 2,
      border: 2,
      borderRadius: 8,
      borderStyle: "dashed",
      borderColor: "rgba(147, 197, 253, 0.95)",
    },
  },
];

export default function AppWithFilmstrip() {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const active = openId ? EXAMPLES.find((e) => e.id === openId) : undefined;

  const labelsForExample =
    active?.id === "labels"
      ? {
          Filmstrip: "Slide filmstrip",
          "Show filmstrip": "Reveal filmstrip",
          "Hide filmstrip": "Hide filmstrip",
        }
      : undefined;

  return (
    <div className="dev-filmstrip">
      <h1 className="dev-filmstrip-heading">Filmstrip examples</h1>

      <div className="dev-filmstrip-examples">
        {EXAMPLES.map((ex) => (
          <section key={ex.id} className="dev-filmstrip-example">
            <h2 className="dev-filmstrip-example-title">{ex.title}</h2>
            <button type="button" className="button" aria-haspopup="dialog" onClick={() => setOpenId(ex.id)}>
              Open this example
            </button>
          </section>
        ))}
      </div>

      {active && (
        <Lightbox
          key={active.id}
          open
          close={() => setOpenId(null)}
          slides={active.slides ?? slides}
          carousel={active.carousel ?? {}}
          filmstrip={active.filmstrip ?? {}}
          labels={labelsForExample}
          plugins={[Captions, Counter, Download, Share, Fullscreen, Slideshow, Filmstrip, Video, Zoom]}
        />
      )}
    </div>
  );
}
