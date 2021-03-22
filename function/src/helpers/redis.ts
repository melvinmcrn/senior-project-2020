import * as util from 'util';
import {RedisClient} from 'redis';

const REDISHOST = process.env.REDIS_HOST || 'localhost';
const REDISPORT = 6379;

const makeRedisClient = () => {
  const client = new RedisClient({
    host: REDISHOST,
    port: REDISPORT,
  });

  client.on('error', err => console.error('ERR:REDIS:', err));

  return {
    ...client,
    get: util.promisify(client.get),
    set(key: string, value: string) {
      return util.promisify(client.set).call(client, key, value);
    },
  };
};

const redisClient = makeRedisClient();

export const setValueByKey = async (
  key: string,
  value: string
): Promise<void> => {
  try {
    await redisClient.set(key, value);
  } catch (error) {
    console.error('[REDIS ERROR: setValueByKey]');
    console.error(error);
  }
};

export const getValueByKey = async (key: string): Promise<string> => {
  try {
    const value = await redisClient.get(key);
    if (!value) {
      return '';
    }

    return value;
  } catch (error) {
    console.error('[REDIS ERROR: setValueByKey]');
    throw error;
  }
};
