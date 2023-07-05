// import { DataTypes, Model, BuildOptions, Optional } from 'sequelize';
// import { sequelize } from '.';
// import User from '@models/user';
// import { IRole } from '@components/role/role.types';

// interface RoleInstance extends Model<Optional<IRole, 'id'>>, IRole {}

// type RoleModelStatic = typeof Model & {
//   new (values?: object, options?: BuildOptions): RoleInstance;
// };

// const Role = sequelize.define('Role', {
//   id: {
//     type: DataTypes.INTEGER,
//     allowNull: false,
//     unique: true,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   name: {
//     type: DataTypes.STRING,
//     allowNull: true,
//   }
// }, { timestamp: true }) as RoleModelStatic;

// Role.hasMany(User, { foreignKey: 'roleId', as: 'userRoles' });

// export default Role;
