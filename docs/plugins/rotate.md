# Rotate Plugin

The Rotate plugin adds a toolbar button that rotates the current image 90
degrees clockwise. Rotation resets when navigating to another slide or closing
the lightbox. Non-image slides cannot be rotated.

Rotated images fit within the slide area and work with the Zoom plugin, in
either plugin order. Rotating an image resets zoom and pan so the new
orientation fits the viewport. Original image files and download URLs are
unchanged.

## Example

```jsx
import Lightbox from "yet-another-react-lightbox";
import Rotate from "yet-another-react-lightbox/plugins/rotate";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

return <Lightbox slides={slides} plugins={[Rotate, Zoom]} />;
```

The plugin is also available as a named export from
`yet-another-react-lightbox/plugins`. No additional stylesheet is required.

## Documentation

- `render.iconRotate` renders a custom Rotate icon.
- `render.buttonRotate` renders a custom button and receives
  `{ rotation, disabled, rotate }`. `rotation` is the clockwise rotation applied
  by the plugin, from 0 to 270 degrees; `rotate()` advances it by 90 degrees.
- `labels["Rotate clockwise"]` overrides the accessible button label and
  tooltip.
- `on.rotate` receives `{ index, rotation }` after each rotation.
- `toolbar.buttons` accepts `"rotate"` to position the button.

Image slides also accept `rotation` to set their initial clockwise orientation
in multiples of 90 degrees. Width, height, and `srcSet` dimensions continue to
describe the original, unrotated image. Custom image renderers receive the
updated `slide.rotation` and are responsible for applying it.
