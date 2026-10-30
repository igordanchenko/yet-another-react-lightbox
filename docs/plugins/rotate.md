# Rotate Plugin

The Rotate plugin adds image rotation controls to the lightbox toolbar. The
primary use case is fixing images with incorrect orientation, so each image
keeps its rotation while the lightbox is open, including when navigating away
from the slide and back, or when slides are added or removed.

Rotation applies to image slides only and is tracked per image `src`. Rotated
images fit within the slide area and work with the Zoom and Thumbnails plugins.
Rotating an image resets its zoom level.

Rotation affects only how images are displayed in the lightbox. Image files are
not modified, and the Download plugin still serves the original file. To keep
user rotations between lightbox sessions, see
[Persisting Rotation](#PersistingRotation).

The plugin relies on the CSS `rotate` property, which is supported in Chrome and
Edge 104+, Safari 14.1+ and Firefox 72+. In older browsers, rotated images are
not displayed correctly.

## Documentation

The plugin adds the following `Slide` properties.

<table class="docs">
  <tbody>
    <tr>
      <td>rotation</td>
      <td>number</td>
      <td>
        <p>Initial clockwise image rotation in degrees.</p>
        <p>
          The value is rounded to the nearest multiple of 90, and values that
          are not finite numbers (e.g., `NaN`) are ignored. Once the user
          rotates an image, their choice takes precedence over subsequent
          `rotation` changes until the lightbox closes (with the
          [Inline](/plugins/inline) plugin, until the lightbox unmounts).
        </p>
        <p>
          Image `width`, `height` and `srcSet` dimensions should describe the
          original image. Don't swap them for rotated images.
        </p>
      </td>
    </tr>
  </tbody>
</table>

Also, the plugin adds the following `Lightbox` properties.

<table class="docs">
  <tbody>
    <tr>
      <td>rotate</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;ref?: React.ForwardedRef&#8203;&lt;RotateRef&gt;;<br />
        &nbsp;&nbsp;buttons?: "clockwise" | "counterclockwise" | "both";<br />
        &#125;
      </td>
      <td>
        <p>Rotate plugin settings:</p>
        <ul>
          <li>`ref` - Rotate plugin ref. See [Rotate Ref](#RotateRef) for details.</li>
          <li>`buttons` - toolbar buttons to display</li>
        </ul>
        <p>Defaults: <span class="font-mono">&#123; buttons: "both" &#125;</span></p>
      </td>
    </tr>
    <tr>
      <td>render</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;iconRotateClockwise?: () => React.ReactNode;<br />
        &nbsp;&nbsp;iconRotateCounterClockwise?: () => React.ReactNode;<br />
        &nbsp;&nbsp;buttonRotate?: (props: RotateRef) => React.ReactNode;<br />
        &#125;
      </td>
      <td>
        <p>Custom render functions:</p>
        <ul>
          <li>`iconRotateClockwise` - render custom Rotate Clockwise icon</li>
          <li>`iconRotateCounterClockwise` - render custom Rotate Counterclockwise icon</li>
          <li>`buttonRotate` - render custom Rotate control in the toolbar</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>on</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;rotate?: (&#123; index, rotation &#125;: &#123; index: number; rotation: number &#125;) => void;<br />
        &#125;
      </td>
      <td>
        <p>Lifecycle callbacks.</p>
        <ul>
          <li>
            `rotate` - a callback called when the current slide is rotated. See
            [Persisting Rotation](#PersistingRotation) for details.
          </li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Rotate Ref

The Rotate plugin provides a ref object to control the plugin features
externally.

```jsx
// Rotate ref usage example

const rotateRef = React.useRef(null);

// ...

return (
  <Lightbox
    plugins={[Rotate]}
    rotate={{ ref: rotateRef }}
    on={{ click: () => rotateRef.current?.rotateClockwise() }}
    // ...
  />
);
```

<table class="docs">
  <tbody>
    <tr>
      <td>rotation</td>
      <td>number</td>
      <td>Clockwise rotation of the current slide in degrees (0, 90, 180 or 270).</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td>boolean</td>
      <td>If `true`, rotation is unavailable for the current slide.</td>
    </tr>
    <tr>
      <td>rotateClockwise</td>
      <td>() => void</td>
      <td>Rotate the current slide 90 degrees clockwise.</td>
    </tr>
    <tr>
      <td>rotateCounterClockwise</td>
      <td>() => void</td>
      <td>Rotate the current slide 90 degrees counterclockwise.</td>
    </tr>
  </tbody>
</table>

## Persisting Rotation

The plugin keeps user rotations only while the lightbox is open (with the
[Inline](/plugins/inline) plugin, until the lightbox unmounts). To persist them,
save the new rotation in the `on.rotate` callback and pass it back via
`slide.rotation` the next time the lightbox opens.

```jsx
// Persisting rotation example

const [rotations, setRotations] = React.useState(loadRotations);

// ...

return (
  <Lightbox
    plugins={[Rotate]}
    slides={slides.map((slide) => ({
      ...slide,
      rotation: rotations[slide.src],
    }))}
    on={{
      rotate: ({ index, rotation }) => {
        const { src } = slides[index];
        // keep the app state up to date for the next time the lightbox opens
        setRotations((prev) => ({ ...prev, [src]: rotation }));
        saveRotation(src, rotation);
      },
    }}
    // ...
  />
);
```

Here, `loadRotations` and `saveRotation` stand for your app's storage, such as a
backend API or `localStorage`.

Since user rotations take precedence over `slide.rotation` changes while the
lightbox is open, rotation changes made by your app (for example, after
replacing an image file on the server) take effect the next time the lightbox
opens. The only exception is a slide with a new `src`, which is treated as a
different image and uses its `slide.rotation` value right away.

Slides that share the same image `src` also share their rotation.

Rotations apply only to the images displayed in the lightbox. If your app
displays the same images elsewhere (e.g., in a gallery grid), apply the saved
rotations there as well, for example, with the CSS `rotate` property.

## Custom Slides

The plugin currently supports image slides only. The rotate buttons are disabled
for all other slide types, including video and custom slides.

The plugin doesn't rotate content rendered by custom `render.slide` or
`render.thumbnail` functions. If you render image slides with a custom render
function, the function must apply the rotation itself. Otherwise, the rotate
buttons have no visible effect, and the Zoom plugin computes its maximum zoom
level and panning limits for the rotated image, which doesn't match what is
displayed. Don't use the Rotate plugin with custom image renderers that don't
apply rotation.

Custom render functions can read the rotation of a slide with the
`useSlideRotation` hook. If your render function uses the `ImageSlide`
component, pass the rotation via its `rotation` prop along with the `rect` prop,
and `ImageSlide` takes care of the rest. Without `rect`, `ImageSlide` can't fit
quarter-turn rotations into the slide.

```jsx
import {
  ImageSlide,
  isImageSlide,
  useLightboxProps,
  useLightboxState,
  useSlideRotation,
} from "yet-another-react-lightbox";

function CustomImageSlide({ slide, offset, rect }) {
  const {
    render,
    on: { click },
    carousel: { imageFit, imageProps },
  } = useLightboxProps();
  const { currentIndex } = useLightboxState();
  const rotation = useSlideRotation(slide);

  if (!isImageSlide(slide)) return undefined;

  return (
    <ImageSlide
      slide={slide}
      offset={offset}
      rect={rect}
      rotation={rotation}
      render={render}
      imageFit={imageFit}
      imageProps={imageProps}
      onClick={
        offset === 0 ? () => click?.({ index: currentIndex }) : undefined
      }
    />
  );
}
```

Render functions that don't use `ImageSlide` need to fit the image into the
transposed slide rect (with width and height swapped) for quarter-turn
rotations, rotate the image with the CSS `rotate` property, and set
`flex-shrink: 0` on the rotated element to prevent the slide container from
shrinking the unrotated image box when it is wider than the slide. See the
[Next.js example](/examples/nextjs#WithRotatePlugin) for a complete render
function that follows these steps.

## Example

```jsx
import Lightbox from "yet-another-react-lightbox";
import Rotate from "yet-another-react-lightbox/plugins/rotate";
import "yet-another-react-lightbox/styles.css";

// ...

return (
  <Lightbox
    plugins={[Rotate]}
    // ...
  />
);
```

## Live Demo

<RotatePluginExample />

## Sandbox

<StackBlitzLink href="edit/yet-another-react-lightbox-examples" file="src/examples/RotatePlugin.tsx" initialPath="/plugins/rotate" />
