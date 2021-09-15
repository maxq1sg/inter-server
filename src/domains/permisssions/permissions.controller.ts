import { EPermission } from "./types/index";
import { Router } from "express";
import { Service } from "typedi";
import AuthGuard from "../../middleware/AuthGuard";
import PermissionGuard from "../../middleware/PermissionGuard";
import Route from "../../middleware/RouteDecorator";
import BaseController from "../../middleware/types/BaseController";
import { RequestPayload } from "../../middleware/types/MetaType";
import PermissionService from "./permissions.service";

@Service()
class PermissionController extends BaseController {
  public router: Router;

  constructor(private readonly permService: PermissionService) {
    super();
    this.router = Router();
    this.initRoutes();
  }

  @Route(["body"])
  async addNewPermission(payload: RequestPayload) {
    const { name } = payload.body;
    const newPermission = await this.permService.addPermission(name);
    return newPermission;
  }

  //todo
  @Route(["body"])
  async changePermissionName(payload: RequestPayload) {
    const {} = payload.body;
    // const modifiedPermission = await this.permService.changePermissionName()
  }

  @Route([])
  async seedPermissions() {
    const { identifiers } = await PermissionService.seedPermissions();
    return identifiers;
  }

  initRoutes = () => {
    this.router.post("/seed", this.seedPermissions);
    this.router.post(
      "/",
      AuthGuard,
      PermissionGuard(EPermission.CHANGE_ROLES),
      this.addNewPermission
    );
  };
}
export default PermissionController;
