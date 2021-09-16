import { Router } from "express";
import { Service } from "typedi";
import { HttpStatusCode } from "../../errors/HttpStatusCodes";
import UserService from "./user.service";
import CustomError from "../../errors/errorTypes/CustomError";
import Route from "../../middleware/RouteDecorator";
import { ChangeUsersRole, CreateUser } from "./dtos/user-dto";
import { RequestPayload } from "../../middleware/types/MetaType";
import initUserRoute from "./user.router";
import BaseController from "../../middleware/types/BaseController";
import AuthGuard from "../../middleware/AuthGuard";
import PermissionGuard from "../../middleware/PermissionGuard";
import { EPermission } from "../permisssions/types";

@Service({ id: "user.controller" })
class UserController extends BaseController {
  public router: Router;

  constructor(private readonly userService: UserService) {
    super();
    this.router = Router();
    initUserRoute.call(this, this.router);
  }

  @Route(["params"])
  async getSingleUser(payload: RequestPayload) {
    const { id } = payload.params;
    const user = await this.userService.getSingleUser(+id);
    return user;
  }

  @Route(["params"])
  async deleteUserById(payload: RequestPayload) {
    const { id } = payload.params;
    const data = await this.userService.deleteUser(+id);
    return { message: `Удалено пользователей: ${data.affected}` };
  }

  // fix
  @Route(["params", "user"])
  async getEventsOfSingleUser(payload: RequestPayload) {
    const { id: idFromClient } = payload.params;
    const { id: idFromToken } = payload.user;
    if (+idFromClient !== idFromToken) {
      throw new CustomError(
        HttpStatusCode.FORBIDDEN,
        "У вас нет доступа для просмотра!"
      );
    }
    const events = await this.userService.getEventsOfSingleUser(+idFromToken);
    return events;
  }

  @Route([])
  async getAllUsers() {
    const data = await this.userService.findAllUsers();
    return data;
  }

  @Route(["body", "file"])
  async createUser(payload: RequestPayload) {
    const {
      first_name,
      last_name,
      add_data,
      password,
      email,
      role,
      type,
    }: CreateUser = payload.body;
    const newUser = await this.userService.createUser({
      first_name,
      last_name,
      add_data,
      password,
      email,
      role,
      type,
      image: payload.file,
    });
    return newUser;
  }

  @Route([])
  async seedUsers() {
    const identifiers = await UserService.seedUsers();
    return identifiers;
  }

  @Route(["body"])
  async changeUsersRole(payload: RequestPayload) {
    const { role_id, user_id }: ChangeUsersRole = payload.body;
    const modifiedUser = await this.userService.changeUsersRole({
      role_id,
      user_id,
    });
    return modifiedUser;
  }

  initRoutes = () => {
    this.router.post("/", this.createUser);
    this.router.post("/seed", this.seedUsers);
    this.router.get("/:id/events", AuthGuard, this.getEventsOfSingleUser);
    this.router.delete("/:id", this.deleteUserById);
    this.router.get("/:id", this.getSingleUser);
    this.router.get(
      "/",
      AuthGuard,
      PermissionGuard(EPermission.SHOW_USERS_LIST),
      this.getAllUsers
    );
    this.router.put("/role", this.changeUsersRole);
  };
}
export default UserController;
