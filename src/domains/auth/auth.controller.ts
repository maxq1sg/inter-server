import { Router } from "express";
import AuthService from "./auth.service";
import { RegisterUser } from "./dtos/aut.dto";
import { LoginUser } from "./dtos/aut.dto";
import Route from "../../middleware/RouteDecorator";
import { Service } from "typedi";
import { RequestPayload } from "../../middleware/types/MetaType";
import BaseController from "../../middleware/types/BaseController";
import { checkSchema } from "express-validator";
import { loginSchema, registrationSchema } from "./validation";

@Service()
class AuthController extends BaseController{
  public router: Router;
  constructor(private readonly authService: AuthService) {
    super()
    this.router = Router();
    this.initRoutes()
  }

  @Route(["body"])
  async loginUser(payload: RequestPayload) {
    const { email, password }: LoginUser = payload.body;
    const { password: _, ...userInDb } = await this.authService.loginUser({
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

  @Route(["body"])
  async registerUser(payload: RequestPayload) {
    const {
      first_name,
      last_name,
      add_data,
      password,
      email,
      role,
    }: RegisterUser = payload.body;
    const newUser = await this.authService.registerUser({
      first_name,
      last_name,
      add_data,
      password,
      email,
      role,
    });
    const token = this.authService.generateToken({
      email: newUser.email,
      id: newUser.id,
      role: newUser?.role,
    });
    newUser.password = null;
    return { user: newUser, token };
  }

  initRoutes=()=>{
    this.router.post(
      "/register",
      checkSchema(registrationSchema),
      this.registerUser
    );
    this.router.post("/login", checkSchema(loginSchema), this.loginUser);
  }
}
export default AuthController;
