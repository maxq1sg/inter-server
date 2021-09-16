import { Service } from "typedi";
import { Router } from "express";
import { EPermission } from "../permisssions/types/index";
import {
  FindRoleByNameDto,
  AddPermissionsToRoleDto,
  ChangeAllRolesDto,
  NewRoleWithPermissions,
} from "./dto/index";
import RoleService from "./roles.service";

import Route from "../../middleware/RouteDecorator";
import { RequestPayload } from "../../middleware/types/MetaType";
import BaseController from "../../middleware/types/BaseController";
import AuthGuard from "../../middleware/AuthGuard";
import PermissionGuard from "../../middleware/PermissionGuard";

@Service({ id: "role.controller" })
class RoleController extends BaseController {
  public router = Router();

  constructor(private readonly roleService: RoleService) {
    super();
    this.router = Router();
    this.initRoutes();
  }

  @Route(["body"])
  async addNewRole(payload: RequestPayload) {
    const { name } = payload.body;
    const newRole = await this.roleService.addNewRole(name);
    return newRole;
  }

  @Route(["body"])
  async addPermissionsToRole(payload: RequestPayload) {
    const { role_id, permission_ids }: AddPermissionsToRoleDto = payload.body;

    const success = await this.roleService.addPermissionsToRole({
      role_id,
      permission_ids,
    });
    return { success };
  }

  @Route(["body"])
  async createNewRoleWithPermissions(payload: RequestPayload) {
    const { permission_ids, name }: NewRoleWithPermissions = payload.body;
    const newRole = await this.roleService.createNewRoleWithPermissions(
      name,
      permission_ids
    );
    return newRole;
  }

  @Route(["body"])
  async changeAllRoles(payload: RequestPayload) {
    const { data }: ChangeAllRolesDto = payload.body;
    const success = await this.roleService.changeAllRoles(data);
    return { success };
  }

  @Route(["params"])
  async getPermissionsListToRole(payload: RequestPayload) {
    const { id } = payload.params;
    const permission = await this.roleService.getPermissionsListToRole(+id);
    return permission;
  }

  @Route([])
  async getAllRolesWithPermissions() {
    const roles = await this.roleService.getAllRolesWithPermissions();
    return roles;
  }

  @Route([])
  async seedRoles() {
    const { identifiers } = await RoleService.seedRoles();
    return identifiers.map((idItem) => idItem.id);
  }

  @Route([])
  async clearAllRoles() {
    await RoleService.clearAllRoles();
    return { message: "succcess" };
  }

  @Route(["body"])
  async getRoleByName(payload: RequestPayload) {
    const { name }: FindRoleByNameDto = payload.body;
    const role = await this.roleService.getRoleByName(name);
    return role;
  }

  initRoutes = () => {
    this.router.post(
      "/new",
      AuthGuard,
      PermissionGuard(EPermission.CHANGE_ROLES),
      this.addNewRole
    );
    this.router.post(
      "/new_with_perm",
      AuthGuard,
      PermissionGuard(EPermission.CHANGE_ROLES),
      this.createNewRoleWithPermissions
    );

    this.router.post(
      "/add_perm",
      AuthGuard,
      PermissionGuard(EPermission.CHANGE_ROLES),
      this.addPermissionsToRole
    );
    this.router.get(
      "/",
      AuthGuard,
      PermissionGuard(EPermission.CHANGE_ROLES),
      this.getAllRolesWithPermissions
    );
    this.router.post("/seed", this.seedRoles);
    this.router.delete(
      "/",
      AuthGuard,
      PermissionGuard(EPermission.CHANGE_ROLES),
      this.clearAllRoles
    );
    this.router.put(
      "/",
      AuthGuard,
      PermissionGuard(EPermission.CHANGE_ROLES),
      this.changeAllRoles
    );
    this.router.get(
      "/:id/list",
      AuthGuard,
      PermissionGuard(EPermission.CHANGE_ROLES),
      this.getPermissionsListToRole
    );
  };
}
export default RoleController;
