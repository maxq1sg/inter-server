import * as bcrypt from "bcrypt";
import { Service } from "typedi";
import { getConnection } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import CustomError from "../../errors/errorTypes/CustomError";
import FileService from "../file/file.service";
import Role from "../roles/roles.model";
import RoleRepository from "../roles/roles.repository";
import { HttpStatusCode } from "./../../errors/HttpStatusCodes";
import { ChangeUsersRole, CreateUser } from "./dtos/user-dto";
import User from "./user.model";
import UserRepository from "./user.repository";

@Service()
class UserService {
  constructor(
    @InjectRepository(User) private userRepository: UserRepository,
    @InjectRepository(Role) private roleRepository: RoleRepository,
    private readonly fileService: FileService
  ) {}

  async getSingleUser(id: number) {
    const user = await this.userRepository.findOne(id, {
      relations: ["events", "role", "owner_of_events"],
    });
    if (!user) {
      throw new CustomError(HttpStatusCode.BAD_REQUEST, "user doesn't exist");
    }
    return user;
  }
  async changeUsersRole({ role_id, user_id }: ChangeUsersRole) {
    const role = await this.roleRepository.findOne(role_id);
    const user = await this.userRepository.findOne(user_id);

    if (!role || !user) {
      throw new CustomError(
        HttpStatusCode.BAD_REQUEST,
        "Error while changing role for user"
      );
    }

    user.role = role;
    await user.save();

    return user;
  }
  async deleteUser(id: number) {
    const data = await this.userRepository.delete(id);
    if (!data?.affected) {
      throw new CustomError(
        HttpStatusCode.NOT_FOUND,
        "Ошибка при удалении пользователя"
      );
    }
    return data;
  }

  async getEventsOfSingleUser(id: number) {
    const user = await this.userRepository.findOne(id, {
      relations: ["events"],
    });
    if (!user) {
      throw new CustomError(HttpStatusCode.NOT_FOUND, "Пользователь не найден");
    }
    return user.events;
  }

  findAllUsers() {
    return this.userRepository.find({
      select: ["add_data", "first_name", "last_name", "email"],
    });
  }

  async createUser(body: CreateUser) {
    const hashedPassword = await bcrypt.hash(
      body.password,
      +process.env.SALT_ROUNDS
    );
    body.password = hashedPassword;
    const avatar = await this.fileService.addNewFileToStorage(
      body.image,
      body.type
    );

    const newUser = this.userRepository.create({ ...body, avatar });
    await newUser.save();
    return newUser;
  }
  static clearUsers() {
    return getConnection().createQueryBuilder().delete().from(User).execute();
  }

  static async seedUsers() {
    const editor = await Role.findOne({ where: { name: "EDITOR" } });
    const admin = await Role.findOne({ where: { name: "ADMIN" } });
    const user = await Role.findOne({ where: { name: "USER" } });
    const password = await bcrypt.hash("12345", 10);
    const users = await getConnection()
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          first_name: "ADM",
          email: "admin@gmail.com",
          password,
          last_name: "bernadsk",
          add_data: {
            is_married: false,
            address: "grodno",
          },
          role: admin,
        },
        {
          first_name: "edit",
          email: "editor@gmail.com",
          password,
          last_name: "ber",
          add_data: {
            is_married: false,
            address: "grodno",
          },
          role: editor,
        },
        {
          first_name: "user",
          email: "user@gmail.com",
          password,
          last_name: "ber",
          add_data: {
            is_married: false,
            address: "grodno",
          },
          role: user,
        },
      ])
      .returning("id")
      .execute();
    return users.identifiers.map((idItem) => idItem.id);
  }
}
export default UserService;
