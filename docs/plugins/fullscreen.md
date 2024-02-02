# Fullscreen Plugin

Fullscreen plugin adds support for fullscreen lightbox mode utilizing the
browser's
[Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API).
Please note that fullscreen mode is not supported in some modern browsers (i.e.,
Safari on iPhone) or within iframes. Fullscreen plugin detects the availability
of fullscreen mode and doesn't display the fullscreen button in browsers that do
not support fullscreen mode.

## Documentation

The plugin adds the following `Lightbox` properties.

<table class="docs">
  <tbody>
    <tr>
      <td>fullscreen</td>
      <td>
        &#123;<br/>
        &nbsp;&nbsp;ref?: React.ForwardedRef&#8203;&lt;FullscreenRef&gt;;<br/>
        &nbsp;&nbsp;auto?: boolean;<br/>
        &#125;
      </td>
      <td>
        <ul>
          <li>`ref` - Fullscreen plugin ref. See [Fullscreen Ref](#FullscreenRef) for details.</li>
          <li>`auto` - if `true`, enter fullscreen mode automatically when the lightbox opens</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>render</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;iconEnterFullscreen?: () => React.ReactNode;<br />
        &nbsp;&nbsp;iconExitFullscreen?: () => React.ReactNode;<br />
        &nbsp;&nbsp;buttonFullscreen?: (props: FullscreenRef) => React.ReactNode;<br />
        &#125;
      </td>
      <td>
        <p>Custom render functions:</p>
        <ul>
          <li>`iconEnterFullscreen` - render custom Enter Fullscreen icon</li>
          <li>`iconExitFullscreen` - render custom Exit Fullscreen icon</li>
          <li>`buttonFullscreen` - render custom Enter/Exit Fullscreen button</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Fullscreen Ref

The Fullscreen plugin provides a ref object to control the plugin features
externally.

```jsx
// Fullscreen ref usage example

const fullscreenRef = React.useRef(null);

// ...

return (
  <Lightbox
    plugins={[Fullscreen]}
    fullscreen={{ ref: fullscreenRef }}
    on={{
      click: () => fullscreenRef.current?.enter(),
    }}
    // ...
  />
);
```

<table class="docs">
  <tbody>
    <tr>
      <td>fullscreen</td>
      <td>boolean</td>
      <td>Current fullscreen status.</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td>boolean | undefined</td>
      <td>If `true`, fullscreen features are not available.</td>
    </tr>
    <tr>
      <td>enter</td>
      <td>() => void</td>
      <td>Enter fullscreen mode.</td>
    </tr>
    <tr>
      <td>exit</td>
      <td>() => void</td>
      <td>Exit fullscreen mode.</td>
    </tr>
  </tbody>
</table>

## Example

```jsx
import Lightbox from "yet-another-react-lightbox";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import "yet-another-react-lightbox/styles.css";

// ...

return (
  <Lightbox
    plugins={[Fullscreen]}
    // ...
  />
);
```

## Live Demo

<FullscreenPluginExample />

## Sandbox

<StackBlitzLink href="edit/yet-another-react-lightbox-examples" file="src/examples/FullscreenPlugin.tsx" initialPath="/plugins/fullscreen" />
