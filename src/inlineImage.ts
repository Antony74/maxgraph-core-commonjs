import fsp from 'fs/promises';
import mime from 'mime-types';

export const inlineImage = async (image: SVGImageElement): Promise<void> => {
    let path = image.getAttribute('xlink:href') ?? '';

    let isFile = false;

    try {
        const url = new URL(path);
        isFile = url.protocol === 'file:';
    } catch (_e) {}

    let buffer: ArrayBufferLike;

    if (isFile) {
        buffer = await fsp.readFile(path.slice(7));
    } else {
        const response = await fetch(path);
        buffer = await response.arrayBuffer();
    }

    const content = Buffer.from(buffer).toString('base64');

    const mimeType = mime.lookup(path);
    const contentType = mimeType ? mimeType : '';

    const newUrl = `data:${contentType};base64, ${content}`;

    image.setAttribute('xlink:href', newUrl);
};
