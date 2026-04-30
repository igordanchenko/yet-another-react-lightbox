# Filmstrip Plugin

The Filmstrip plugin adds a scrollable preview rail along one edge of the
lightbox. Tap a preview to jump to that slide; built-in images use
`loading="lazy"`. Choose this or [Thumbnails](/plugins/thumbnails), not both.

The plugin comes with an additional CSS stylesheet.

```jsx
import "yet-another-react-lightbox/plugins/filmstrip.css";
```

## Documentation

The Filmstrip plugin adds the following `Lightbox` properties:

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
        <p>Filmstrip plugin settings:</p>
        <ul>
          <li>`ref` - Filmstrip plugin ref. See <a href="#FilmstripRef">Filmstrip Ref</a> for details.</li>
          <li>`position` - rail position</li>
          <li>`width` - preview width (px)</li>
          <li>`height` - preview height (px)</li>
          <li>`border` - border width</li>
          <li>`borderStyle` - border style</li>
          <li>`borderColor` - border color</li>
          <li>`borderRadius` - border radius (px)</li>
          <li>`padding` - inner padding (px)</li>
          <li>`gap` - gap between previews (px)</li>
          <li>`imageFit` - `object-fit` for built-in images</li>
          <li>`vignette` - edge fade on the scroll viewport</li>
          <li>`hidden` - if `true`, rail starts hidden</li>
          <li>`showToggle` - if `true`, show filmstrip show/hide in the toolbar</li>
          <li>`hideScrollbar` - if `true`, hide scrollbars (scroll still works)</li>
          <li>
            `scrollViewportMax` - max size of the scroll viewport on the strip axis; omit for a cap derived from
            `carousel.preload`; `"full"` / number (px) / raw CSS string
          </li>
        </ul>
        <p>
          Defaults:
          <span class="font-mono">
            &#123; position: "bottom", width: 120, height: 80, border: 1, borderRadius: 4, padding: 4, gap: 16,
            imageFit: "contain", vignette: true, hidden: false, showToggle: false, hideScrollbar: false &#125;
          </span>
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
        <p>`thumbnail` - custom cell content (same as Thumbnails). `buttonFilmstrip`, `iconFilmstripVisible`, `iconFilmstripHidden` - toolbar show/hide.</p>
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
          <li>`Filmstrip` - `aria-label` for the rail</li>
          <li>`Show filmstrip` / `Hide filmstrip` - titles when `showToggle` is on</li>
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
      <td>Inline styles for container, track, thumbnail buttons, scroll viewport.</td>
    </tr>
  </tbody>
</table>

and the following `Slide` properties:

<table class="docs">
  <tbody>
    <tr>
      <td>thumbnail</td>
      <td>string</td>
      <td>Optional preview URL (defaults to slide `src`; video can use `poster`).</td>
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
