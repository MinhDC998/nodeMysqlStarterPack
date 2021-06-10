import { DataTypes } from 'sequelize';
import { sequelize } from '.';

const User = sequelize.define('User', {
    id: {
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
    },
    password: DataTypes.STRING,
    fullName: DataTypes.STRING,
    avatarUrl: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    // address: DataTypes.STRING,
});

export default User;