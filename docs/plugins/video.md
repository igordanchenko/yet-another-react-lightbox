# Video Plugin

The Video plugin adds support for video slides via HTML &lt;video&gt; player.

## Documentation

The plugin adds video `Slide` type with the following attributes. Most
attributes are identical to the ones present in the
[&lt;video&gt;](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
HTML element.

<table class="docs">
  <tbody>
    <tr>
      <td>
        <span class="required">type</span>
      </td>
      <td>"video"</td>
      <td>video slide type marker</td>
    </tr>
    <tr>
      <td>
        <span class="required">sources</span>
      </td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;src: string;<br />
        &nbsp;&nbsp;type: string;<br />
        &nbsp;&nbsp;media?: string;<br />
        &#125;[]
      </td>
      <td>
        <p>an array of video files</p>
        <ul>
          <li>`src` - video source URL</li>
          <li>
            `type` - video source type 
            (e.g., <span class="font-mono">video/mp4</span>)
          </li>
          <li>
            `media` - media query for the resource's intended media
            (e.g., <span class="font-mono">(min-width: 800px)</span>)
          </li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>poster</td>
      <td>string</td>
      <td>video placeholder image</td>
    </tr>
    <tr>
      <td>width</td>
      <td>number</td>
      <td>video width in pixels</td>
    </tr>
    <tr>
      <td>height</td>
      <td>number</td>
      <td>video height in pixels</td>
    </tr>
    <tr>
      <td>autoPlay</td>
      <td>boolean</td>
      <td>if `true`, the video automatically begins to play</td>
    </tr>
    <tr>
      <td>controls</td>
      <td>boolean</td>
      <td>if `true`, the browser will offer controls to allow the user to control video playback</td>
    </tr>
    <tr>
      <td>controlsList</td>
      <td>string</td>
      <td>indicates what controls to show</td>
    </tr>
    <tr>
      <td>crossOrigin</td>
      <td>string</td>
      <td>indicates whether to use CORS to fetch the related video</td>
    </tr>
    <tr>
      <td>preload</td>
      <td>string</td>
      <td>video preload setting</td>
    </tr>
    <tr>
      <td>loop</td>
      <td>boolean</td>
      <td>if `true`, the browser will automatically seek back to the start upon reaching the end of the video</td>
    </tr>
    <tr>
      <td>muted</td>
      <td>boolean</td>
      <td>the default setting of the audio contained in the video</td>
    </tr>
    <tr>
      <td>playsInline</td>
      <td>boolean</td>
      <td>if `true`, the video is to be played "inline", that is within the element's playback area</td>
    </tr>
    <tr>
      <td>disablePictureInPicture</td>
      <td>boolean</td>
      <td>prevents the browser from suggesting a Picture-in-Picture context menu</td>
    </tr>
    <tr>
      <td>disableRemotePlayback</td>
      <td>boolean</td>
      <td>disables the capability of remote playback</td>
    </tr>
  </tbody>
</table>

Additionally, the Video plugin adds the following `Lightbox` properties, which
can be used as defaults for all video slides within a lightbox.

<table class="docs">
  <tbody>
    <tr>
      <td>video</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;autoPlay?: boolean;<br />
        &nbsp;&nbsp;controls?: boolean;<br />
        &nbsp;&nbsp;controlsList?: string;<br />
        &nbsp;&nbsp;crossOrigin?: string;<br />
        &nbsp;&nbsp;preload?: string;<br />
        &nbsp;&nbsp;loop?: boolean;<br />
        &nbsp;&nbsp;muted?: boolean;<br />
        &nbsp;&nbsp;playsInline?: boolean;<br />
        &nbsp;&nbsp;disablePictureInPicture?: boolean;<br />
        &nbsp;&nbsp;disableRemotePlayback?: boolean;<br />
        &#125;
      </td>
      <td>
        <p>All attributes are identical to the ones described above.</p>
        <p>Defaults: <span class="font-mono">&#123; controls: true, playsInline: true &#125;</span></p>
      </td>
    </tr>
  </tbody>
</table>

## Example

```jsx
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/styles.css";

// ...

return (
  <Lightbox
    plugins={[Video]}
    slides={[
      {
        type: "video",
        width: 1280,
        height: 720,
        poster: "/public/poster-image.jpg",
        sources: [
          {
            src: "/public/video.mp4",
            type: "video/mp4",
          },
        ],
      },
      // ...
    ]}
    // ...
  />
);
```

## Live Demo

<VideoPluginExample />

## Sandbox

<StackBlitzLink href="edit/yet-another-react-lightbox-examples" file="src/examples/VideoPlugin.tsx" initialPath="/plugins/video" />
