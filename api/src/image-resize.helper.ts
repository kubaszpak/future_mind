import { Jimp } from 'jimp';

export async function resizeImageBuffer(
  buffer: Buffer,
  width: number,
  height: number,
  mimeType: string,
): Promise<Buffer> {
  const imageJimp = await Jimp.read(buffer);
  imageJimp.resize({ w: width, h: height });
  const resizedBuffer = await imageJimp.getBuffer(
    mimeType as
      | 'image/bmp'
      | 'image/tiff'
      | 'image/x-ms-bmp'
      | 'image/gif'
      | 'image/jpeg'
      | 'image/png',
  );
  return resizedBuffer;
}
