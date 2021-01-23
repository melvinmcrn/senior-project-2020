import type {HttpFunction} from '@google-cloud/functions-framework/build/src/functions';

import {validateImage} from './controller';
import {ValidationRequestBody} from './@types';
import {ApiError} from './helpers/ApiError';

export const helloWorld: HttpFunction = (req, res) => {
  res.send('Hello, World!');
};

export const validation: HttpFunction = (
  req: {body: ValidationRequestBody},
  res
) => {
  if (req.body && req.body.image_url) {
    // correct body
    validateImage(req.body.image_url)
      .then((image_id: string) => {
        res.status(200).json({image_id});
      })
      .catch(error => {
        if (error instanceof ApiError) {
          error.handleError(res);
        }
      });
  } else {
    // incorrect request body
    res.status(403).send('incorrect request body.');
  }
};
