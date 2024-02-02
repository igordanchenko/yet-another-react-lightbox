# Counter Plugin

Counter plugin adds slides counter to the lightbox.

The plugin comes with an additional CSS stylesheet.

```jsx
import "yet-another-react-lightbox/plugins/counter.css";
```

## Documentation

Counter plugin adds the following `Lightbox` properties:

<table class="docs">
  <tbody>
    <tr>
      <td>counter</td>
      <td>
        &#123;<br/>
        &nbsp;&nbsp;separator?: string;<br/>
        &nbsp;&nbsp;container?: React.HTMLAttributes&#8203;&lt;HTMLDivElement&gt;;<br/>
        &#125;
      </td>
      <td>
        <p>Counter plugin settings.</p>
        <ul>
          <li>`separator` - custom separator</li>
          <li>`container` - HTML div element attributes to be passed to the Counter plugin container</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

Counter position can be customized via `counter.container.style` prop.

```jsx
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";

// ...

return (
  <Lightbox
    plugins={[Counter]}
    counter={{ container: { style: { top: "unset", bottom: 0 } } }}
    // ...
  />
);
```

## Live Demo

<CounterPluginExample />

## Sandbox

<StackBlitzLink href="edit/yet-another-react-lightbox-examples" file="src/examples/CounterPlugin.tsx" initialPath="/plugins/counter" />
