import * as util from 'util';
import {RedisClient} from 'redis';

const REDISHOST = process.env.REDIS_HOST || 'localhost';
const REDISPORT = 6379;

const client = new RedisClient({
  host: REDISHOST,
  port: REDISPORT,
});

client.on('error', err => console.error('ERR:REDIS:', err));

const redisGet = util.promisify(client.get).bind(client);
const redisSet = util.promisify(client.set).bind(client);

export const setValueByKey = async (
  key: string,
  value: string
): Promise<void> => {
  try {
    console.log('Checking redisClient...');
    if (!redisSet) {
      throw Error('[REDIS] redisClient set not found.');
    }
    console.log('redisClient found! setting value to redisClient.');
    await redisSet(key, value);
    console.log('set value done! with key=', key, 'value=', value);
  } catch (error) {
    console.error('[REDIS ERROR: setValueByKey]');
    console.error(error);
  }
};

export const isKeyExist = async (key: string): Promise<boolean> => {
  try {
    console.log('Checking redisClient...');
    if (!redisGet) {
      throw Error('[REDIS] redisClient get not found.');
    }
    console.log('redisClient found! getting value from redisClient.');
    const value = await redisGet(key);
    console.log('get value done with value =', value);
    if (!value) {
      return false;
    }

    return true;
  } catch (error) {
    console.error('[REDIS ERROR: isKeyExist]');
    throw error;
  }
};
