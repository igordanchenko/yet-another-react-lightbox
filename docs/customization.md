# Customization

[Yet Another React Lightbox](/) allows you to customize pretty much any aspect
of its visual appearance. Custom icons can be rendered via
[render](/documentation#Render) prop. The color palette can be customized
through CSS variables. The existing styles can be modified by targeting
customization slots.

## Customization slots

[Yet Another React Lightbox](/) defines the following customization slots that
can be targeted either via lightbox [styles](/documentation#Lightbox) prop or
via corresponding CSS class.

<table class="docs">
  <thead>
    <tr>
      <th data-mono="true">Slot</th>
      <th data-mono="true">CSS class</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>root</td>
      <td>yarl__root</td>
    </tr>
    <tr>
      <td>container</td>
      <td>yarl__container</td>
    </tr>
    <tr>
      <td>slide</td>
      <td>yarl__slide</td>
    </tr>
    <tr>
      <td>button</td>
      <td>yarl__button</td>
    </tr>
    <tr>
      <td>icon</td>
      <td>yarl__icon</td>
    </tr>
    <tr>
      <td>toolbar</td>
      <td>yarl__toolbar</td>
    </tr>
    <tr>
      <td>navigationPrev</td>
      <td>yarl__navigation_prev</td>
    </tr>
    <tr>
      <td>navigationNext</td>
      <td>yarl__navigation_next</td>
    </tr>
    <tr>
      <td>captionsTitle</td>
      <td>yarl__slide_title</td>
    </tr>
    <tr>
      <td>captionsTitleContainer</td>
      <td>yarl__slide_title_container</td>
    </tr>
    <tr>
      <td>captionsDescription</td>
      <td>yarl__slide_description</td>
    </tr>
    <tr>
      <td>captionsDescriptionContainer</td>
      <td>yarl__slide_description_&#8203;container</td>
    </tr>
    <tr>
      <td>thumbnail</td>
      <td>yarl__thumbnails_thumbnail</td>
    </tr>
    <tr>
      <td>thumbnailsTrack</td>
      <td>yarl__thumbnails_track</td>
    </tr>
    <tr>
      <td>thumbnailsContainer</td>
      <td>yarl__thumbnails_container</td>
    </tr>
  </tbody>
</table>

## CSS variables

All design-related styles can be overwritten via corresponding CSS variables.
Here are some examples of lightbox variables, and you can find the complete list
in the lightbox stylesheet.

- `--yarl__color_backdrop`
- `--yarl__color_button`
- `--yarl__color_button_active`
- `--yarl__color_button_disabled`
- `--yarl__slide_title_color`
- `--yarl__slide_title_font_size`
- `--yarl__slide_title_font_weight`
- `--yarl__slide_description_color`

## Styling

Here are some typical recipes to style the lightbox.

### CSS-in-JS

```jsx
<Lightbox
  styles={{ container: { backgroundColor: "rgba(0, 0, 0, .8)" } }}
  // ...
/>
```

or

```jsx
<Lightbox
  styles={{ root: { "--yarl__color_backdrop": "rgba(0, 0, 0, .8)" } }}
  // ...
/>
```

### Global CSS

```css
.yarl__container {
  background-color: rgba(0, 0, 0, 0.8);
}
```

or

```css
.yarl__root {
  --yarl__color_backdrop: rgba(0, 0, 0, 0.8);
}
```

### Module scoped CSS

```jsx
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import styles from "./Component.module.css";

// ...

return (
  <Lightbox
    className={styles.lightbox}
    // ...
  />
);
```

```css
.lightbox :global(.yarl__container) {
  background-color: rgba(0, 0, 0, 0.8);
}
```

or

```css
.lightbox {
  --yarl__color_backdrop: rgba(0, 0, 0, 0.8);
}
```
#### Custom class names

In case completely custom classnames are needed, e.g. because css classes are 
prefixed / postfixed during build, a `classNameResolver` can be used:

```jsx
import { setClassNameResolver } from 'yet-another-react-lightbox';
import yarlClasses from 'yet-another-react-lightbox/styles.css';
import yarlCaptionClasses from 'yet-another-react-lightbox/plugins/captions.css';

setClassNameResolver((originalClassName: string) => {
  const yarlKey = _.camelCase(`yarl_${originalClassName}`);

  if (Object.keys(yarlClasses as Record<string, string>).includes(yarlKey)) {
    return (yarlClasses as Record<string, string>)[yarlKey];
  }

  if (Object.keys(yarlCaptionClasses as Record<string, string>).includes(yarlKey)) {
    return (yarlCaptionClasses as Record<string, string>)[yarlKey];
  }

  return originalClassName;
});

```

## Adding Toolbar Buttons

To add a button to the toolbar, add a JSX element to the `buttons` property of
the `toolbar` prop. Be sure to add the string `"close"` if you want to keep the
Close button.

```jsx
<Lightbox
  toolbar={{
    buttons: [
      <button key="my-button" type="button" className="yarl__button">
        Button
      </button>,
      "close",
    ],
  }}
  // ...
</>
```

If you have included any plugins that provide their own toolbar buttons, those
buttons will be prepended to the front of the buttons list in the order of the
`plugins` prop array. If you need additional flexibility in arranging plugin
buttons, you can reference them using corresponding plugin name.

```jsx
<Lightbox
  toolbar={{
    buttons: [
      "download",
      <button key="my-button" type="button" className="yarl__button">
        Button
      </button>,
      "slideshow",
      "close",
    ],
  }}
  plugins={[Download, Slideshow]}
  // ...
</>
```

If you need to access information about the current slide when your button is
clicked, see the [Toolbar Buttons](/advanced#ToolbarButtons) section of the
[Advanced API](/advanced) documentation.

## Custom Icons

You can replace the default icons by providing your custom icons in the
[render](/documentation#Render) prop.

```jsx
<Lightbox
  render={{
    iconPrev: () => <MyPrevIcon />,
    iconNext: () => <MyNextIcon />,
    iconClose: () => <MyCloseIcon />,
  }}
  // ...
/>
```

## Hiding Navigation Buttons

To hide the navigation buttons, provide a function returning `null` in the
`buttonPrev` and `buttonNext` render props. This can be useful when you want to
display just a single slide in the lightbox.

```jsx
<Lightbox
  carousel={{ finite: slides.length <= 1 }}
  render={{
    buttonPrev: slides.length <= 1 ? () => null : undefined,
    buttonNext: slides.length <= 1 ? () => null : undefined,
  }}
  // ...
/>
```
