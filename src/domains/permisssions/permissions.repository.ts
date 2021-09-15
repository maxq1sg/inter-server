import { EntityRepository, Repository } from "typeorm";
import Permission from "./permissions.model";

@EntityRepository(Permission)
export default class PermissionsRepository extends Repository<Permission> {}
