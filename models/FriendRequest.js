const { Model, DataTypes } = require("sequilize");
const sequelize = require("../config/connection");

class FriendRequest extends Model {};

FriendRequest.init(
    {
        status: {
            type: DataTypes.ENUM("pending", "accepted"),
            allowNull: false,
            defaultValue: "pending"
        }
    },
    {
        sequelize,
        timestamps: true,
        freezeTableName: true,
        underscored: true,
        modelName: "friend_request"
    }
);

module.exports = FriendRequest;