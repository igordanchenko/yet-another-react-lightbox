import * as React from "react";

import {
  CaptionsRef,
  FullscreenRef,
  ImageSlide,
  isImageSlide,
  Lightbox,
  SlideshowRef,
  ThumbnailsRef,
  ZoomRef,
} from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Download from "yet-another-react-lightbox/plugins/download";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Inline from "yet-another-react-lightbox/plugins/inline";
import Share from "yet-another-react-lightbox/plugins/share";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Video from "yet-another-react-lightbox/plugins/video";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/counter.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const slides = [
  {
    src: "https://yet-another-react-lightbox.com/images/image01.jpeg",
    title: "Title",
    description: "Description",
    download: {
      url: "https://yet-another-react-lightbox.com/images/image01.jpeg",
      filename: "image01.jpeg",
    },
    share: {
      url: "https://yet-another-react-lightbox.com/images/image01.jpeg",
      text: "text",
      title: "title",
    },
  },
];

function log(...values: unknown[]) {
  // eslint-disable-next-line no-console
  console.log(...values);
}

export default function App() {
  const [open, setOpen] = React.useState(false);

  const captionsRef = React.useRef<CaptionsRef>(null);
  const fullscreenRef = React.useRef<FullscreenRef>(null);
  const slideshowRef = React.useRef<SlideshowRef>(null);
  const thumbnailsRef = React.useRef<ThumbnailsRef>(null);
  const zoomRef = React.useRef<ZoomRef>(null);

  return (
    <main>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        plugins={[Captions, Counter, Download, Fullscreen, Share, Slideshow, Thumbnails, Video, Zoom]}
        captions={{
          ref: captionsRef,
          hidden: true,
          showToggle: true,
          descriptionMaxLines: 3,
          descriptionTextAlign: "start",
        }}
        counter={{ separator: "of" }}
        download={{
          download: ({ slide, saveAs }) => {
            log("download", slide, saveAs);
          },
        }}
        fullscreen={{ ref: fullscreenRef }}
        share={{
          share: ({ slide }) => {
            log("share", slide);
          },
        }}
        slideshow={{ ref: slideshowRef, autoplay: false, delay: 5000 }}
        thumbnails={{
          ref: thumbnailsRef,
          width: 120,
          height: 80,
          position: "bottom",
          border: 1,
          borderColor: "blue",
          borderStyle: "dashed",
          borderRadius: 4,
          padding: 4,
          gap: 16,
          imageFit: "contain",
          vignette: true,
          hidden: true,
          showToggle: true,
        }}
        video={{
          autoPlay: false,
          playsInline: true,
        }}
        zoom={{
          ref: zoomRef,
          maxZoomPixelRatio: 1,
          zoomInMultiplier: 2,
          doubleTapDelay: 300,
          doubleClickDelay: 500,
          doubleClickMaxStops: 2,
          keyboardMoveDistance: 50,
          wheelZoomDistanceFactor: 100,
          pinchZoomDistanceFactor: 100,
          scrollToZoom: false,
        }}
        toolbar={{
          buttons: [
            <button key="custom" type="button" className="yarl__button">
              Custom
            </button>,
            "close",
          ],
        }}
        carousel={{
          finite: false,
          preload: 2,
          padding: "16px",
          spacing: "30%",
          imageFit: "contain",
        }}
        animation={{
          fade: 250,
          swipe: 500,
          easing: { fade: "ease", swipe: "ease-out", navigation: "ease-in-out" },
        }}
        render={{
          buttonCaptions: ({ visible, show, hide }) => (
            <button type="button" className="yarl__button" onClick={() => (visible ? hide : show)?.()}>
              Captions
            </button>
          ),
          iconCaptionsHidden: () => null,
          iconCaptionsVisible: () => null,
          iconDownload: () => null,
          buttonDownload: () => (
            <button type="button" className="yarl__button">
              Download
            </button>
          ),
          buttonFullscreen: ({ fullscreen, disabled, enter, exit }) => (
            <button
              type="button"
              className="yarl__button"
              disabled={disabled}
              onClick={() => (fullscreen ? exit : enter)?.()}
            >
              Fullscreen
            </button>
          ),
          iconEnterFullscreen: () => null,
          iconExitFullscreen: () => null,
          buttonShare: () => (
            <button type="button" className="yarl__button">
              Share
            </button>
          ),
          iconShare: () => null,
          buttonSlideshow: ({ playing, disabled, play, pause }) => (
            <button
              type="button"
              className="yarl__button"
              disabled={disabled}
              onClick={() => (playing ? pause : play)()}
            >
              Slideshow
            </button>
          ),
          iconSlideshowPlay: () => null,
          iconSlideshowPause: () => null,
          thumbnail: ({ slide, rect, render, imageFit }) =>
            isImageSlide(slide) ? (
              <ImageSlide slide={slide} rect={rect} render={render} imageFit={imageFit} />
            ) : undefined,
          iconThumbnailsVisible: () => null,
          iconThumbnailsHidden: () => null,
          buttonThumbnails: ({ visible, show, hide }) => (
            <button type="button" className="yarl__button" onClick={() => (visible ? hide : show)()}>
              Thumbnails
            </button>
          ),
        }}
        on={{
          view: ({ index }) => log("view", index),
          click: ({ index }) => {
            log("click", index);

            const captions = captionsRef.current!;
            (captions.visible ? captions.hide : captions.show)?.();

            const fullscreen = fullscreenRef.current!;
            (fullscreen.fullscreen ? fullscreen.exit : fullscreen.enter)?.();

            const slideshow = slideshowRef.current!;
            (slideshow.playing ? slideshow.pause : slideshow.play)?.();

            const thumbnails = thumbnailsRef.current!;
            (thumbnails.visible ? thumbnails.hide : thumbnails.show)?.();

            const zoom = zoomRef.current!;
            if (zoom.zoom < zoom.maxZoom) {
              zoom.zoomIn();
              zoom.zoomOut();
            }
          },
          download: ({ index }) => log("download", index),
          share: ({ index }) => log("share", index),
          slideshowStart: () => {},
          slideshowStop: () => {},
          zoom: ({ zoom }) => log("zoom", zoom),
        }}
        styles={{
          captionsTitle: { color: "blue" },
          captionsTitleContainer: { top: "10px" },
          captionsDescription: { color: "red" },
          captionsDescriptionContainer: { bottom: "10px" },
          thumbnail: { borderColor: "#eee" },
          thumbnailsTrack: { borderColor: "#eee" },
          thumbnailsContainer: { borderColor: "#eee" },
        }}
      />

      <button type="button" onClick={() => setOpen(true)} style={{ display: "block", margin: "20px auto" }}>
        Open Lightbox
      </button>

      <div style={{ maxWidth: 600, margin: "20px auto" }}>
        <Lightbox slides={slides} plugins={[Inline]} inline={{ style: { aspectRatio: "3 / 2" } }} />
      </div>
    </main>
  );
}
