const router = require('express').Router();
const { Habit, Tip, User } = require('../models');
const withAuth = require('../utils/auth');
const sequelize = require('../config/connection');

router.get('/', (req, res) => {
  res.render('homepage');
});

router.get('/profile/', withAuth, async (req, res) => {
  try {
    const habitData = await Habit.findAll({
      include: [{ model: Tip, as: 'tip' }]
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

router.get('/profile/:id', withAuth, async (req, res) => {
  try {
    const habitData = await Habit.findByPk(req.params.id, {
      include: [{ model: Tip, as: 'tip' }]
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

router.get('/profile/', withAuth,  async (req, res) => {
  try {
    const tipData = await Tip.findAll({
      include: [{ model: Habit, as: 'habit' }]
    });
    const tips = tipData.map((habit) => tip.get({ plain: true }));

    res.render('profile', { 
      tips, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/profile/:id', withAuth, async (req, res) => {
  try {
    const tipData = await Tip.findByPk(req.params.id, {
      include: [{ model: Habit, as: 'habit' }]
    });

    const tip = tipData.map((habit) => tip.get({ plain: true }));

    res.render('profile', { 
      tip, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Tip, as: 'tip' },
        { model: Habit, as: 'habit'}
      ],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get('/login', (req, res) => {
  res.render('login');
});


module.exports = router;