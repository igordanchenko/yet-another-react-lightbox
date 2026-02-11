# Download Plugin

The Download plugin adds a download button to the lightbox.

## Documentation

The plugin adds the following `Slide` properties.

<table class="docs">
  <tbody>
    <tr>
      <td>download</td>
      <td>boolean | string | &#123; url: string; filename: string &#125;</td>
      <td>
        <p>Download URL or download props. By default, the plugin uses `slide.src` as the download URL.</p>
        <p>Use string value to specify custom download URL.</p>
        <p>Use object value of the following shape to specify custom download URL and file name override.</p>
        <ul>
          <li>`url` - custom download URL</li>
          <li>`filename` - download file name override</li>
        </ul>
        <p>Use `false` to indicate non-downloadable slides when using custom `download` function.</p>
      </td>
    </tr>
    <tr>
      <td>downloadUrl</td>
      <td>string</td>
      <td>Deprecated. Use `download` prop instead.</td>
    </tr>
    <tr>
      <td>downloadFilename</td>
      <td>string</td>
      <td>Deprecated. Use `download` prop instead.</td>
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
        &nbsp;&nbsp;iconDownload?: () => React.ReactNode;<br />
        &nbsp;&nbsp;buttonDownload?: () => React.ReactNode;<br />
        &#125;
      </td>
      <td>
        <p>Custom render functions:</p>
        <ul>
          <li>`iconDownload` - render custom Download icon</li>
          <li>`buttonDownload` - render custom Download button</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>on</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;download?: (&#123; index &#125;: &#123; index: number &#125;) => void;<br />
        &#125;
      </td>
      <td>
        <p>Lifecycle callbacks.</p>
        <ul>
          <li>`download` - a callback called on slide download</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>download</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;download?: (&#123; slide, saveAs &#125;: &#123; slide: Slide, saveAs: (source: string | Blob, name?: string) => void &#125;) => void;<br />
        &#125;
      </td>
      <td>
        <p>Download plugin settings.</p>
        <ul>
          <li>`download` - custom download function</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

## Example

```jsx
import Lightbox from "yet-another-react-lightbox";
import Download from "yet-another-react-lightbox/plugins/download";

// ...

return (
  <Lightbox
    slides={[
      { src: "/image1.jpg" },
      { src: "/image2.jpg", downloadUrl: "/image2.png" },
      { src: "/image3.jpg", downloadFilename: "puppy_in_sunglasses" },
    ]}
    plugins={[Download]}
    // ...
  />
);
```

## Cross-Origin Images

Depending on your setup, you may run into
[CORS errors](https://github.com/igordanchenko/yet-another-react-lightbox/issues/119)
when trying to download cross-origin images in Chrome.

To work around this issue, you can provide the `download` slide prop that is
different from the image URL that you render in the lightbox (for example by
appending some unique query parameter to the URL):

```jsx
<Lightbox
  open={open}
  close={() => setOpen(false)}
  slides={slides.map((slide) => ({
    ...slide,
    download: `${slide.src}?download`,
  }))}
  plugins={[Download]}
/>
```

## Live Demo

<DownloadPluginExample />

## Sandbox

<StackBlitzLink href="edit/yet-another-react-lightbox-examples" file="src/examples/DownloadPlugin.tsx" initialPath="/plugins/download" />
