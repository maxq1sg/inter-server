import BaseError from "./BaseError";
import { HttpStatusCode } from "../HttpStatusCodes";

export default class BadRequestError extends BaseError {
  public readonly message: string;

  public readonly httpCode: HttpStatusCode;

  public readonly isOperational: boolean;

  constructor() {
    super();
    this.message = "Bad request";
    this.httpCode = HttpStatusCode.BAD_REQUEST;
    this.isOperational = true;
  }
}
