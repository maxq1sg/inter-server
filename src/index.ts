import dotenv from "dotenv";
import Container from "typedi";
import App from "./app";
import setupDB, { EMode } from "./setupDb";

dotenv.config();

const server = setupDB(EMode.DEV)
  .then(() => {
    Container.get(App).initRoutes().startServer();
  })
  .catch((error) => console.log(error));

export default server;
