# Share Plugin

The Share plugin adds a sharing button to the lightbox.

The plugin uses the [Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API) and displays
the sharing button in supported browsers.

## Documentation

The plugin adds the following `Slide` properties.

<table class="docs">
    <tbody>
    <tr>
        <td>share</td>
        <td>
            boolean | string | &#123; url?: string; text?: string; title?: string &#125;
        </td>
        <td>
            <p>Sharing props. By default, the plugin uses `slide.src` as the sharing url.</p>
            <p>Use string value to specify custom sharing url.</p>
            <p>
                Use object value of the following shape to specify custom props
                (see [Navigator.share()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share) for details):
            </p>
            <ul>
                <li>`url` - a string representing a URL to be shared</li>
                <li>`text` - a string representing text to be shared</li>
                <li>`title` - a string representing a title to be shared</li>
            </ul>
            <p>Use `false` to indicate non-shareable slides when using custom `share` function.</p>
        </td>
    </tr>
    </tbody>
</table>

Also, the plugin adds the following `Lightbox` properties.

<table class="docs">
    <tbody>
    <tr>
        <td>render</td>
        <td>
            &#123;<br />
            &nbsp;&nbsp;iconShare?: () => React.ReactNode;<br />
            &nbsp;&nbsp;buttonShare?: () => React.ReactNode;<br />
            &#125;
        </td>
        <td>
            <p>Custom render functions:</p>
            <ul>
                <li>`iconShare` - render custom Share icon</li>
                <li>`buttonShare` - render custom Share button</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>on</td>
        <td>
            &#123;<br />
            &nbsp;&nbsp;share?: (&#123; index &#125;: &#123; index: number &#125;) => void;<br />
            &#125;
        </td>
        <td>
            <p>Lifecycle callbacks.</p>
            <ul>
                <li>`share` - a callback called on slide share</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td>share</td>
        <td>
            &#123;<br />
            &nbsp;&nbsp;share?: (&#123; slide &#125;: &#123; slide: Slide &#125;) => void;<br />
            &#125;
        </td>
        <td>
            <p>Share plugin settings.</p>
            <ul>
                <li>`share` - custom share function</li>
            </ul>
        </td>
    </tr>
    </tbody>
</table>

## Example

```jsx
import Lightbox from "yet-another-react-lightbox";
import Share from "yet-another-react-lightbox/plugins/share";

// ...

<Lightbox
  slides={[
    { src: "/image1.jpg" },
    { src: "/image2.jpg", share: "/image2.png" },
    { src: "/image3.jpg", share: { url: "/image3.png", title: "Image title" } },
  ]}
  plugins={[Share]}
  // ...
/>
```

## Live Demo

<SharePluginExample />

## CodeSandbox

<CodeSandboxLink file="/src/examples/SharePlugin.tsx" path="/plugins/share" />
