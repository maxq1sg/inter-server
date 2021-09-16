import { EntityRepository, Repository } from "typeorm";
import User from "./user.model";

@EntityRepository(User)
export default class UserRepository extends Repository<User> {}
