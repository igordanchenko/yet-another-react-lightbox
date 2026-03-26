# Filmstrip Plugin

The Filmstrip plugin adds a scrollable virtualized preview strip along one edge
of the lightbox. Tapping a preview jumps to that slide. Built-in preview images
use native lazy loading. it is important to note that Filmstrip and Thumbnails
are interchangeable options with different UX behaviors.

The plugin comes with an additional CSS stylesheet.

```jsx
import "yet-another-react-lightbox/plugins/filmstrip.css";
```

## Documentation

The plugin adds the following `Lightbox` properties.

<table class="docs">
  <tbody>
    <tr>
      <td>filmstrip</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;ref?: React.ForwardedRef&#8203;&lt;FilmstripRef&gt;;<br />
        &nbsp;&nbsp;position?: "top" | "bottom" | "start" | "end";<br />
        &nbsp;&nbsp;width?: number;<br />
        &nbsp;&nbsp;height?: number;<br />
        &nbsp;&nbsp;border?: number;<br />
        &nbsp;&nbsp;borderStyle?: string;<br />
        &nbsp;&nbsp;borderColor?: string;<br />
        &nbsp;&nbsp;borderRadius?: number;<br />
        &nbsp;&nbsp;padding?: number;<br />
        &nbsp;&nbsp;gap?: number;<br />
        &nbsp;&nbsp;imageFit?: "contain" | "cover";<br />
        &nbsp;&nbsp;vignette?: boolean;<br />
        &nbsp;&nbsp;hidden?: boolean;<br />
        &nbsp;&nbsp;showToggle?: boolean;<br />
        &nbsp;&nbsp;hideScrollbar?: boolean;<br />
        &nbsp;&nbsp;scrollViewportMax?: "full" | number | string;<br />
        &#125;
      </td>
      <td>
        <p>Filmstrip plugin settings.</p>
        <ul>
          <li>`ref` - Filmstrip plugin ref. See [Filmstrip Ref](#FilmstripRef) for details.</li>
          <li>`position` - rail edge (`start` / `end` follow RTL)</li>
          <li>`width` - inner preview width (px)</li>
          <li>`height` - inner preview height (px)</li>
          <li>`border` - border width around each preview</li>
          <li>`borderStyle` - border style</li>
          <li>`borderColor` - border color</li>
          <li>`borderRadius` - corner radius (px)</li>
          <li>`padding` - inner padding (px)</li>
          <li>`gap` - gap between previews (px)</li>
          <li>`imageFit` - `object-fit` for built-in images</li>
          <li>`vignette` - gradient fade on the scroll viewport edges</li>
          <li>`hidden` - if `true`, the rail starts hidden when the lightbox opens</li>
          <li>`showToggle` - if `true`, show the filmstrip show/hide control in the toolbar</li>
          <li>`hideScrollbar` - if `true`, hides the scrollbars on the filmstrip viewport</li>
          <li>
            `scrollViewportMax` - cap on the inner scroll viewport along the strip axis. Omit for a default derived
            from carousel preload. `"full"` uses 100% of the axis. A number is px (with `min(..., 100%)`). A string is
            passed through as CSS.
          </li>
        </ul>
        <p>
          Only a window of previews is mounted in the DOM. Size props should match painted layout so scrolling stays
          accurate. If you change border or padding in CSS only, mirror the same values in these props.
        </p>
        <p>
          Defaults: <span class="font-mono">&#123; position: "bottom", width: 120, height: 80, border: 1, borderRadius: 4,
          padding: 4, gap: 16, imageFit: "contain", vignette: true, hidden: false, showToggle: false,
          hideScrollbar: false &#125;</span>
        </p>
      </td>
    </tr>
    <tr>
      <td>render</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;thumbnail?: (props: RenderThumbnailProps) => React.ReactNode;<br />
        &nbsp;&nbsp;buttonFilmstrip?: (props: FilmstripRef) => React.ReactNode;<br />
        &nbsp;&nbsp;iconFilmstripVisible?: () => React.ReactNode;<br />
        &nbsp;&nbsp;iconFilmstripHidden?: () => React.ReactNode;<br />
        &#125;
      </td>
      <td>
        <p>Custom render functions.</p>
        <ul>
          <li>`thumbnail` - custom preview content in the strip (may receive `imageLoading` at runtime for lazy images)</li>
          <li>`buttonFilmstrip` - custom show/hide filmstrip toolbar control</li>
          <li>`iconFilmstripVisible` - icon when the rail is visible</li>
          <li>`iconFilmstripHidden` - icon when the rail is hidden</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>labels</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;Filmstrip?: string;<br />
        &nbsp;&nbsp;"Show filmstrip"?: string;<br />
        &nbsp;&nbsp;"Hide filmstrip"?: string;<br />
        &#125;
      </td>
      <td>
        <ul>
          <li>`Filmstrip` - `aria-label` on the filmstrip navigation region</li>
          <li>`Show filmstrip` - accessible name for the show control when `showToggle` is enabled</li>
          <li>`Hide filmstrip` - accessible name for the hide control when `showToggle` is enabled</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>styles</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;filmstripContainer?: React.CSSProperties;<br />
        &nbsp;&nbsp;filmstripTrack?: React.CSSProperties;<br />
        &nbsp;&nbsp;filmstripThumbnail?: React.CSSProperties;<br />
        &nbsp;&nbsp;filmstripScrollViewport?: React.CSSProperties;<br />
        &#125;
      </td>
      <td>
        <p>Inline style slots for the rail shell, scrollable track, each preview button, and the scroll viewport.</p>
        <p>The plugin also sets CSS variables on the container (for example `--yarl__filmstrip_thumbnail_width`).</p>
      </td>
    </tr>
  </tbody>
</table>

and the following `Slide` properties.

<table class="docs">
  <tbody>
    <tr>
      <td>thumbnail</td>
      <td>string</td>
      <td>Optional smaller image URL for the strip (defaults to image `src`). Video slides can use `poster`.</td>
    </tr>
  </tbody>
</table>

## Filmstrip Ref

The plugin provides a ref object to control its features externally.

```jsx
// Filmstrip ref usage example

const filmstripRef = React.useRef(null);

// ...

return (
  <Lightbox
    plugins={[Filmstrip]}
    filmstrip={{ ref: filmstripRef, showToggle: true }}
    on={{
      click: () => {
        (filmstripRef.current?.visible
          ? filmstripRef.current?.hide
          : filmstripRef.current?.show)?.();
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
      <td>If `true`, the rail is visible.</td>
    </tr>
    <tr>
      <td>show</td>
      <td>() => void</td>
      <td>Show the rail.</td>
    </tr>
    <tr>
      <td>hide</td>
      <td>() => void</td>
      <td>Hide the rail.</td>
    </tr>
  </tbody>
</table>

## Example

```jsx
import Lightbox from "yet-another-react-lightbox";
import Filmstrip from "yet-another-react-lightbox/plugins/filmstrip";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/filmstrip.css";

// ...

return (
  <Lightbox
    plugins={[Filmstrip]}
    // ...
  />
);
```
