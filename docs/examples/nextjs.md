# Next.js

If your project is based on [Next.js](https://nextjs.org/), you may want to take advantage of
the [next/image](https://nextjs.org/docs/api-reference/next/image) component
and [next/dynamic](https://nextjs.org/docs/advanced-features/dynamic-import) import to minimize your bundle size.

## next/dynamic

In most cases, the lightbox JS code and CSS stylesheets do not need to load with the initial page load, and loading can
be postponed until a user starts interacting with your application. This fact creates an opportunity to reduce your
initial load bundle size, which can help improve the speed and responsiveness of your application. To implement this
approach in a Next.js project, you can extract the lightbox-related code and CSS stylesheets into a separate component
and load it dynamically with the `next/dynamic` import.

The below example demonstrates the use of `next/dynamic` import.

### CodeSandbox

<CodeSandboxLink link="https://codesandbox.io/p/sandbox/yet-another-react-lightbox-nextjs-dynamic-rgkgk6" file="/app/page.tsx" path="/" />

## next/image

The `next/image` component provides a more efficient way to handle images in your Next.js project. You can replace the
standard `<img>` element with `next/image` via a custom `render.slide` function. The below example makes use
of `placeholder="blur"` instead of showing a spinner.

```jsx
import Image from "next/image";
import { isImageFitCover, isImageSlide, useLightboxProps } from "yet-another-react-lightbox";

function isNextJsImage(slide) {
    return isImageSlide(slide) && typeof slide.width === "number" && typeof slide.height === "number";
}

export default function NextJsImage({ slide, rect }) {
    const { imageFit } = useLightboxProps().carousel;
    const cover = isImageSlide(slide) && isImageFitCover(slide, imageFit);

    if (!isNextJsImage(slide)) return undefined;

    const width = !cover ? Math.round(Math.min(rect.width, (rect.height / slide.height) * slide.width)) : rect.width;

    const height = !cover ? Math.round(Math.min(rect.height, (rect.width / slide.width) * slide.height)) : rect.height;

    return (
        <div style={{ position: "relative", width, height }}>
            <Image
                fill
                alt=""
                src={slide}
                loading="eager"
                draggable={false}
                placeholder={slide.blurDataURL ? "blur" : undefined}
                style={{ objectFit: cover ? "cover" : "contain" }}
                sizes={`${Math.ceil((width / window.innerWidth) * 100)}vw`}
            />
        </div>
    );
}
```

```jsx
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import NextJsImage from "../components/NextJsImage";

import image1 from "../../public/images/image01.jpeg";
import image2 from "../../public/images/image02.jpeg";
import image3 from "../../public/images/image03.jpeg";

// ...

return (
    <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[image1, image2, image3]}
        render={{ slide: NextJsImage }}
    />
);
```

### Live Demo

<NextJsExample />

### CodeSandbox

<CodeSandboxLink link="https://codesandbox.io/p/sandbox/yet-another-react-lightbox-nextjs-ts-dt0l1m" file="/app/page.tsx" path="/" />

## With Zoom Plugin

Zoom plugin doesn't work well with the Next.js image component. You can use the following approach to take advantage of
Next.js image optimization when using Zoom plugin.

```jsx
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

import image1 from "../public/images/image01.jpeg";
import image2 from "../public/images/image02.jpeg";
import image3 from "../public/images/image03.jpeg";
// ...

const images = [
    image1,
    image2,
    image3,
    // ...
];

const imageSizes = [16, 32, 48, 64, 96, 128, 256, 384];
const deviceSizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

function nextImageUrl(src, size) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${size}&q=75`;
}

const slides = images.map(({ src, width, height }) => ({
    width,
    height,
    src: nextImageUrl(src, width),
    srcSet: imageSizes
        .concat(...deviceSizes)
        .filter((size) => size <= width)
        .map((size) => ({
            src: nextImageUrl(src, size),
            width: size,
            height: Math.round((height / width) * size),
        })),
}));

// ...

return <Lightbox open={open} close={() => setOpen(false)} slides={slides} plugins={[Zoom]} />;
```

### Live Demo

<NextJsZoomExample />

### CodeSandbox

<CodeSandboxLink link="https://codesandbox.io/p/sandbox/yet-another-react-lightbox-nextjs-zoom-323vcm" file="/app/page.tsx" path="/" />
