# Advanced API

Learn how to customize the lightbox with your own plugins using the lightbox
core API.

## Modules

The lightbox uses modular design, allowing you to modify the configuration of
the existing modules or add your own modules via [plugins](#Plugins). Each
module is a named React component receiving pre-processed lightbox props and its
`children`. By default, the modules are arranged in the following React
components tree.

<ul>
  <li>
    <p class="my-0">`Portal` - lightbox portal module</p>
    <ul class="my-0">
      <li>
        <p class="my-0">`NoScroll` - removes scrollbars and prevents `<body/>` from scrolling</p>
        <ul class="my-0">
          <li>
            <p class="my-0">`Controller` - handles events from input devices and lightbox animation</p>
            <ul class="my-0">
              <li>`Carousel` - slides carousel</li>
              <li>`Toolbar` - toolbar module</li>
              <li>`Navigation` - navigation buttons</li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </li>
</ul>

To create your own module, use the `createModule` function.

```js
import { createModule } from "yet-another-react-lightbox";

// ...

function MyComponent({ children, ...props }) {
  // ...
  return <>{children}</>;
}

const myModule = createModule("MyModule", MyComponent);
```

## Plugins

Each plugin is a function that receives a single parameter with the following
named props:

<table class="docs">
  <tbody>
    <tr>
      <td>contains</td>
      <td>(target: string) => boolean</td>
      <td>Test if the `target` module is present.</td>
    </tr>
    <tr>
      <td>addParent</td>
      <td>(target: string, module: Module) => void</td>
      <td>Add module as a parent of the `target` module.</td>
    </tr>
    <tr>
      <td>addChild</td>
      <td>(target: string, module: Module, precede?: boolean) => void</td>
      <td>
        <p>Add module as a child of the `target` module.</p>
        <ul>
          <li>`precede` - if `true`, prepend to the list of the existing children, or append otherwise</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>addSibling</td>
      <td>(target: string, module: Module, precede?: boolean) => void</td>
      <td>
        <p>Add module as a sibling of the `target` module.</p>
        <ul>
          <li>`precede` - if `true`, insert right before the `target` module, or right after otherwise</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>addModule</td>
      <td>(module: Module) => void</td>
      <td>Append module to the `Controller` module.</td>
    </tr>
    <tr>
      <td>replace</td>
      <td>(target: string, module: Module) => void</td>
      <td>Replace the `target` module.</td>
    </tr>
    <tr>
      <td>append</td>
      <td>(target: string, module: Module) => void</td>
      <td>Add module as a child of the `target` module and inherit its existing children.</td>
    </tr>
    <tr>
      <td>remove</td>
      <td>(target: string) => void</td>
      <td>Remove the `target` module.</td>
    </tr>
    <tr>
      <td>augment</td>
      <td>(augmentation: Augmentation) => void</td>
      <td>Augment the lightbox props.</td>
    </tr>
  </tbody>
</table>

For example, you can add your module to the lightbox with the following plugin:

```jsx
import Lightbox from "yet-another-react-lightbox";

// ...

function MyPlugin({ addModule }) {
  addModule(MyModule);
}

// ...

return (
  <Lightbox
    plugins={[MyPlugin]}
    // ...
  />
);
```

## Augmentation

Lightbox props can be modified with plugin's `augment` method. All plugins'
augmentations are applied before the lightbox starts rendering.

For example, you can add a toolbar button using the following augmentation:

```jsx
import { addToolbarButton } from "yet-another-react-lightbox";

// ...

function MyPlugin({ augment }) {
  augment(({ toolbar, ...restProps }) => ({
    toolbar: addToolbarButton(toolbar, "my-button", <MyButton />),
    ...restProps,
  }));
}
```

Another common use case for props augmentation is to provide the default values
for props that are added with your plugin.

```jsx
const myPropDefaults = {
  // ...
};

function MyPlugin({ augment }) {
  augment(({ myProp, ...restProps }) => ({
    myProp: { ...myPropDefaults, ...myProp },
    ...restProps,
  }));
}
```

## Hooks

You can use the following hooks to access various lightbox features. All
lightbox hooks can be used only in a component rendered inside the lightbox
(i.e., a component rendered through a custom render function, or a component
added to the lightbox with a plugin).

### useLightboxState

The `useLightboxState` hook returns the current state of the lightbox (current
slide, current index, etc.)

<table class="docs">
  <tbody>
    <tr>
      <td>slides</td>
      <td>Slide[]</td>
      <td>Lightbox slides.</td>
    </tr>
    <tr>
      <td>currentIndex</td>
      <td>number</td>
      <td>Current slide index.</td>
    </tr>
    <tr>
      <td>globalIndex</td>
      <td>number</td>
      <td>Current slide index in the (-∞, +∞) range.</td>
    </tr>
    <tr>
      <td>currentSlide</td>
      <td>Slide | undefined</td>
      <td>Current slide.</td>
    </tr>
  </tbody>
</table>

```jsx
import { useLightboxState } from "yet-another-react-lightbox";

// ...

const { slides, currentSlide, currentIndex } = useLightboxState();
```

### useLightboxProps

The `useLightboxProps` hook provides access to the
[lightbox](/documentation#Lightbox) props.

```jsx
import { useLightboxProps } from "yet-another-react-lightbox";

// ...

const { carousel, render } = useLightboxProps();
```

### useController

The `useController` hook provides access to the `Controller` module.

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
      <td>slideRect</td>
      <td>&#123; width: number; height: number &#125;</td>
      <td>Container dimensions excluding slide padding.</td>
    </tr>
    <tr>
      <td>containerRect</td>
      <td>&#123; width: number; height: number &#125;</td>
      <td>Container dimensions.</td>
    </tr>
    <tr>
      <td>containerRef</td>
      <td>React.RefObject&#8203;&lt;HTMLDivElement&gt;</td>
      <td>Container `<div/>` ref.</td>
    </tr>
    <tr>
      <td>subscribeSensors</td>
      <td>SubscribeSensors</td>
      <td>Subscribe to pointer / keyboard / wheel events.</td>
    </tr>
    <tr>
      <td>toolbarWidth</td>
      <td>number | undefined</td>
      <td>Current toolbar width.</td>
    </tr>
  </tbody>
</table>

### useContainerRect

The `useContainerRect` hook allows you to measure the available space of an HTML
element excluding padding.

```jsx
import { useContainerRect } from "yet-another-react-lightbox";

const { containerRect, setContainerRef } = useContainerRect();

// ...

<div ref={setContainerRef}>// ...</div>;
```

## Toolbar Buttons

You can create custom toolbar buttons by using the `IconButton` component and
the `createIcon` helper function.

```jsx
import {
  Lightbox,
  IconButton,
  createIcon,
  useLightboxState,
} from "yet-another-react-lightbox";

const MyIcon = createIcon("MyIcon", <path d="..." />);

function MyButton() {
  const { currentSlide } = useLightboxState();

  return (
    <IconButton label="My button" icon={MyIcon} disabled={!currentSlide} />
  );
}

// ...

return (
  <Lightbox
    toolbar={{
      buttons: [<MyButton key="my-button" />, "close"],
    }}
    // ...
  />
);
```

## Custom Slides

Register custom slide type in TypeScript:

```tsx
// yet-another-react-lightbox.d.ts

import { GenericSlide } from "yet-another-react-lightbox";

declare module "yet-another-react-lightbox" {
  export interface CustomSlide extends GenericSlide {
    type: "custom-slide";
    // custom slide attributes
  }

  interface SlideTypes {
    "custom-slide": CustomSlide;
  }
}
```

```tsx
// App.tsx

import { Lightbox, Slide, CustomSlide } from "yet-another-react-lightbox";

function isCustomSlide(slide: Slide): slide is CustomSlide {
  return slide.type === "custom-slide";
}

// ...

return (
  <Lightbox
    slides={[
      {
        type: "custom-slide",
        // custom slide attributes
      },
    ]}
    render={{
      slide: ({ slide }) =>
        isCustomSlide(slide) ? <MyCustomSlide slide={slide} /> : undefined,
    }}
    //...
  />
);
```

## Custom Slide Props

You can use TypeScript module augmentation to add custom slide props.

```tsx
declare module "yet-another-react-lightbox" {
  interface GenericSlide {
    customSlideProp?: string;
  }

  interface SlideImage {
    customImageSlideProp?: string;
  }
}
```

```jsx
<Lightbox
  slides={[
    {
      src: "/image1.jpg",
      customSlideProp: "foo",
      customImageSlideProp: "bar",
    },
  ]}
  // ...
/>
```

## Custom Lightbox Props

You can use TypeScript module augmentation to add custom lightbox props.

```tsx
declare module "yet-another-react-lightbox" {
  interface LightboxProps {
    customLightboxProp?: {
      myProp?: string;
    };
  }
}
```

```jsx
<Lightbox
  customLightboxProp={{ myProp: "baz" }}
  // ...
/>
```
