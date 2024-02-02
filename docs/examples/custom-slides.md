# Custom Slides

[Yet Another React Lightbox](/) is not limited to just image slides or video
slides, and you can render pretty much any supported media via custom render
function.

```jsx
<Lightbox
  slides={[
    {
      type: "custom-slide",
      // slide attributes
    },
  ]}
  render={{
    slide: ({ slide }) =>
      slide.type === "custom-slide" ? (
        <MyCustomSlide slide={slide} />
      ) : undefined,
  }}
  //...
/>
```

Here is an example of a text slide with CSS animation.

## Live Demo

<CustomSlidesExample />

## Sandbox

<StackBlitzLink href="edit/yet-another-react-lightbox-examples" file="src/examples/CustomSlides.tsx" initialPath="/examples/custom-slides" />
