require('dotenv').config();

import type {HttpFunction} from '@google-cloud/functions-framework/build/src/functions';

import {validateImage} from './controller';
import {ValidationRequestBody} from './@types';
import {ApiError} from './helpers/ApiError';

export const validation: HttpFunction = async (
  req: {body: ValidationRequestBody},
  res
) => {
  if (req.body && req.body.image_url) {
    // correct body
    try {
      const image_id = await validateImage(req.body.image_url);
      res.status(200).json({image_id});
    } catch (error) {
      if (error instanceof ApiError) {
        error.handleError(res);
      } else {
        console.error(error);
        res.status(500).send();
      }
    }
  } else {
    // incorrect request body
    res.status(400).send('incorrect request body.');
  }
};
