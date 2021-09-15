import BaseError from "./BaseError";
import { HttpStatusCode } from "../HttpStatusCodes";
import { Result, ValidationError } from "express-validator";

export default class CustomError extends BaseError {
  public readonly message: string;
  public readonly httpCode: HttpStatusCode;
  public readonly isOperational: boolean;
  public readonly body: ValidationError[];
  constructor(httpCode: HttpStatusCode, message: string,body?:ValidationError[]) {
    super();
    this.message = message;
    this.httpCode = httpCode;
    this.body=body
    this.isOperational = true;
  }
}
