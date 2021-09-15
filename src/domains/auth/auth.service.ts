import jwt from "jsonwebtoken";
import { LoginUser, RegisterUser, TokenPayload } from "./dtos/aut.dto";
import User from "../users/user.model";
import * as bcrypt from "bcrypt";
import CustomError from "../../errors/errorTypes/CustomError";
import { HttpStatusCode } from "../../errors/HttpStatusCodes";
import UserService from "./../../domains/users/user.service";
import Role from "./../../domains/roles/roles.model";
import { Service } from "typedi";

@Service()
class AuthService {
  constructor(private readonly userService: UserService) {}

  async registerUser(body: RegisterUser) {
    const { first_name, last_name, add_data, password, email, role } = body;

    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      throw new CustomError(
        HttpStatusCode.UNAUTHORIZED,
        "Пользователь с таким email уже существует"
      );
    }
    const usersRole = await Role.findOne({ where: { name: role || "USER" } });
    const newUser = await this.userService.createUser({
      first_name,
      last_name,
      add_data,
      password,
      email,
      role: usersRole,
    });
    return newUser;
  }
  async loginUser(body: LoginUser) {
    const { email, password } = body;
    const userInDb = await User.findOne({
      where: { email },
      relations: ["role"],
    });
    if (!userInDb) {
      throw new CustomError(
        HttpStatusCode.UNAUTHORIZED,
        "Введены неверные данные"
      );
    }
    const isValid = await bcrypt.compare(password, userInDb?.password);
    if (isValid) {
      return userInDb;
    } else {
      throw new CustomError(
        HttpStatusCode.UNAUTHORIZED,
        "Введены неверные данные"
      );
    }
  }
  generateToken(payload: TokenPayload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
  }
}

export default AuthService;
