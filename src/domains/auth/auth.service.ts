import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { Service } from "typedi";
import { LoginUser, RegisterUser, TokenPayload } from "./dtos/aut.dto";
import User from "../users/user.model";
import CustomError from "../../errors/errorTypes/CustomError";
import { HttpStatusCode } from "../../errors/HttpStatusCodes";
import UserService from "../users/user.service";
import Role from "../roles/roles.model";

@Service()
class AuthService {
  constructor(private readonly userService: UserService) {}

  async registerUser(body: RegisterUser) {
    const { firstName, lastName, addData, password, email, role, type, image } =
      body;

    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      throw new CustomError(
        HttpStatusCode.UNAUTHORIZED,
        "User with such email already exists"
      );
    }
    const usersRole = await Role.findOne({ where: { name: role || "USER" } });
    const newUser = await this.userService.createUser({
      firstName,
      lastName,
      addData,
      password,
      email,
      role: usersRole,
      type,
      image,
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
    }
    throw new CustomError(
      HttpStatusCode.UNAUTHORIZED,
      "Введены неверные данные"
    );
  }

  generateToken(payload: TokenPayload) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
  }
}

export default AuthService;
