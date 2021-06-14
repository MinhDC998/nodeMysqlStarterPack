import { DataTypes } from 'sequelize';
import { sequelize } from '.';
import User from '@models/user';

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
    allowNull: true,
  }
}, { timestamp: true })

Role.hasMany(User, { foreignKey: 'roleId', as: 'userRoles' });

export default Role;