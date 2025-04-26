# maxgraph-core-commonjs

CommonJS build of @maxgraph/core enabling easier headless (nodejs) use.

To further aid headless use, maxgraph-core-commonjs also exposes an additional helper function maxGraphToSvg.

## Headless install

@maxgraph/core depends on the html Document Object Model (dom), so in order to use it headlessly we will also need `jsdom` and `jsdom-global`.  If we want to convert svg output to another image format, then a package such as `@resvg/resvg-js` will also be required.

    npm install maxgraph-core-commonjs jsdom jsdom-global @resvg/resvg-js

If we're using TypeScript, we'll need some type definitions too.

    npm install -D @types/node @types/jsdom @types/jsdom-global

## Example

This example is taken from @resvg/resvg-js.  A call to `jsdomGlobal` has been added to the beginning, and a `main` function at the end.

The resulting script generates familiar example maxgraph-generated vector diagram, and outputs it both as an .svg and a .png file.

``` typescript
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
