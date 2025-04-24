import { Graph } from '@maxgraph/core';
import { inlineImage } from './inlineImage';

export type MaxGraphToSvgOptions = {
    inlineImages?: boolean;
};

export const maxGraphToSvg = async (
    graph: Graph,
    options?: MaxGraphToSvgOptions,
): Promise<string> => {
    const container = graph.container;

    const orig = container.innerHTML;

    const inlineImages: boolean =
        (options ?? { inlineImages: false }).inlineImages ?? false;

    if (inlineImages) {
        const images = Array.from(container.querySelectorAll('image'));

        for (const image of images) {
            await inlineImage(image);
        }
    }

    const svg = container.firstElementChild!;

    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

    const xml = [
        `<?xml version="1.0" standalone="no"?>`,
        `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">`,
        container.innerHTML,
    ].join('\n');

    container.innerHTML = orig;

    return xml;
};
