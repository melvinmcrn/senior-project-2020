import {OkPacket, escape, ConnectionConfig, createConnection} from 'mysql';
import * as util from 'util';

import {ValidationResult, ValidationResultTransaction} from '../@types';
import {ApiError} from './ApiError';
import {rowDataPacketToArary} from './helper';

const config: ConnectionConfig = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASS,
  database: process.env.SQL_DATABASE,
  charset: 'utf8',
  timezone: 'utc',
};

if (process.env.SQL_HOST) {
  config.host = process.env.SQL_HOST;
} else if (process.env.SQL_SOCKET_PATH) {
  config.socketPath = process.env.SQL_SOCKET_PATH;
}

console.log('SQL config: ', config);

const makeDb = (config: ConnectionConfig) => {
  try {
    const connection = createConnection(config);

    return {
      query(queryString: string) {
        return util.promisify(connection.query).call(connection, queryString);
      },
      close() {
        return util.promisify(connection.end).call(connection);
      },
    };
  } catch (error) {
    console.error(error);
    throw new ApiError(500, 'Error occur while connecting to DB.');
  }
};

const db = makeDb(config);

const getTransactionById = async (
  id: string
): Promise<ValidationResultTransaction[]> => {
  try {
    const queryString = `SELECT * FROM validation_result WHERE id = ${escape(
      id
    )};`;
    const query = db.query(queryString);
    const rows = await query;
    return rowDataPacketToArary(rows);
  } catch (error) {
    console.error(error);
    throw new ApiError(500, 'Error occur while getting transaction by id.');
  }
};

const createNewTransaction = async (
  id: string,
  url: string
): Promise<boolean> => {
  try {
    const queryString = `INSERT INTO validation_result (id, url) VALUES (${escape(
      id
    )}, ${escape(url)});`;
    const query = db.query(queryString);
    const result = <OkPacket>await query;
    if (!result.affectedRows || result.affectedRows < 1) {
      throw new Error();
    }
    return true;
  } catch (error) {
    if (error.code && error.code === 'ER_DUP_ENTRY') {
      return false;
    }
    console.error(error);
    throw new ApiError(500, 'Error occur while creating new transaction.');
  }
};

const updateActualResultByImageId = async (
  id: string,
  actualResult: ValidationResult
): Promise<void> => {
  try {
    const queryString = `UPDATE validation_result SET actual_result = ${escape(
      actualResult
    )}
    WHERE id = ${escape(id)};`;
    const query = db.query(queryString);
    const result = <OkPacket>await query;
    if (!result.affectedRows || result.affectedRows < 1) {
      throw new Error();
    }
  } catch (error) {
    console.error(error);
    throw new ApiError(500, 'Error occur while updating prediction result.');
  }
};

const getUncertainList = async (): Promise<ValidationResultTransaction[]> => {
  try {
    const queryString =
      'SELECT * FROM validation_result WHERE actual_result = "UNCERTAIN"';
    const query = db.query(queryString);
    const rows = await query;
    return rowDataPacketToArary(rows);
  } catch (error) {
    console.error(error);
    throw new ApiError(500, 'Error occur while getting uncertain list.');
  }
};

export {
  getTransactionById,
  createNewTransaction,
  updateActualResultByImageId,
  getUncertainList,
};
