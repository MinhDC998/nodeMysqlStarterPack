import express, { Express } from "express";
import { Sequelize } from "sequelize";
import routes from "@router/.";
import handleErrors from "@middleware/handleError";

const app: Express = express();
const env = process.env;

const sequelize = new Sequelize(
  env.DB_NAME ?? "",
  env.DB_USERNAME ?? "",
  env.DB_PASS ?? "",
  {
    host: env.DB_HOST ?? "localhost",
    dialect: "mysql",
  }
);

sequelize
  .authenticate()
  .then(() => {
    // @ts-ignore
    app.use(express.json());
    app.use(routes);
  })
  .catch((err) => console.log(err));

// app.use(handleErrors);

export default app;
