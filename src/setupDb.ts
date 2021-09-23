import chalk from "chalk";
import Container from "typedi";
import { createConnection, useContainer } from "typeorm";
import Event from "./domains/events/event.model";
import Permission from "./domains/permisssions/permissions.model";
import Role from "./domains/roles/roles.model";
import User from "./domains/users/user.model";
import Category from "./domains/category/category.model";
import File from "./domains/file/file.model";

export default async function setupDB(mode: EMode) {
  useContainer(Container);
  const connection = await createConnection({
    type: "postgres",
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    entities: [Event, User, Role, Permission, Category, File],
    synchronize: true,
    migrations: ["./migrations/*.ts"],
    cli: {
      migrationsDir: "migration",
    },
    logging: false,
    database:
      mode === EMode.DEV ? process.env.DB_NAME : process.env.TEST_DB_NAME,
  });
  console.log(
    chalk.green(
      `db connected: ${connection.name}/${connection.options.database} `
    )
  );
  return connection;
}

export enum EMode {
  TEST = "TEST",
  DEV = "DEV",
}
