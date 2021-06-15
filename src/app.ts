import express from 'express';
import { Sequelize } from 'sequelize';
import { createTestRole } from '@components/role/role.controller';
import handeError from '@middleware/handleError';

const app = express();
const env = process.env;

const sequelize = new Sequelize(env.DB_NAME ?? '', env.DB_USERNAME ?? '',  env.DB_PASS ?? '', {
    host:  env.DB_HOST ?? 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate().then(res => {
    app.get('/', createTestRole);
    app.use(handeError);
}).catch(err => console.log(err));

export default app;