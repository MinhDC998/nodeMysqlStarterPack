import { DataTypes } from 'sequelize';
import { sequelize } from '.';
import User from './user';

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
})

Role.hasMany(User, { foreignKey: 'roleId', as: 'userRoles' });

export default Role;