const config = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: [__dirname + "/src/domains/**/*.model.ts"],
  synchronize: false,
  migrations: [__dirname + "/src/migrations/*.ts"],
  logging: false,
  database: process.env.DB_NAME,
};
export = config;
