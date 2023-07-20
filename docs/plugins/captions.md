# Captions Plugin

Captions plugin allows you to add titles and descriptions to your lightbox slides.

The plugin comes with an additional CSS stylesheet.

```jsx
import "yet-another-react-lightbox/plugins/captions.css";
```

## Documentation

Captions plugin adds the following `Lightbox` properties:

<table class="docs">
    <tbody>
    <tr>
        <td>captions</td>
        <td>
            &#123;<br />
            &nbsp;&nbsp;ref?: React.ForwardedRef&#8203;&lt;CaptionsRef&gt;;<br />
            &nbsp;&nbsp;showToggle?: boolean;<br />
            &nbsp;&nbsp;descriptionTextAlign?: "start" | "end" | "center";<br />
            &nbsp;&nbsp;descriptionMaxLines?: number;<br />
            &#125;
        </td>
        <td>
            <p>Captions plugin settings:</p>
            <ul>
                <li>`ref` - Captions plugin ref. See [Captions Ref](#CaptionsRef) for details.</li>
                <li>`showToggle` - if `true`, show the Captions Toggle button in the toolbar</li>
                <li>`descriptionTextAlign` - description text alignment</li>
                <li>`descriptionMaxLines` - maximum number of lines to display in the description section</li>
            </ul>
            <p>Defaults: <span class="font-mono">&#123; descriptionTextAlign: "start", descriptionMaxLines: 3 &#125;</span></p>
        </td>
    </tr>
    </tbody>
</table>

and the following `Slide` properties:

<table class="docs">
    <tbody>
    <tr>
        <td>title</td>
        <td>ReactNode</td>
        <td>Slide title.</td>
    </tr>
    <tr>
        <td>description</td>
        <td>ReactNode</td>
        <td>Slide description.</td>
    </tr>
    </tbody>
</table>

# Captions Ref

The Captions plugin provides a ref object to control the plugin features externally.

```jsx
// Captions ref usage example

const captionsRef = React.useRef(null);

// ...

<Lightbox
  plugins={[Captions]}
  captions={{ ref: captionsRef }}
  on={{
    click: () => {
      (captionsRef.current?.visible
        ? captionsRef.current?.hide
        : captionsRef.current?.show)?.();
    },
  }}
  // ...
/>
```

<table class="docs">
    <tbody>
    <tr>
        <td>visible</td>
        <td>boolean</td>
        <td>If `true`, captions are visible.</td>
    </tr>
    <tr>
        <td>show</td>
        <td>() => void</td>
        <td>Show captions.</td>
    </tr>
    <tr>
        <td>hide</td>
        <td>() => void</td>
        <td>Hide captions</td>
    </tr>
    </tbody>
</table>

## Example

```jsx
import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

// ...

<Lightbox
  plugins={[Captions]}
  slides={[
    {
      src: "/image1.jpg",
      title: "Slide title",
      description: "Slide description"
    },
    // ...
  ]}
  // ...
/>
```

## Live Demo

<CaptionsPluginExample />

## CodeSandbox

<CodeSandboxLink file="/src/examples/CaptionsPlugin.tsx" path="/plugins/captions" />
