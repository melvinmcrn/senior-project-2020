import {Storage} from '@google-cloud/storage';
import {ApiError} from './ApiError';

const storage = new Storage({
  keyFilename: 'serviceAccountKey.json',
  projectId: process.env.PROJECT_ID,
});
const bucketName = process.env.BUCKET_NAME || '';

const uploadImageToStorage = async (
  fileName: string,
  image: Buffer
): Promise<string> => {
  try {
    const file = storage.bucket(bucketName).file(`product_image/${fileName}`);
    await file.save(image);
    await file.makePublic();
    return file.publicUrl();
  } catch (error) {
    console.error(error);
    throw new ApiError(520, 'cannot save image');
  }
};

export {uploadImageToStorage};
