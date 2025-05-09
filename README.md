# maxgraph-core-commonjs

CommonJS build of [@maxgraph/core](https://www.npmjs.com/package/@maxgraph/core) enabling easier headless (nodejs) use.

maxgraph can be used to generate graph diagrams with a very high standard of visual quality. CommonJS builds are the norm for nodejs, and run without any configuration. maxgraph is an ESM package, which is ideal for the web. Although it's not too fiddly to get node to run ESM, this would deprive us of the opportunity to self-document large existing node/CommonJS codebases with attractive and informative maxgraph diagrams generated from in-program metadata.

In this package, vite has been used to build maxgraph for CommonJS.

To further aid headless use, maxgraph-core-commonjs also exposes an additional helper function maxGraphToSvg for generating svg files.

## Headless install

[@maxgraph/core](https://www.npmjs.com/package/@maxgraph/core) depends on the html Document Object Model (dom), so in order to use it headlessly we will also need `jsdom` and `jsdom-global`. Should we also want to convert svg output to another image format, then a package such as `@resvg/resvg-js` will also be required:

    npm install maxgraph-core-commonjs jsdom jsdom-global @resvg/resvg-js

If we're using TypeScript, we'll need some type definitions too:

    npm install -D @types/node @types/jsdom @types/jsdom-global

## Example

This example is taken from the maxgraph README, and modified by adding a call to `jsdomGlobal` at the beginning, and a `main` function at the end.

The resulting script generates the familiar example maxgraph-generated vector diagram, and outputs it both as an .svg and a .png file.

```typescript
import { Resvg } from '@resvg/resvg-js';
import fsp from 'fs/promises';

import jsdomGlobal from 'jsdom-global';
import { Graph, InternalEvent, maxGraphToSvg } from 'maxgraph-core-commonjs';

jsdomGlobal(`<!DOCTYPE html><div id="graph-container"></div>`);

const container = <HTMLElement>document.getElementById('graph-container');
// Disables the built-in context menu
InternalEvent.disableContextMenu(container);

const graph = new Graph(container);
graph.setPanning(true); // Use mouse right button for panning
// Gets the default parent for inserting new cells.
// This is normally the first child of the root (ie. layer 0).
const parent = graph.getDefaultParent();

// Adds cells to the model in a single step
graph.batchUpdate(() => {
    const vertex01 = graph.insertVertex({
        parent,
        position: [10, 10],
        size: [100, 100],
        value: 'rectangle',
    });
    const vertex02 = graph.insertVertex({
        parent,
        position: [350, 90],
        size: [50, 50],
        style: {
            fillColor: 'orange',
            shape: 'ellipse',
            verticalAlign: 'top',
            verticalLabelPosition: 'bottom',
        },
        value: 'ellipse',
    });
    graph.insertEdge({
        parent,
        source: vertex01,
        target: vertex02,
        value: 'edge',
        style: {
            edgeStyle: 'orthogonalEdgeStyle',
            rounded: true,
        },
    });
});

const main = async () => {
    const xml = await maxGraphToSvg(graph, { inlineImages: true });
    await fsp.writeFile('example.svg', xml);

    const resvg = new Resvg(xml, {
        background: '#ffffff',
    });
    const pngData = resvg.render().asPng();
    await fsp.writeFile(`example.png`, pngData);
};

main();
```

## Further example

https://github.com/Antony74/evolution-of-fantasy

## maxGraphToSvg

```typescript
maxGraphToSvg(graph: Graph, options?: MaxGraphToSvgOptions): Promise<string>
```

Converts a maxgraph `Graph` instance into a standalone SVG `string`.

If `options.inlineImages` is set to `true`, external images are inlined as base64 data URIs before exporting.

**Parameters:**

- **graph:** The MaxGraph instance to export.

- **options (optional):** An object with currently a single option

    - **inlineImages?:** boolean to control whether images are embedded (or left as links).

**Returns:** A Promise<string> resolving to the SVG XML string.

**Example:**

```typescript
const xml = await maxGraphToSvg(graph, { inlineImages: true });
```

Although this package is targeted at headless use, it should be noted that the `maxGraphToSvg` function can be used on webpages, [as in this example](https://antony74.github.io/evolution-of-fantasy/dist/).
