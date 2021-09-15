import { NextFunction, Request, Response } from "express";
import BaseError from "./errorTypes/BaseError";
import { HttpStatusCode } from "./httpStatusCodes";

export default function errorHandler(
  error: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = error.httpCode || HttpStatusCode.INTERNAL_SERVER;
  const { body } = error;
  const response = {
    message: error.message,
    body: body || null,
  };

  res.status(statusCode).json(response);
}
