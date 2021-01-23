import * as crypto from 'crypto';

const createHash = (data: string) =>
  crypto.createHash('md5').update(data).digest('hex');

const rowDataPacketToArary = (rowsDataPacket: any) => {
  return JSON.parse(JSON.stringify(rowsDataPacket));
};

export {createHash, rowDataPacketToArary};
