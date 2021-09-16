import BaseError from "./BaseError";
import { HttpStatusCode } from "../HttpStatusCodes";

export default class UnathorizedError extends BaseError {
    public readonly message: string;

    public readonly httpCode: HttpStatusCode;

    public readonly isOperational: boolean;

    constructor() {
      super();
      this.message = "Войдте в Систему";
      this.httpCode = HttpStatusCode.UNAUTHORIZED;
      this.isOperational = true;
    }
}
