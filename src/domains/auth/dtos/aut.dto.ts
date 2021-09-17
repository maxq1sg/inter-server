import { FileType } from "../../../types/FileType";
import Role from "../../roles/roles.model";
import User from "../../users/user.model";

export interface RegisterUser {
  firstName: string;
  email: string;
  password: string;
  lastName: string;
  addData?: {
    isMarried: boolean;
    address: string;
  };
  role?: Role;
  type:FileType;
  image:Express.Multer.File
}
export interface LoginUser {
  email: string;
  password: string;
}
export interface TokenPayload {
  email: string;
  role: Role;
  id: number;
}
export interface AuthResponseBody{
  user:User,
  token:string
}
