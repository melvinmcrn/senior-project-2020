import e = require('express');

class ApiError extends Error {
  statusCode: number;
  message: string;

  constructor(statusCode: number, message: string) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }

  handleError = (res: e.Response) => {
    res.status(this.statusCode).json({
      message: this.message,
    });
  };
}

export {ApiError};
