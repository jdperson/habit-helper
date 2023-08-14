const User = require('./User');
const Habit = require('./Habit');
const Tip = require('./Tip');
const FriendRequest = require('./FriendRequest');

User.belongsToMany(User, {
    as: 'friends',
    through: FriendRequest,
    foreignKey: 'user_id',
    otherKey: 'friend_id'
});

User.belongsToMany(User, {
    as: 'friendOf',
    through: FriendRequest,
    foreignKey: 'friend_id',
    otherKey: 'user_id'
});



User.hasMany(Habit, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Habit.hasMany(User, {
    foreignKey: 'habit_id',
    onDelete: 'CASCADE'
});

Habit.belongsTo(User, { foreignKey: 'user_id' });



Habit.hasMany(Tip, {
    foreignKey: 'habit_id',
    onDelete: 'CASCADE'
});

Tip.belongsTo(Habit, { foreignKey: 'habit_id' });

module.exports = { User, Habit, Tip };