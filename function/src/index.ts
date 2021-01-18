import type {HttpFunction} from '@google-cloud/functions-framework/build/src/functions';

export const helloWorld: HttpFunction = (req, res) => {
  res.send('Hello, World!');
};

export const validation: HttpFunction = (req, res) => {
  if (req.body && req.body.image_url) {
    // correct body
  } else {
    // incorrect request body
    res.status(403).send('incorrect request body.');
  }
};
