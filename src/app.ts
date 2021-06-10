import express from 'express';
import { Sequelize } from 'sequelize';
import { createTestRole } from './components/role/role.controller';

const app = express();
const env = process.env;

const sequelize = new Sequelize(env.DB_NAME ?? '', env.DB_USERNAME ?? '',  env.DB_PASS ?? '', {
    host:  env.DB_HOST ?? 'localhost',
    dialect: 'mysql'
});

app.get('/', createTestRole)

sequelize.authenticate().then(res => {
    console.log(res)
}).catch(err => console.log(err));

export default app;