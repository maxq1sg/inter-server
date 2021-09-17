import { CreateUser } from './../users/dtos/user-dto';
import { Router } from "express";
import { Service } from "typedi";
import { checkSchema } from "express-validator";
import AuthService from "./auth.service";
import { RegisterUser, LoginUser } from "./dtos/aut.dto";

import Route from "../../middleware/RouteDecorator";
import { RequestPayload } from "../../middleware/types/MetaType";
import BaseController from "../../middleware/types/BaseController";
import { loginSchema, registrationSchema } from "./validation";
import upload from "../file/multer.config";

@Service({ id: "auth.controller" })
class AuthController extends BaseController {
  public router: Router;

  constructor(private readonly authService: AuthService) {
    super();
    this.router = Router();
    this.initRoutes();
  }

  //todo убрать any
  @Route(["body"])
  async loginUser(payload: RequestPayload) {
    const { email, password }: LoginUser = payload.body;
    const { password: _, ...userInDb }:any = await this.authService.loginUser({
      email,
      password,
    });
    const token = this.authService.generateToken({
      email: userInDb.email,
      id: userInDb.id,
      role: userInDb.role,
    });
    return { user: userInDb, token };
  }

  @Route(["body", "file"])
  async registerUser(payload: RequestPayload) {
    const {
      firstName,
      lastName,
      addData,
      password,
      email,
      role,
      type,
    }: RegisterUser = payload.body;

    const newUser = await this.authService.registerUser({
      firstName,
      lastName,
      addData,
      password,
      email,
      role,
      type,
      image: payload.file,
    });
    const token = this.authService.generateToken({
      email: newUser.email,
      id: newUser.id,
      role: newUser?.role,
    });
    newUser.password = null;
    return { user: newUser, token };
  }

  initRoutes = () => {
    this.router.post(
      "/register",
      upload.single("file"),
      checkSchema(registrationSchema),

      this.registerUser
    );
    this.router.post("/login", checkSchema(loginSchema), this.loginUser);
  };
}
export default AuthController;
