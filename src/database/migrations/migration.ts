console.log(1);

import { sequelize } from "@models/.";

sequelize
  .sync({ alter: true })
  .then((res: any) => res)
  .catch((err: any) => console.log(err));
