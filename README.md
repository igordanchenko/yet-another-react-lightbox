# Yet Another React Lightbox

Modern lightbox component for React.

## Overview

[![NPM Version](https://img.shields.io/npm/v/yet-another-react-lightbox?color=blue)](https://www.npmjs.com/package/yet-another-react-lightbox)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/yet-another-react-lightbox?color=blue)](https://bundlephobia.com/package/yet-another-react-lightbox)
[![License MIT](https://img.shields.io/npm/l/yet-another-react-lightbox?color=blue)](LICENSE)

Coming soon...

## Documentation

Coming soon...

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
import { Lightbox } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const Page = () => {
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

export default Page;
```

## License

MIT © [Igor Danchenko](https://github.com/igordanchenko)
