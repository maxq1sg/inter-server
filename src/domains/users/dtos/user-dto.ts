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
}

export interface ChangeUsersRole {
  user_id: number;
  role_id: number;
}
