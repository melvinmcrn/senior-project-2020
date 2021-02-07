import {OkPacket, escape, ConnectionConfig, createConnection} from 'mysql';
import * as util from 'util';

import {ValidationResultTransaction} from '../@types';
import {ApiError} from './ApiError';
import {rowDataPacketToArary} from './helper';

// when deploy, change from "host" to "socketPath"

const config: ConnectionConfig = {
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASS,
  database: process.env.SQL_DATABASE,
  charset: 'utf8',
  timezone: 'utc',
};

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

const createNewTransaction = async (id: string, url: string): Promise<void> => {
  try {
    const queryString = `INSERT INTO validation_result (id, url) VALUES (${escape(
      id
    )}, ${escape(url)});`;
    const query = db.query(queryString);
    const result = <OkPacket>await query;
    if (!result.affectedRows || result.affectedRows < 1) {
      throw new Error();
    }
  } catch (error) {
    console.error(error);
    throw new ApiError(500, 'Error occur while creating new transaction.');
  }
};

const updateActualResultByImageId = async (
  id: string,
  predictedResult: string
): Promise<void> => {
  try {
    const queryString = `UPDATE validation_result SET predicted_result = ${escape(
      predictedResult
    )}, actual_result = ${escape(predictedResult)}
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

export {getTransactionById, createNewTransaction, updateActualResultByImageId};
