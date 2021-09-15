import { EntityRepository, Repository } from "typeorm";
import Role from "./roles.model";

@EntityRepository(Role)
export default class RoleRepository extends Repository<Role> {}
