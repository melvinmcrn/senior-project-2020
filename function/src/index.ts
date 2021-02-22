require('dotenv').config();

import type {HttpFunction} from '@google-cloud/functions-framework/build/src/functions';

import {
  validateImage,
  getValidationResult,
  getUncertainImage,
  updateUncertainImage,
} from './controller';
import {UpdateUncertainRequestBody, ValidationRequestBody} from './@types';
import {ApiError} from './helpers/ApiError';

export const validation: HttpFunction = async (
  req: {body: ValidationRequestBody; method: string},
  res
) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
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
  }
};

export const result: HttpFunction = async (req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
    if (req.query && req.query.image_id) {
      // correct request format
      try {
        const imageId = req.query.image_id.toString();
        const result = await getValidationResult(imageId);
        res.status(200).json({result});
      } catch (error) {
        if (error instanceof ApiError) {
          error.handleError(res);
        } else {
          console.error(error);
          res.status(500).send();
        }
      }
    } else {
      // incorrect request
      res.status(400).send('incorrect request query string.');
    }
  }
};

export const uncertain_list: HttpFunction = async (req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
    try {
      const result = await getUncertainImage();
      res.status(200).json({images: result});
    } catch (error) {
      if (error instanceof ApiError) {
        error.handleError(res);
      } else {
        console.error(error);
        res.status(500).send();
      }
    }
  }
};

export const update_uncertain: HttpFunction = async (
  req: {body: UpdateUncertainRequestBody; method: string},
  res
) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else {
    if (req.body && req.body.data) {
      // correct body
      try {
        const data = req.body.data;
        const result = await updateUncertainImage(data);
        res.status(200).json(result);
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
  }
};
