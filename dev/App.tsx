import * as React from "react";

import Lightbox from "../src/index.js";
import Counter from "../src/plugins/counter/index.js";
import Captions from "../src/plugins/captions/index.js";
import Download from "../src/plugins/download/index.js";
import Fullscreen from "../src/plugins/fullscreen/index.js";
import Share from "../src/plugins/share/index.js";
import Slideshow from "../src/plugins/slideshow/index.js";
import Thumbnails from "../src/plugins/thumbnails/index.js";
import Video from "../src/plugins/video/index.js";
import Zoom from "../src/plugins/zoom/index.js";

import "../src/styles.scss";
import "../src/plugins/counter/counter.scss";
import "../src/plugins/captions/captions.scss";
import "../src/plugins/thumbnails/thumbnails.scss";

import slides from "./slides.js";

export default function App() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        plugins={[Captions, Counter, Download, Share, Fullscreen, Slideshow, Thumbnails, Video, Zoom]}
      />

      <button type="button" className="button" onClick={() => setOpen(true)}>
        Open Lightbox
      </button>
    </>
  );
}
