const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Tip extends Model {};

Tip.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        habit_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'habit',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        uderscored: true,
        modelName: 'tip'
    }
);

module.exports = Tip;