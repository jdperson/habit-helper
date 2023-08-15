const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class User extends Model {};

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { len: [8] }
        },
        habit_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'habit',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.ENUM('offline', 'online'),
            allowNull: false,
            defaultValue: 'offline'
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        uderscored: true,
        modelName: 'user'
    }
);

module.exports = User;