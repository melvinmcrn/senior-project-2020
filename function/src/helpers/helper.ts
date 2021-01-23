import * as crypto from 'crypto';

const createHash = (data: string) =>
  crypto.createHash('md5').update(data).digest('hex');

const rowDataPacketToArary = (rowsDataPacket: any) => {
//   console.log('***************');
//   console.log(rowsDataPacket);
//   console.log('AAAAAAAAAAA');
//   console.log(JSON.parse(JSON.stringify(rowsDataPacket)));
//   console.log('XXXXXXXXXXXXX');
  return JSON.parse(JSON.stringify(rowsDataPacket));
};

export {createHash, rowDataPacketToArary};
