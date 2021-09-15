import { HttpStatusCode } from "./../../errors/HttpStatusCodes";
import Permission from "../permisssions/permissions.model";
import Role from "./roles.model";
import { AddPermissionsToRoleDto, ERole } from "./dto";
import PermissionService from "../permisssions/permissions.service";
import CustomError from "../../errors/errorTypes/CustomError";
import { getConnection } from "typeorm";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import RoleRepository from "./roles.repository";
import PermissionsRepository from "../permisssions/permissions.repository";

@Service()
class RoleService {
  constructor(
    private readonly permissionService: PermissionService,
    @InjectRepository(Role)
    private rolesRepository: RoleRepository,
    @InjectRepository(Permission)
    private permissionsRepository: PermissionsRepository
  ) {}

  static seedRoles() {
    return getConnection()
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values(Object.keys(ERole).map((role: ERole) => ({ name: role })))
      .returning("id")
      .execute();
  }
  static clearAllRoles() {
    return getConnection().createQueryBuilder().delete().from(Role).execute();
  }

  //костыль
  async changeAllRoles(dto: AddPermissionsToRoleDto[]) {
    for (let role of dto) {
      await this.addPermissionsToRole(role);
    }
    return true;
  }

  addNewRole(name: ERole) {
    const newRole = this.rolesRepository.create({ name });
    return newRole.save();
  }

  async createNewRoleWithPermissions(name: ERole, permIds: number[]) {
    const role = await this.addNewRole(name);
    const permissionsInDb = await this.permissionService.getPermissionsByIds(
      permIds
    );

    role.permissions = permissionsInDb;
    return role.save();
  }

  async addPermissionsToRole(body: AddPermissionsToRoleDto) {
    const role = await this.rolesRepository.findOne(body.role_id);
    const permissions = await this.permissionsRepository.findByIds(body.permission_ids);
    role.permissions = permissions;
    await role.save();
    return true;
  }
  async getPermissionsListToRole(id: number): Promise<Permission[]> {
    const role = await this.rolesRepository.findOne(id, {
      relations: ["permissions"],
    });
    if (!role) {
      throw new CustomError(
        HttpStatusCode.BAD_REQUEST,
        "Такой роли не существует"
      );
    }
    return role.permissions;
  }

  getAllRolesWithPermissions() {
    return this.rolesRepository.find({ relations: ["permissions"] });
  }

  getRoleByName(name: ERole) {
    return this.rolesRepository.find({ where: { name } });
  }
}
export default RoleService;
