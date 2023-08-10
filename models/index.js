const User = require("./User");
const Habit = require("./Habit");
const Tip = reqauire("./Tip");

User.belongsToMany(User, {
    as: "friends",
    foreignKey: "user_id",
    otherKey: "friend_id"
});

User.hasMany(Habit);

Habit.belongsTo(User);

Habit.hasMany(Tip);

Tip.belongsTo(Habit);

module.exports = User;