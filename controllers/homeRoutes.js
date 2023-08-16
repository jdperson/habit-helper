const router = require('express').Router();
const { Habit, Tip, User } = require('../models');
const withAuth = require('../utils/auth');
const sequelize = require('../config/connection');

router.get('/', (req, res) => {
  res.render('homepage');
});

router.get('/profile', async (req, res) => {
  try {
    const habitData = await Habit.findAll({
      include: [{ model: Tip, as: 'tips' }]
    });
    const habits = habitData.map((habit) => habit.get({ plain: true }));

    res.render('profile', { 
      habits, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/profile/:id', async (req, res) => {
  try {
    const habitData = await Habit.findByPk(req.params.id, {
      include: [{ model: Tip, as: 'tips' }]
    });

    const habit = habitData.map((habit) => habit.get({ plain: true }));

    res.render('profile', { 
      habit, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});


module.exports = router;