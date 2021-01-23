import axios, {AxiosRequestConfig} from 'axios';
import * as sharp from 'sharp';
import * as FileType from 'file-type';

import {ApiError} from './helpers/ApiError';
import {createHash} from './helpers/helper';
import {createNewTransaction, getTransactionById} from './sql';

const validateImage = async (imageUrl: string): Promise<string> => {
  // get image from URL in the form of Buffer
  const imageBuffer = await getImageBufferFromUrl(imageUrl);

  // resize the image to desired resolution which is 150x150px (ratio can change - no cropping)
  const resizedImage = await sharp(imageBuffer)
    .resize(150, 150, {fit: 'fill'})
    .toBuffer();

  // get Hash value of the image
  const imageHash = createHash(resizedImage.toString());

  // get rows with id as this image hash
  const rows = await getTransactionById(imageHash);

  // there is already this hash id in the database, return the hash id
  if (rows.length > 0) {
    return imageHash;
  }

  // the hash id is not found, save image to storage & create new transaction
  // TODO: uplaod file to storage and get URL, now we will mock the URL first.

  const savedUrl = 'www.google.com';
  await createNewTransaction(imageHash, savedUrl);
  console.log('create new transaction done');

  // TODO: send the data to pubsub;

  return imageHash;
};

const getImageBufferFromUrl = async (imageUrl: string): Promise<Buffer> => {
  try {
    const config: AxiosRequestConfig = {
      responseType: 'arraybuffer',
    };
    const imageResponse = await axios.get(imageUrl, config);

    if (imageResponse.status !== 200) {
      throw new ApiError(
        400,
        `Image URL is incorrect or cannot be access with status ${imageResponse.status}`
      );
    }

    const imageBuffer = Buffer.from(imageResponse.data, 'binary');
    const value = await FileType.fromBuffer(imageBuffer);
    if (!value || !value.mime.includes('image')) {
      throw new ApiError(400, 'Data from URL is not image!');
    }
    return imageBuffer;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(500, 'Error while getting image from URL!');
    }
  }
};

export {validateImage};
