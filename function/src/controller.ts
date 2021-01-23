import axios from 'axios';

import {ApiError} from './helpers/ApiError';
import {createHash} from './helpers/helper';
import {createNewTransaction, getTransactionById} from './sql';

const validateImage = async (imageUrl: string): Promise<string> => {
  const imageResponse = await axios.get(imageUrl);

  if (imageResponse.status !== 200) {
    throw new ApiError(
      304,
      `Image URL is incorrect or cannot be access with status ${imageResponse.status}`
    );
  }

  const imageBlob: BlobPart = imageResponse.data;
  const imageHash = createHash(imageBlob.toString());

  console.log('hash = ', imageHash);
  const rows = await getTransactionById(imageHash);

  // there is already this hash id in the database, return the hash id
  if (rows.length > 0) {
    return imageHash;
  }

  // the hash id is not found, save image to storage & create new transaction
  // createNewTransaction()

  return '';
};

export {validateImage};
