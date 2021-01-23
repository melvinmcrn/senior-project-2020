import axios from 'axios';

import {ApiError} from './helpers/ApiError';
import {createHash} from './helpers/helper';

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
  console.log('hash=', imageHash);

  return '';
};

// const encodeImage = (image: File) => {
//   return sha256(image);
// };

export {validateImage};
