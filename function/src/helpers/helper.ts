import * as crypto from 'crypto';

const createHash = (data: string) =>
  crypto.createHash('md5').update(data).digest('hex');

export {createHash};
