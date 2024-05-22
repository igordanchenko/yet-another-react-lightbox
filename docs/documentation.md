# Documentation

[Yet Another React Lightbox](/) allows you to add a lightbox component to your
React project in minutes. To get started, follow the
[Installation](/#Installation) and
[Minimal Setup Example](/#MinimalSetupExample) guides, or feel free to explore
the collection of StackBlitz [demos](/examples).

[Yet Another React Lightbox](/) provides all components and types as named
exports. [Lightbox](#Lightbox) is exported as both default and named export.

The below documentation covers [Yet Another React Lightbox](/) API. For advanced
features, please see the [Advanced API](/advanced) documentation.

Parameters marked with an asterisk (<span class="required"/>) are required.

## Styles

[Yet Another React Lightbox](/) comes with CSS stylesheet that needs to be
imported once in your project. All examples across this site include CSS import,
but you can omit the import statement if you already imported lightbox styles in
your application.

```jsx
import "yet-another-react-lightbox/styles.css";
```

## Lightbox

<table class="docs">
  <tbody>
    <tr>
      <td data-mono="true">open</td>
      <td>boolean</td>
      <td>If `true`, the lightbox is open.</td>
    </tr>
    <tr>
      <td>close</td>
      <td>() => void</td>
      <td>A callback to close the lightbox.</td>
    </tr>
    <tr>
      <td>index</td>
      <td>number</td>
      <td>
        <p>Slide index.</p>
        <p>
          The lightbox reads this property when it opens (in this case the `index` prop determines the starting slide
          index) and when either `slides` or `index` props change (in this case the `index` prop determines the
          current slide index). In most cases, you do not need to provide this prop at all, as the lightbox maintains
          its state internally. However, you may need to provide the `index` prop when you modify or completely
          replace the `slides` array. To keep track of the current slide index, you can use the `on.view` callback 
          (see [Tracking Slide Index](#TrackingSlideIndex) example).
        </p>
        <p>Default value: <span class="font-mono">0</span></p>
      </td>
    </tr>
    <tr>
      <td>slides</td>
      <td>Slide[]</td>
      <td>
        <p>Slides to display in the lightbox. See [Slide](#Slide) for details.</p>
        <p>
          Please note that updating the `slides` array (or just changing the array reference) forces the lightbox
          to update its state based on the current `slides` and `index` values. You can safely use a non-stable array
          reference (i.e., `slides={[{ ... }]}` or `slides={items.map((item) => ({ ... }))}`) as long as the component
          holding the lightbox does not re-rerender while the lightbox is open. However, if your component may
          re-render, be sure to either provide the `slides` prop as a stable array reference (i.e., `const` in static
          scope, or wrapped with `React.useState` or `React.useMemo`), or specify the current slide index in the
          `index` prop (see [Tracking Slide Index](#TrackingSlideIndex) example).
        </p>
        <p>Default value: <span class="font-mono">[]</span></p>
      </td>
    </tr>
    <tr>
      <td>render</td>
      <td>Render</td>
      <td>Custom render functions. See [Render](#Render) for details.</td>
    </tr>
    <tr>
      <td>plugins</td>
      <td>Plugin[]</td>
      <td>
        <p>Enabled plugins.</p>
        <p>Example: <span class="font-mono">plugins=&#123;[Fullscreen, Video]&#125;</span></p>
      </td>
    </tr>
    <tr>
      <td>labels</td>
      <td>object</td>
      <td>
        <p>Custom UI labels.</p>
        <p>Example: <span class="font-mono">labels=&#123;&#123; Next: "Next slide" &#125;&#125;</span></p>
      </td>
    </tr>
    <tr>
      <td>toolbar</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;buttons: (React.ReactNode | "close")[];<br />
        &#125;
      </td>
      <td>
        <p>Toolbar settings.</p>
        <ul>
          <li>`buttons` - buttons to render in the toolbar</li>
        </ul>
        <p>Default value: <span class="font-mono">&#123; buttons: ["close"] &#125;</span></p>
      </td>
    </tr>
    <tr>
      <td>carousel</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;finite?: boolean;<br />
        &nbsp;&nbsp;preload?: number;<br />
        &nbsp;&nbsp;padding?: {"`${number}px` | `${number}%` | number"};<br />
        &nbsp;&nbsp;spacing?: {"`${number}px` | `${number}%` | number"};<br />
        &nbsp;&nbsp;imageFit?: "contain" | "cover"<br />
        &nbsp;&nbsp;imageProps?: React.ImgHTMLAttributes&#8203;&lt;HTMLImageElement&gt;<br />
        &#125;
      </td>
      <td>
        <p>Carousel settings.</p>
        <ul>
          <li>`finite` - if `true`, the lightbox carousel doesn't wrap around</li>
          <li>`preload` - the lightbox preloads <span class="font-mono">(2 * preload + 1)</span> slides</li>
          <li>`padding` - padding around each slide</li>
          <li>`spacing` - spacing between slides</li>
          <li>`imageFit` - `object-fit` setting for image slides</li>
          <li>`imageProps` - custom image attributes</li>
        </ul>
        <p>
          Default value: <span class="font-mono">&#123; finite: false, preload: 2, padding: "16px", spacing: "30%",
          imageFit: "contain" &#125;</span>
        </p>
      </td>
    </tr>
    <tr>
      <td>animation</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;fade?: number;<br />
        &nbsp;&nbsp;swipe?: number;<br />
        &nbsp;&nbsp;navigation?: number;<br />
        &nbsp;&nbsp;easing?: &#123;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;fade?: string;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;swipe?: string;<br />
        &nbsp;&nbsp;&nbsp;&nbsp;navigation?: string;<br />
        &nbsp;&nbsp;&#125;<br />
        &#125;
      </td>
      <td>
        <p>Animation settings.</p>
        <ul>
          <li>`fade` - fade-in / fade-out animation duration</li>
          <li>`swipe` - swipe animation duration</li>
          <li>`navigation` - override for `swipe` animation duration when using keyboard navigation or navigation buttons</li>
          <li>
            <p class="my-0">`easing` - animation timing function settings</p>
            <ul>
              <li>`fade` - fade-in / fade-out animation timing function</li>
              <li>`swipe` - slide swipe animation timing function</li>
              <li>`navigation` - slide navigation animation timing function (when using keyboard navigation or navigation buttons)</li>
            </ul>
          </li>
        </ul>
        <p>
          Default value: <span class="font-mono">&#123; fade: 250, swipe: 500, easing: &#123; fade: "ease",
          swipe: "ease-out", navigation: "ease-in-out" &#125; &#125;</span>
        </p>
      </td>
    </tr>
    <tr>
      <td>controller</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;ref?: React.ForwardedRef&#8203;&lt;ControllerRef&gt;;<br />
        &nbsp;&nbsp;focus?: boolean;<br />
        &nbsp;&nbsp;aria?: boolean;<br />
        &nbsp;&nbsp;touchAction?: "none" | "pan-y";<br />
        &nbsp;&nbsp;closeOnPullUp?: boolean;<br />
        &nbsp;&nbsp;closeOnPullDown?: boolean;<br />
        &nbsp;&nbsp;closeOnBackdropClick?: boolean;<br />
        &#125;
      </td>
      <td>
        <p>Controller settings.</p>
        <ul>
          <li>`ref` - lightbox controller ref (see [Controller Ref](#ControllerRef) for details)</li>
          <li>`focus` - deprecated, for internal use only</li>
          <li>`aria` - if `true`, set ARIA attributes on the controller div</li>
          <li>`touchAction` - deprecated, for internal use only</li>
          <li>`closeOnPullUp` - if `true`, close the lightbox on pull-up gesture</li>
          <li>`closeOnPullDown` - if `true`, close the lightbox on pull-down gesture</li>
          <li>`closeOnBackdropClick` - if `true`, close the lightbox when the backdrop is clicked</li>
        </ul>
        <p>
          Default value: <span class="font-mono">&#123; ref: null, focus: true, aria: false, touchAction: "none" &#125;</span>
        </p>
      </td>
    </tr>
    <tr>
      <td>portal</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;root?: DocumentFragment | Element | null;<br />
        &#125;
      </td>
      <td>
        <p>Portal settings.</p>
        <ul>
          <li>`root` - custom portal mount point. By default, the portal is mounted as a child of the document body.</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>noScroll</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;disabled?: boolean;<br />
        &#125;
      </td>
      <td>
        <p>NoScroll module settings.</p>
        <p>
          The NoScroll module is responsible for hiding the vertical scrollbar and 
          preventing document `<body/>` from scrolling underneath the lightbox. 
          However, in some cases, this functionality may cause undesired side effects, 
          so you may want to disable this feature.
        </p> 
        <ul>
          <li>`disabled` - if `true`, the NoScroll module functionality is disabled</li>
        </ul>
        <p>
          Additionally, the NoScroll module adds extra padding to the
          fixed-positioned elements to avoid visual layout shifts. The primary
          use case for this feature is a fixed-position page header / appbar.
          However, if this behavior causes undesired side effects, you can
          deactivate it for specific elements by marking them with the
          `yarl__no_scroll_padding` CSS class.
        </p>
      </td>
    </tr>
    <tr>
      <td>on</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;view?: (&#123; index &#125;: &#123; index: number &#125;) => void;<br />
        &nbsp;&nbsp;click?: (&#123; index &#125;: &#123; index: number &#125;) => void;<br />
        &nbsp;&nbsp;entering?: () => void;<br />
        &nbsp;&nbsp;entered?: () => void;<br />
        &nbsp;&nbsp;exiting?: () => void;<br />
        &nbsp;&nbsp;exited?: () => void;<br />
        &#125;
      </td>
      <td>
        <p>Lifecycle callbacks.</p>
        <ul>
          <li>`view` - a callback called when a slide becomes active</li>
          <li>`click` - a callback called when a slide is clicked</li>
          <li>`entering` - a callback called when the portal starts opening</li>
          <li>`entered` - a callback called when the portal opens</li>
          <li>`exiting` - a callback called when the portal starts closing</li>
          <li>`exited` - a callback called when the portal closes</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>styles</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;root?: CSSProperties;<br />
        &nbsp;&nbsp;container?: CSSProperties;<br />
        &nbsp;&nbsp;slide?: CSSProperties;<br />
        &nbsp;&nbsp;button?: CSSProperties;<br />
        &nbsp;&nbsp;icon?: CSSProperties;<br />
        &#125;
      </td>
      <td>
        <p>Customization styles.</p>
        <ul>
          <li>`root` - lightbox root customization slot</li>
          <li>`container` - lightbox container customization slot</li>
          <li>`slide` - lightbox slide customization slot</li>
          <li>`button` - lightbox button customization slot</li>
          <li>`icon` - lightbox icon customization slot</li>
        </ul>
        <p>Note that some plugins extend this list with their own customization slots.</p>
      </td>
    </tr>
    <tr>
      <td>className</td>
      <td>string</td>
      <td>CSS class of the lightbox root element</td>
    </tr>
  </tbody>
</table>

## Slide

Image slides are supported by default. Additional slide types can be added via
[plugins](/plugins) or custom [render](#Render) function. Please see
[Custom Slides](/examples/custom-slides) example for details.

<table class="docs">
  <tbody>
    <tr>
      <td>type</td>
      <td>"image"</td>
      <td>Image slide type</td>
    </tr>
    <tr>
      <td><span class="required">src</span></td>
      <td>string</td>
      <td>Image URL</td>
    </tr>
    <tr>
      <td>alt</td>
      <td>string</td>
      <td>Image `alt` attribute</td>
    </tr>
    <tr>
      <td>width</td>
      <td>number</td>
      <td>Image width in pixels</td>
    </tr>
    <tr>
      <td>height</td>
      <td>number</td>
      <td>Image height in pixels</td>
    </tr>
    <tr>
      <td>imageFit</td>
      <td>"contain" | "cover"</td>
      <td>Image `object-fit` setting</td>
    </tr>
    <tr>
      <td>srcSet</td>
      <td>
        &#123;<br />
        &nbsp;&nbsp;src: string;<br />
        &nbsp;&nbsp;width: number;<br />
        &nbsp;&nbsp;height: number;<br />
        &#125;[]
      </td>
      <td>Alternative images to be included in the `srcset`</td>
    </tr>
  </tbody>
</table>

As a bare minimum, you need to provide `src` attribute for each image slide.

```jsx
const slides = [
  { src: "/image1.jpg" },
  { src: "/image2.jpg" },
  { src: "/image3.jpg" },
  // ...
];
```

However, the recommended configuration is to provide multiple files of different
resolution for each slide. [Yet Another React Lightbox](/) uses all supplied
images to populate `srcset` and `sizes` attributes on the fly. Please note that
`width` and `height` attributes are required in this case.

```jsx
const slides = [
  {
    src: "/image1x3840.jpg",
    alt: "image 1",
    width: 3840,
    height: 2560,
    srcSet: [
      { src: "/image1x320.jpg", width: 320, height: 213 },
      { src: "/image1x640.jpg", width: 640, height: 427 },
      { src: "/image1x1200.jpg", width: 1200, height: 800 },
      { src: "/image1x2048.jpg", width: 2048, height: 1365 },
      { src: "/image1x3840.jpg", width: 3840, height: 2560 },
    ],
  },
  // ...
];
```

[Yet Another React Lightbox](/) is optimized to preload and display only a
limited number of slides at a time, so there are no performance penalties or UX
impact in supplying a large number of slides.

## Render

Custom render functions can be passed via `render` prop.

```jsx
// render function usage example

<Lightbox
  render={{
    slide: ({ slide, offset, rect }) => {
      // ...
    },
  }}
  // ...
/>
```

<table class="docs">
  <tbody>
    <tr>
      <td>slide</td>
      <td>
        (&#123; slide, offset, rect &#125;: &#123; slide: Slide; offset: number; rect: ContainerRect &#125;) =>
        React.ReactNode
      </td>
      <td>Render custom slide type, or override the default image slide.</td>
    </tr>
    <tr>
      <td>slideHeader</td>
      <td>
        (&#123; slide &#125;: &#123; slide: Slide &#125;) => React.ReactNode
      </td>
      <td>Render custom slide elements into the DOM right before the slide. Use absolute or fixed positioning.</td>
    </tr>
    <tr>
      <td>slideFooter</td>
      <td>
        (&#123; slide &#125;: &#123; slide: Slide &#125;) => React.ReactNode
      </td>
      <td>Render custom slide elements into the DOM right after the slide. Use absolute or fixed positioning.</td>
    </tr>
    <tr>
      <td>slideContainer</td>
      <td>
        (&#123; slide, children &#125;: &#123; slide: Slide; children: React.ReactNode &#125;) => React.ReactNode
      </td>
      <td>Render custom slide container.</td>
    </tr>
    <tr>
      <td>controls</td>
      <td>() => React.ReactNode</td>
      <td>Render custom controls or additional elements in the lightbox. Use absolute or fixed positioning.</td>
    </tr>
    <tr>
      <td>iconPrev</td>
      <td>() => React.ReactNode</td>
      <td>Render custom Prev icon.</td>
    </tr>
    <tr>
      <td>iconNext</td>
      <td>() => React.ReactNode</td>
      <td>Render custom Next icon.</td>
    </tr>
    <tr>
      <td>iconClose</td>
      <td>() => React.ReactNode</td>
      <td>Render custom Close icon.</td>
    </tr>
    <tr>
      <td>iconLoading</td>
      <td>() => React.ReactNode</td>
      <td>Render custom Loading icon.</td>
    </tr>
    <tr>
      <td>iconError</td>
      <td>() => React.ReactNode</td>
      <td>Render custom Error icon.</td>
    </tr>
    <tr>
      <td>buttonPrev</td>
      <td>() => React.ReactNode</td>
      <td>Render custom Prev button. Return `null` if you want to hide the button.</td>
    </tr>
    <tr>
      <td>buttonNext</td>
      <td>() => React.ReactNode</td>
      <td>Render custom Prev button. Return `null` if you want to hide the button.</td>
    </tr>
    <tr>
      <td>buttonClose</td>
      <td>() => React.ReactNode</td>
      <td>Render custom Close button.</td>
    </tr>
  </tbody>
</table>

## Controller Ref

Controller ref provides external controls for the lightbox.

```jsx
// Controller ref usage example

const ref = React.useRef(null);

// ...

return (
  <Lightbox
    controller={{ ref }}
    on={{ click: () => ref.current?.close() }}
    // ...
  />
);
```

<table class="docs">
  <tbody>
    <tr>
      <td>prev</td>
      <td>(&#123; count &#125;: &#123; count: number &#125;) => void | () => void</td>
      <td>Navigate to the previous slide.</td>
    </tr>
    <tr>
      <td>next</td>
      <td>(&#123; count &#125;: &#123; count: number &#125;) => void | () => void</td>
      <td>Navigate to the next slide.</td>
    </tr>
    <tr>
      <td>close</td>
      <td>() => void</td>
      <td>Close the lightbox.</td>
    </tr>
    <tr>
      <td>focus</td>
      <td>() => void</td>
      <td>Transfer focus to the lightbox controller.</td>
    </tr>
    <tr>
      <td>getLightboxProps</td>
      <td>() => ComponentProps</td>
      <td>Get lightbox props (see type definitions for more details).</td>
    </tr>
    <tr>
      <td>getLightboxState</td>
      <td>() => LightboxState</td>
      <td>Get lightbox state (see type definitions for more details).</td>
    </tr>
  </tbody>
</table>

## Tracking Slide Index

While the lightbox maintains the slide index state internally, some use cases
may require you to keep track of the slide index in a local state variable. You
can easily accomplish this using the following approach:

```tsx
const [index, setIndex] = React.useState(0);

// ...

return (
  <Lightbox
    index={index}
    on={{ view: ({ index: currentIndex }) => setIndex(currentIndex) }}
    // ...
  />
);
```

## Previous Versions

Are you looking for documentation for one of the previous versions?

- [yet-another-react-lightbox v2.x](https://v2.yet-another-react-lightbox.com/documentation)
- [yet-another-react-lightbox v1.x](https://v1.yet-another-react-lightbox.com/documentation)
