import express, { Express } from "express";
import { Sequelize } from "sequelize";
import cors from "cors";
import path from "path";

import routes from "@router/.";
import handleErrors from "@middleware/handleError";

const app: Express = express();
const env = process.env;

const sequelize = new Sequelize(
  env.DB_NAME ?? "",
  env.DB_USERNAME ?? "",
  env.DB_PASSWORD ?? "",
  {
    host: env.DB_HOST ?? "localhost",
    dialect: "mysql",
  }
);

sequelize
  .authenticate()
  .then(() => {
    app.use(
      cors({
        origin: "*",
      })
    );

    console.log(path.join(__dirname, "./public"));

    // @ts-ignore
    app.use(express.json());
    app.use("/api", routes);
    app.use("/public", express.static(path.join(__dirname, "../public")));
  })
  .catch((err) => console.log(err));

// app.use(handleErrors);

export default app;
