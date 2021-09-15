import chalk from "chalk";
import express, { Application } from "express";
import dotenv from "dotenv";
import "reflect-metadata";
import errorHandler from "./errors/errorHandler";
import UserController from "./domains/users/user.controller";
import Container from "typedi";
import AuthController from "./domains/auth/auth.controller";
import EventController from "./domains/events/event-controller";
import PermissionController from "./domains/permisssions/permissions.controller";
import SubscriptionController from "./domains/subscription/subscription.controller";
import RoleController from "./domains/roles/roles.controller";
import CategoryController from "./domains/category/category.controller";
import { join } from "path";
import FileController from "./domains/file/file.controller";
import cors from "cors";
import morgan from "morgan";

export default class App {
  private _app: Application;
  private _userController: UserController;
  private _authController: AuthController;
  private _eventController: EventController;
  private _permissionController: PermissionController;
  private _subscriptionController: SubscriptionController;
  private _rolesController: RoleController;
  private _categoryController: CategoryController;
  private _fileController: FileController;
  constructor() {
    dotenv.config();

    this._userController = Container.get(UserController);
    this._authController = Container.get(AuthController);
    this._eventController = Container.get(EventController);
    this._permissionController = Container.get(PermissionController);
    this._subscriptionController = Container.get(SubscriptionController);
    this._rolesController = Container.get(RoleController);
    this._categoryController = Container.get(CategoryController);
    this._fileController = Container.get(FileController);

    this._app = express();
    this._app.use(express.json());
    this._app.use(morgan("combined"));
    this._app.use(cors({ origin: process.env.CLIENT }));

    this._app.use("/static", express.static(join(__dirname, "..", "static")));
    this._app.use(express.urlencoded({ extended: true }));
    this._app.use("/api/events", this._eventController.router);
    this._app.use("/api/users", this._userController.router);
    this._app.use("/api/sub", this._subscriptionController.router);
    this._app.use("/api/auth", this._authController.router);
    this._app.use("/api/roles", this._rolesController.router);
    this._app.use("/api/perm", this._permissionController.router);
    this._app.use("/api/category", this._categoryController.router);
    this._app.use("/api/file", this._fileController.router);
    this._app.use(errorHandler);
  }
  startServer() {
    const PORT = process.env.APP_PORT || 4000;
    this._app.listen(PORT, () => {
      console.log(chalk.green(`server is running on port ${PORT}`));
    });
    return this._app;
  }

  get app() {
    return this._app;
  }
}
