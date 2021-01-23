import {createConnection} from 'mysql';
import {ValidationResultTransaction} from './@types';
import {ApiError} from './helpers/ApiError';
import {rowDataPacketToArary} from './helpers/helper';

const config = {
  host: process.env.SQL_HOST,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASS,
  database: process.env.SQL_DATABASE,
};

const connection = createConnection(config);

connection.connect(error => {
  if (error) {
    throw new ApiError(500, 'Error occur while connecting to DB');
  }
  console.log('Connected to DB as thread id: ' + connection.threadId);
});

const getTransactionById = (id: string) => {
  let output: {id: string}[] = [];
  connection.query(
    `SELECT * FROM validation_result WHERE id = "${id}";`,
    (error, rows) => {
      if (error || !rows) {
        throw new ApiError(500, 'Error occur while getting transaction by id');
      }
      output = rowDataPacketToArary(rows);
    }
  );
  return output;
};

const createNewTransaction = (
  transactionData: ValidationResultTransaction
): void => {
  const {id, url} = transactionData;
  const query = `INSERT INTO validation_result (id, url, create_time, update_time
  VALUES (${id}, ${url}, ${new Date()}, ${new Date()});`;

  connection.query(query, error => {
    if (error) {
      throw new ApiError(500, 'Error occur while creating new transaction');
    }
  });
};

export {getTransactionById, createNewTransaction};
