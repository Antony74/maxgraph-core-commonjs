import { Graph } from '@maxgraph/core';
export type MaxGraphToSvgOptions = {
    inlineImages?: boolean;
};
export declare const maxGraphToSvg: (graph: Graph, options?: MaxGraphToSvgOptions) => Promise<string>;
