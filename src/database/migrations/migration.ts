import { sequelize } from '../models/index';

sequelize.sync({ alter: true }).then((res: any) => res).catch((err: any) => console.log(err));