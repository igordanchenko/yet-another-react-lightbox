# Inline Plugin

The Inline plugin transforms the lightbox into an image carousel that renders inline on the webpage.

## Documentation

The plugin adds and overrides the following `Lightbox` properties.

<table class="docs">
    <tbody>
    <tr>
        <td>inline</td>
        <td>React.HTMLAttributes&#8203;&lt;HTMLDivElement&gt;</td>
        <td>
            <p>HTML div element attributes to be passed to the Inline plugin container.</p>
            <p>Defaults: <span class="font-mono">&#123; style: &#123; width: "100%", height: "100%" &#125; &#125;</span></p>
        </td>
    </tr>
    <tr>
        <td>open</td>
        <td>true</td>
        <td>This prop is ignored.</td>
    </tr>
    <tr>
        <td>close</td>
        <td>() => &#123;&#125;</td>
        <td>This prop is ignored.</td>
    </tr>
    <tr>
        <td>controller.focus</td>
        <td>false</td>
        <td>This prop is ignored.</td>
    </tr>
    <tr>
        <td>toolbar.buttons</td>
        <td>(React.ReactNode | "close")[]</td>
        <td>The "close" button is ignored.</td>
    </tr>
    </tbody>
</table>

## Example

```jsx
import Lightbox from "yet-another-react-lightbox";
import Inline from "yet-another-react-lightbox/plugins/inline";
import "yet-another-react-lightbox/styles.css";

// ...

return (
    <div style={{ width: "100%", maxWidth: "900px", aspectRatio: "3 / 2" }}>
        <Lightbox
            plugins={[Inline]}
            // ...
        />
    </div>
);

// or

return (
    <Lightbox
        plugins={[Inline]}
        inline={{ style: { width: "100%", maxWidth: "900px", aspectRatio: "3 / 2" } }}
        // ...
    />
);
```

## Live Demo

Image carousel:

<InlinePluginExample />

Image carousel with `imageFit: "cover"`:

<InlinePluginCoverExample />

Image carousel with Fullscreen, Slideshow, Thumbnails and Zoom plugins:

<InlinePluginAdvancedExample />

## CodeSandbox

<CodeSandboxLink file="/src/examples/InlinePlugin.tsx" path="/plugins/inline" />
