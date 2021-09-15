import BaseError from "./BaseError";
import { HttpStatusCode } from "../HttpStatusCodes";

export default class NotFoundError extends BaseError{
    public readonly message: string;
    public readonly httpCode: HttpStatusCode;
    public readonly isOperational: boolean;
    constructor(){
        super()
        this.message="Не найдено!"
        this.httpCode=HttpStatusCode.NOT_FOUND
        this.isOperational=true
    }
}