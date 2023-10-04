# Slideshow Plugin

Slideshow plugin adds slideshow autoplay feature to the lightbox.

## Documentation

The plugin adds the following `Lightbox` properties.

<table class="docs">
  <tbody>
    <tr>
      <td>slideshow</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;ref?: React.ForwardedRef&#8203;&lt;SlideshowRef&gt;;<br />
        &nbsp;&nbsp;autoplay?: boolean;<br />
        &nbsp;&nbsp;delay?: number;<br />
        &#125;
      </td>
      <td>
        <p>Slideshow plugin settings:</p>
        <ul>
          <li>`ref` - Slideshow plugin ref. See [Slideshow Ref](#SlideshowRef) for details.</li>
          <li>`autoplay` - if `true`, slideshow is turned on automatically when the lightbox opens</li>
          <li>`delay` - slideshow delay in milliseconds</li>
        </ul>
        <p>Defaults: <span class="font-mono">&#123; autoplay: false, delay: 3000 &#125;</span></p>
      </td>
    </tr>
    <tr>
      <td>render</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;iconSlideshowPlay?: () => React.ReactNode;<br />
        &nbsp;&nbsp;iconSlideshowPause?: () => React.ReactNode;<br />
        &nbsp;&nbsp;buttonSlideshow?: (props: SlideshowRef) => React.ReactNode;<br />
        &#125;
      </td>
      <td>
        <p>Custom render functions:</p>
        <ul>
          <li>`iconSlideshowPlay` - render custom Slideshow Play icon</li>
          <li>`iconSlideshowPause` - render custom Slideshow Pause icon</li>
          <li>`buttonSlideshow` - render custom Slideshow button</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>on</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;slideshowStart?: () => void;<br />
        &nbsp;&nbsp;slideshowStop?: () => void;<br />
        &#125;
      </td>
      <td>
        <p>Lifecycle callbacks.</p>
        <ul>
          <li>`slideshowStart` - a callback called on slideshow playback start</li>
          <li>`slideshowStop` - a callback called on slideshow playback stop</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Slideshow Ref

The Slideshow plugin provides a ref object to control the plugin features
externally.

```jsx
// Slideshow ref usage example

const slideshowRef = React.useRef(null);

// ...

return (
  <Lightbox
    plugins={[Slideshow]}
    slideshow={{ ref: slideshowRef }}
    on={{
      click: () => {
        (slideshowRef.current?.playing
          ? slideshowRef.current?.pause
          : slideshowRef.current?.play)?.();
      },
    }}
    // ...
  />
);
```

<table class="docs">
  <tbody>
    <tr>
      <td>playing</td>
      <td>boolean</td>
      <td>Current slideshow playback status.</td>
    </tr>
    <tr>
      <td>disabled</td>
      <td>boolean</td>
      <td>If `true`, the slideshow playback is disabled.</td>
    </tr>
    <tr>
      <td>play</td>
      <td>() => void</td>
      <td>Start the slideshow playback.</td>
    </tr>
    <tr>
      <td>pause</td>
      <td>() => void</td>
      <td>Pause the slideshow playback.</td>
    </tr>
  </tbody>
</table>

## Example

```jsx
import Lightbox from "yet-another-react-lightbox";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import "yet-another-react-lightbox/styles.css";

// ...

return (
  <Lightbox
    plugins={[Slideshow]}
    // ...
  />
);
```

## Live Demo

<SlideshowPluginExample />

## CodeSandbox

<CodeSandboxLink file="/src/examples/SlideshowPlugin.tsx" path="/plugins/slideshow" />
