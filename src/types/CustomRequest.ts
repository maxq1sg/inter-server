import { Request } from "express";
import { TokenPayload } from "../domains/auth/dtos/aut.dto";

export default interface CustomRequest extends Request {
  user: TokenPayload;
  file:any
}
