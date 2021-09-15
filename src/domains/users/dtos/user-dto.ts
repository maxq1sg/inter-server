import { FileType } from "../../../types/FileType";
import Role from "../../roles/roles.model";

export interface CreateUser {
  first_name: string;
  email: string;
  password: string;
  last_name: string;
  add_data?: {
    is_married: boolean;
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
