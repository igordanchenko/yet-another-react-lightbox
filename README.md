# Yet Another React Lightbox

Modern React lightbox component. Performant, easy to use, customizable and extendable.

## Overview

[![NPM Version](https://img.shields.io/npm/v/yet-another-react-lightbox?color=blue)](https://www.npmjs.com/package/yet-another-react-lightbox)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/yet-another-react-lightbox?color=blue)](https://bundlephobia.com/package/yet-another-react-lightbox)
[![License MIT](https://img.shields.io/npm/l/yet-another-react-lightbox?color=blue)](LICENSE)

- **Built for React:** works with React 18, 17 and 16.8.0+
- **UX:** supports keyboard, mouse, touchpad and touchscreen navigation
- **Preloading:** never displays partially downloaded images
- **Performance:** preloads limited number of images without compromising performance or UX
- **Responsive:** responsive images with automatic resolution switching are supported out of the box
- **Video:** video slides are supported via an optional plugin
- **Customization:** customize any UI element or add your own custom slides
- **No bloat:** never bundle rarely used features; add optional features via plugins
- **RTL:** compatible with RTL layout
- **TypeScript:** type definitions come built-in in the package

## Documentation

[https://yet-another-react-lightbox.vercel.app/documentation](https://yet-another-react-lightbox.vercel.app/documentation)

## Examples

[https://yet-another-react-lightbox.vercel.app/examples](https://yet-another-react-lightbox.vercel.app/examples)

## Installation

```shell
npm install yet-another-react-lightbox
```

or

```shell
yarn add yet-another-react-lightbox
```

## Minimal Setup Example

```jsx
import * as React from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const App = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <button type="button" onClick={() => setOpen(true)}>
                Open Lightbox
            </button>

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={[
                    { src: "/image1.jpg" },
                    { src: "/image2.jpg" },
                    { src: "/image3.jpg" },
                ]}
            />
        </>
    );
};

export default App;
```

## Recommended Setup

Unlike many other lightbox libraries, Yet Another React Lightbox doesn't have a concept of "thumbnail" or "original"
(or "full size") images. We use responsive images instead and recommend you provide multiple files of different
resolutions for each image. Yet Another React Lightbox automatically populates `srcSet` / `sizes` attributes and lets
the browser decide which image is more appropriate for its viewport size.

```jsx
import * as React from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const App = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            <button type="button" onClick={() => setOpen(true)}>
                Open Lightbox
            </button>

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                slides={[
                    {
                        src: "/image1x3840.jpg",
                        alt: "image 1",
                        aspectRatio: 3 / 2,
                        srcSet: [
                            { src: "/image1x320.jpg", width: 320 },
                            { src: "/image1x640.jpg", width: 640 },
                            { src: "/image1x1200.jpg", width: 1200 },
                            { src: "/image1x2048.jpg", width: 2048 },
                            { src: "/image1x3840.jpg", width: 3840 },
                        ]
                    },
                    // ...
                ]}
            />
        </>
    );
};

export default App;
```

You can also integrate 3rd-party image components (e.g., Next.js Image or Gatsby Image) via a custom render function.
See [examples](https://yet-another-react-lightbox.vercel.app/examples) on the documentation website.

## Plugins

Yet Another React Lightbox allows you to add optional features based on your requirements via plugins.

The following plugins come bundled in the package:

- [Captions](https://yet-another-react-lightbox.vercel.app/plugins/captions) - adds support for slide title and
  description
- [Fullscreen](https://yet-another-react-lightbox.vercel.app/plugins/fullscreen) - adds support for fullscreen mode
- [Inline](https://yet-another-react-lightbox.vercel.app/plugins/inline) - adds support for inline rendering mode
- [Slideshow](https://yet-another-react-lightbox.vercel.app/plugins/slideshow) - adds slideshow autoplay feature
- [Thumbnails](https://yet-another-react-lightbox.vercel.app/plugins/thumbnails) - adds thumbnails track
- [Video](https://yet-another-react-lightbox.vercel.app/plugins/video) - adds support for video slides

## License

MIT © 2022 [Igor Danchenko](https://github.com/igordanchenko)
