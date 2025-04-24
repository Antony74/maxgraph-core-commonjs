import fsp from 'fs/promises';
import mime from 'mime-types';

export const inlineImage = async (image: SVGImageElement): Promise<void> => {
    let path = image.getAttribute('xlink:href') ?? '';

    let isFile = false;

    try {
        const url = new URL(path);
        isFile = url.protocol === 'file:';
    } catch (_e) {}

    if (isFile) {
        path = path.slice(7);
    } else {
        throw new Error(
            `Can't inline "${path}".  Currently only file:// urls are supported.`,
        );
    }

    const buffer = await fsp.readFile(path);
    const content = buffer.toString('base64');

    const mimeType = mime.lookup(path);
    const contentType = mimeType ? mimeType : '';

    const newUrl = `data:${contentType};base64, ${content}`;

    image.setAttribute('xlink:href', newUrl);
};
