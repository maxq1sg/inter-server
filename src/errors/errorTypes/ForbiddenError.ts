import BaseError from "./BaseError";
import { HttpStatusCode } from "../HttpStatusCodes";

export default class ForbiddenError extends BaseError{
    public readonly message: string;
    public readonly httpCode: HttpStatusCode;
    public readonly isOperational: boolean;
    constructor(){
        super()
        this.message="Отказано в доступе"
        this.httpCode=HttpStatusCode.FORBIDDEN
        this.isOperational=true
    }
}