# Plugins

[Yet Another React Lightbox](/) allows you to add optional features to your
project based on your requirements via plugins.

The following plugins are bundled in the package:

- [Captions](/plugins/captions) - adds support for slide title and description
- [Counter](/plugins/counter) - adds slides counter
- [Download](/plugins/download) - adds download button
- [Fullscreen](/plugins/fullscreen) - adds support for fullscreen mode
- [Inline](/plugins/inline) - transforms the lightbox into an image carousel
- [Share](/plugins/share) - adds sharing button
- [Slideshow](/plugins/slideshow) - adds slideshow button
- [Thumbnails](/plugins/thumbnails) - adds thumbnails track
- [Video](/plugins/video) - adds support for video slides
- [Zoom](/plugins/zoom) - adds image zoom feature

Each plugin can be imported either from the `yet-another-react-lightbox/plugins`
module entrypoint:

```jsx
// using named export
import { Fullscreen } from "yet-another-react-lightbox/plugins";
```

or from the plugin-specific entrypoint (this option is preferred in TypeScript
projects):

```jsx
// using named export
import { Fullscreen } from "yet-another-react-lightbox/plugins/fullscreen";
```

or

```jsx
// using default export
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
```

Please refer to the individual plugin's documentation for additional details.

## CodeSandbox

<CodeSandboxLink file="/src/examples/CaptionsPlugin.tsx" path="/plugins/captions" />
