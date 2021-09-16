import chalk from "chalk";
import express, { Application } from "express";
import dotenv from "dotenv";
import "reflect-metadata";
import Container, { Inject, Service } from "typedi";
import { join } from "path";
import cors from "cors";
import morgan from "morgan";
import errorHandler from "./errors/errorHandler";
import UserController from "./domains/users/user.controller";
import AuthController from "./domains/auth/auth.controller";
import EventController from "./domains/events/event-controller";
import PermissionController from "./domains/permisssions/permissions.controller";
import SubscriptionController from "./domains/subscription/subscription.controller";
import RoleController from "./domains/roles/roles.controller";
import CategoryController from "./domains/category/category.controller";
import FileController from "./domains/file/file.controller";

@Service({ id: "app" })
export default class App {
  public app: Application;

  @Inject("user.controller")
  private userController: UserController;

  @Inject("auth.controller")
  private authController: AuthController;

  @Inject("event.controller")
  private eventController: EventController;

  @Inject("permission.controller")
  private permissionController: PermissionController;

  @Inject("subscription.controller")
  private subscriptionController: SubscriptionController;

  @Inject("role.controller")
  private roleController: RoleController;

  @Inject("category.controller")
  private categoryController: CategoryController;

  @Inject("file.controller")
  private fileController: FileController;

  constructor() {
    this.app = express();
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
    this.app.use(morgan("combined"));
    this.app.use(cors({ origin: process.env.CLIENT }));
    this.app.use("/static", express.static(join(__dirname, "..", "static")));
  }

  startServer() {
    const PORT = process.env.APPPORT || 4000;
    this.app.listen(PORT, () => {
      console.log(chalk.green(`server is running on port ${PORT}`));
    });
    return this;
  }
  initRoutes() {
    this.app.use("/api/events", this.eventController.router);
    this.app.use("/api/users", this.userController.router);
    this.app.use("/api/sub", this.subscriptionController.router);
    this.app.use("/api/auth", this.authController.router);
    this.app.use("/api/roles", this.roleController.router);
    this.app.use("/api/perm", this.permissionController.router);
    this.app.use("/api/category", this.categoryController.router);
    this.app.use("/api/file", this.fileController.router);
    this.app.use(errorHandler);
    return this;
  }
}
