import axios, {AxiosRequestConfig} from 'axios';
import * as sharp from 'sharp';
import * as FileType from 'file-type';

import {ApiError} from './helpers/ApiError';
import {createHash} from './helpers/helper';
import {createNewTransaction, getTransactionById} from './helpers/sql';
import {uploadImageToStorage} from './helpers/storage';
import {ValidationResult} from './@types';
import {publishMessage} from './helpers/pubsub';

const validateImage = async (imageUrl: string): Promise<string> => {
  // get image from URL in the form of Buffer
  const imageData = await getImageBufferFromUrl(imageUrl);
  const imageBuffer = imageData.buffer;
  const imageExt = imageData.ext;

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
  const savedUrl = await uploadImageToStorage(
    `${imageHash}.${imageExt}`,
    resizedImage
  );
  await createNewTransaction(imageHash, savedUrl);

  // TODO: send the data to pubsub;
  const messageToPublish = {
    imageId: imageHash,
    fileName: `${imageHash}.${imageExt}`,
  };

  await publishMessage(
    process.env.PUBSUB_TOPIC_NAME || '',
    JSON.stringify(messageToPublish)
  );

  return imageHash;
};

const getValidationResult = async (
  imageId: string
): Promise<ValidationResult | null> => {
  const transaction = await getTransactionById(imageId);

  if (transaction.length <= 0) {
    throw new ApiError(404, 'Image Id not found.');
  }

  return transaction[0].actual_result || null;
};

const getImageBufferFromUrl = async (
  imageUrl: string
): Promise<{buffer: Buffer; ext: string}> => {
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
    return {buffer: imageBuffer, ext: value.ext};
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(500, 'Error while getting image from URL!');
    }
  }
};

export {validateImage, getValidationResult};
