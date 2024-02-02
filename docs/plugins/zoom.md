# Zoom Plugin

Zoom plugin adds image zoom feature to the lightbox.

The plugin supports the following input devices and gestures:

<table class="docs">
  <thead>
    <tr>
      <th>Input device</th>
      <th>Zoom</th>
      <th>Pan</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Touchscreen</td>
      <td>
        <ul>
          <li>pinch-to-zoom</li>
          <li>double-tap</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>swipe</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Touchpad</td>
      <td>
        <ul>
          <li>pinch-to-zoom</li>
          <li>double-tap</li>
          <li>double-click</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>scroll (swipe with two fingers)</li>
          <li>click-and-drag</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Keyboard</td>
      <td>
        <ul>
          <li><code class="text-base">+</code>, <code class="text-base">-</code></li>
          <li>
            <code class="text-base">&#x2318;</code>&nbsp;+&nbsp;<code class="text-base">=</code>,
            <code class="text-base">&#x2318;</code>&nbsp;+&nbsp;<code class="text-base">-</code>,
            <code class="text-base">&#x2318;</code>&nbsp;+&nbsp;`0`
          </li>
          <li>
            <code class="text-base">&#x229E;</code>&nbsp;+&nbsp;<code class="text-base">=</code>,
            <code class="text-base">&#x229E;</code>&nbsp;+&nbsp;<code class="text-base">-</code>,
            <code class="text-base">&#x229E;</code>&nbsp;+&nbsp;`0`
          </li>
        </ul>
      </td>
      <td>
        <ul>
          <li>
            <code class="text-base">&#x2190;</code>, <code class="text-base">&#x2192;</code>,
            <code class="text-base">&#x2191;</code>, <code class="text-base">&#x2193;</code>
          </li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>Mouse</td>
      <td>
        <ul>
          <li>zoom (`Ctrl` + mouse wheel)</li>
          <li>double-click</li>
        </ul>
      </td>
      <td>
        <ul>
          <li>scroll (mouse wheel)</li>
          <li>click-and-drag</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Requirements

The plugin currently supports only image slides. Custom render functions are
also supported as long as the slide provides `width` and `height` attributes.

If you need support for custom slide types, please open a
[discussion](https://github.com/igordanchenko/yet-another-react-lightbox/discussions)
and provide a specific use case.

## Documentation

Zoom plugin adds the following `Lightbox` properties.

<table class="docs">
  <tbody>
    <tr>
      <td>zoom</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;ref?: React.ForwardedRef&#8203;&lt;ZoomRef&gt;;<br />
        &nbsp;&nbsp;maxZoomPixelRatio?: number;<br />
        &nbsp;&nbsp;zoomInMultiplier?: number;<br />
        &nbsp;&nbsp;doubleTapDelay?: number;<br />
        &nbsp;&nbsp;doubleClickDelay?: number;<br />
        &nbsp;&nbsp;doubleClickMaxStops?: number;<br />
        &nbsp;&nbsp;keyboardMoveDistance?: number;<br />
        &nbsp;&nbsp;wheelZoomDistanceFactor?: number;<br />
        &nbsp;&nbsp;pinchZoomDistanceFactor?: number;<br />
        &nbsp;&nbsp;scrollToZoom?: boolean;<br />
        &#125;
      </td>
      <td>
        <p>Zoom plugin settings:</p>
        <ul>
          <li>`ref` - Zoom plugin ref. See [Zoom Ref](#ZoomRef) for details.</li>
          <li>`maxZoomPixelRatio` - ratio of image pixels to physical pixels at maximum zoom level</li>
          <li>`zoomInMultiplier` - zoom-in multiplier</li>
          <li>`doubleTapDelay` - double-tap maximum time delay</li>
          <li>`doubleClickDelay` - double-click maximum time delay</li>
          <li>`doubleClickMaxStops` - maximum number of zoom-in stops via double-click or double-tap</li>
          <li>`keyboardMoveDistance` - keyboard move distance</li>
          <li>`wheelZoomDistanceFactor` - wheel zoom distance factor</li>
          <li>`pinchZoomDistanceFactor` - pinch zoom distance factor</li>
          <li>`scrollToZoom` - if `true`, enables image zoom via scroll gestures for mouse and trackpad users</li>
        </ul>
        <p>
          Default: <span class="font-mono">&#123; maxZoomPixelRatio: 1, zoomInMultiplier: 2, doubleTapDelay: 300, doubleClickDelay: 500,
          doubleClickMaxStops: 2, keyboardMoveDistance: 50, wheelZoomDistanceFactor: 100, pinchZoomDistanceFactor:
          100, scrollToZoom: false &#125;</span>
        </p>
      </td>
    </tr>
    <tr>
      <td>animation</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;zoom?: number;<br />
        &#125;
      </td>
      <td>
        <p>Zoom animation duration.</p>
        <p>Default: <span class="font-mono">500</span></p>
      </td>
    </tr>
    <tr>
      <td>render</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;slide?: (&#123;..., zoom, maxZoom&#125;: &#123;..., zoom: number; maxZoom: number &#125;) => React.ReactNode;<br/>
        &nbsp;&nbsp;buttonZoom?: (props: ZoomRef) => React.ReactNode;<br />
        &nbsp;&nbsp;iconZoomIn?: () => React.ReactNode;<br />
        &nbsp;&nbsp;iconZoomOut?: () => React.ReactNode;<br />
        &#125;
      </td>
      <td>
        <p>Custom render functions:</p>
        <ul>
          <li>`slide` - Zoom plugin adds `zoom` and `maxZoom` props to the slide render function</li>
          <li>`buttonZoom` - render custom Zoom In / Zoom Out control</li>
          <li>`iconZoomIn` - render custom Zoom In icon</li>
          <li>`iconZoomOut` - render custom Zoom Out icon</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>on</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;zoom?: (&#123; zoom &#125;: &#123; zoom: number &#125;) => void;<br />
        &#125;
      </td>
      <td>
        <p>Callbacks:</p>
        <ul>
            <li>`zoom` - a callback called when zoom level changes</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Zoom Ref

Zoom plugin provides a ref object to control the plugin features externally.

```jsx
// Zoom ref usage example

const zoomRef = React.useRef(null);

// ...

return (
  <>
    <Lightbox
      slides={slides}
      plugins={[Inline, Zoom]}
      zoom={{ ref: zoomRef }}
      inline={{
        style: { width: "100%", maxWidth: "900px", aspectRatio: "3 / 2" },
      }}
    />

    <button type="button" onClick={() => zoomRef.current?.zoomIn()}>
      Zoom In
    </button>

    <button type="button" onClick={() => zoomRef.current?.zoomOut()}>
      Zoom Out
    </button>
  </>
);
```

<table class="docs">
  <tbody>
    <tr>
      <td>zoom</td>
      <td>number</td>
      <td>Current zoom level.</td>
    </tr>
    <tr>
      <td>maxZoom</td>
      <td>number</td>
      <td>Maximum zoom level.</td>
    </tr>
    <tr>
      <td>offsetX</td>
      <td>number</td>
      <td>Horizontal offset.</td>
    </tr>
    <tr>
      <td>offsetY</td>
      <td>number</td>
      <td>Vertical offset.</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td>boolean</td>
      <td>If `true`, zoom is unavailable for the current slide.</td>
    </tr>
    <tr>
      <td>zoomIn</td>
      <td>() => void</td>
      <td>Increase zoom level using `zoomInMultiplier`.</td>
    </tr>
    <tr>
      <td>zoomOut</td>
      <td>() => void</td>
      <td>Decrease zoom level using `zoomInMultiplier`.</td>
    </tr>
    <tr>
      <td>changeZoom</td>
      <td>(targetZoom: number, rapid?: boolean, dx?: number, dy?: number) => void</td>
      <td>
        <p>Change zoom level.</p>
        <ul>
          <li>`targetZoom` - target zoom value</li>
          <li>`rapid` - if `true`, change zoom level without animation effect</li>
          <li>`dx` - horizontal offset</li>
          <li>`dy` - vertical offset</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Example

```jsx
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

// ...

return (
  <Lightbox
    plugins={[Zoom]}
    // ...
  />
);
```

## Live Demo

<ZoomPluginExample />

## Sandbox

<StackBlitzLink href="edit/yet-another-react-lightbox-examples" file="src/examples/ZoomPlugin.tsx" initialPath="/plugins/zoom" />
