# Thumbnails Plugin

Thumbnails plugin adds thumbnails track to the lightbox.

The plugin comes with an additional CSS stylesheet.

```jsx
import "yet-another-react-lightbox/plugins/thumbnails.css";
```

## Documentation

Thumbnails plugin adds the following `Lightbox` properties.

<table class="docs">
    <tbody>
    <tr>
        <td>thumbnails</td>
        <td>
            &#123;<br />
            &nbsp;&nbsp;ref?: React.ForwardedRef&#8203;&lt;ThumbnailsRef&gt;;<br />
            &nbsp;&nbsp;position?: "top" | "bottom" | "start" | "end";<br />
            &nbsp;&nbsp;width?: number;<br />
            &nbsp;&nbsp;height?: number;<br />
            &nbsp;&nbsp;border?: number;<br />
            &nbsp;&nbsp;borderRadius?: number;<br />
            &nbsp;&nbsp;padding?: number;<br />
            &nbsp;&nbsp;gap?: number;<br />
            &nbsp;&nbsp;imageFit?: "contain" | "cover";<br />
            &nbsp;&nbsp;vignette?: boolean;<br />
            &nbsp;&nbsp;showToggle?: boolean;<br />
            &#125;
        </td>
        <td>
            <p>Thumbnails plugin settings:</p>
            <ul>
                <li>`ref` - Thumbnails plugin ref. See [Thumbnails Ref](#ThumbnailsRef) for details.</li>
                <li>`position` - thumbnails position</li>
                <li>`width` - thumbnail width</li>
                <li>`height` - thumbnail height</li>
                <li>`border` - thumbnail border width</li>
                <li>`borderRadius` - thumbnail border radius</li>
                <li>`padding` - thumbnail inner padding</li>
                <li>`gap` - gap between thumbnails</li>
                <li>`imageFit` - `object-fit` setting</li>
                <li>`vignette` - vignette effect on the edges of the thumbnails track</li>
                <li>`showToggle` - if `true`, show the Toggle Thumbnails button in the toolbar</li>
            </ul>
            <p>
                Defaults: <span class="font-mono">&#123; position: "bottom", width: 120, height: 80, border: 1, borderRadius: 4, padding: 4,
                gap: 16, imageFit: "contain", vignette: true &#125;</span>
            </p>
        </td>
    </tr>
    <tr>
        <td>render</td>
        <td>
            &#123;<br />
            &nbsp;&nbsp;thumbnail?: (&#123;
            slide, rect, render, imageFit &#125;:
            &#123; slide: Slide; rect: ContainerRect; render: Render; imageFit: "contain" | "cover"
            &#125;) => React.ReactNode;<br />
            &#125;
        </td>
        <td>Custom thumbnail render function.</td>
    </tr>
    </tbody>
</table>

## Thumbnails Ref

The Thumbnails plugin provides a ref object to control the plugin features externally.

```jsx
// Thumbnails ref usage example

const thumbnailsRef = React.useRef(null);

// ...

return (
    <Lightbox
        plugins={[Thumbnails]}
        thumbnails={{ ref: thumbnailsRef }}
        on={{
            click: () => {
                (thumbnailsRef.current?.visible ? thumbnailsRef.current?.hide : thumbnailsRef.current?.show)?.();
            },
        }}
        // ...
    />
);
```

<table class="docs">
    <tbody>
    <tr>
        <td>visible</td>
        <td>boolean</td>
        <td>If `true`, thumbnails are visible.</td>
    </tr>
    <tr>
        <td>show</td>
        <td>() => void</td>
        <td>Show thumbnails.</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>() => void</td>
        <td>Hide thumbnails</td>
    </tr>
    </tbody>
</table>

## Example

```jsx
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

// ...

return (
    <Lightbox
        plugins={[Thumbnails]}
        // ...
    />
);
```

## Live Demo

<ThumbnailsPluginExample />

## CodeSandbox

<CodeSandboxLink file="/src/examples/ThumbnailsPlugin.tsx" path="/plugins/thumbnails" />
