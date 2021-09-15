import { EPermission } from "./types/index";
import { getConnection } from "typeorm";
import Permission from "./permissions.model";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import PermissionsRepository from "./permissions.repository";

@Service()
class PermissionService {
  constructor(@InjectRepository(Permission) private permissionsRepository: PermissionsRepository) {}

  addPermission(name: string) {
    const newPermission = this.permissionsRepository.create({ name });
    return newPermission.save();
  }
  getPermissionsByIds(ids: number[]) {
    return this.permissionsRepository.findByIds(ids);
  }
  async changePermissionName(id: number, newName: string) {
    const permission = await this.permissionsRepository.findOne(id);
    permission.name = newName;
    return permission.save();
  }

  static seedPermissions() {
    return getConnection()
      .createQueryBuilder()
      .insert()
      .into(Permission)
      .values(
        Object.keys(EPermission).map((perm: EPermission) => ({ name: perm }))
      )
      .returning("id")
      .execute();
  }
  static clearAllPermissions() {
    return getConnection()
      .createQueryBuilder()
      .delete()
      .from(Permission)
      .execute();
  }
}
export default PermissionService;
