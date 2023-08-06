import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";

const db: any = {};
const basename = path.basename(__filename);

const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST, ENV } = process.env;

const sequelize = new Sequelize(
  DB_NAME || "",
  DB_USERNAME || "",
  DB_PASSWORD || "",
  { dialect: "mysql", host: DB_HOST ?? "localhost" }
);

const fileType = ENV === "prod" ? ".js" : ".ts";

fs.readdirSync(__dirname)
  .filter((file: any) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === fileType
    );
  })
  .forEach((file: any) => {
    const model = require(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName: any) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export { sequelize, Sequelize };
