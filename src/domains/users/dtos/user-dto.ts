import { FileType } from "../../../types/FileType";
import Role from "../../roles/roles.model";

export interface CreateUser {
  firstName: string;
  email: string;
  password: string;
  lastName: string;
  addData?: {
    isMarried: boolean;
    address: string;
  };
  role?: Role;
  image: Express.Multer.File;
  type: FileType;
}

export interface ChangeUsersRole {
  user_id: number;
  role_id: number;
}
