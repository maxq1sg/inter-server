import { Router } from "express";

export default abstract class BaseController {
  abstract router: Router;
  abstract initRoutes: () => void;
}
