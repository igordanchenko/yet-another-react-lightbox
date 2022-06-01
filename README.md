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

```javascript
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

## License

MIT © [Igor Danchenko](https://github.com/igordanchenko)
