const sequelize = require('../config/connection');
const { User, Habit, Tip } = require('../models');

const userData = require('./userData.json');
const habitData = require('./habitData.json');
const tipData = require('./tipData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
await Habit.bulkCreate(habitData);
await Tip.bulkCreate(tipData);


  

  process.exit(0);
};

seedDatabase();