const router = require('express').Router();
const { Habit, Tip} = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', withAuth, async (req, res) => {
  try {
    const habitData = await Habit.findAll({
      include: [{ model: Tip, as: 'tip' }]
    });
    res.status(200).json(habitData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', withAuth, async (req, res) => {
  try {
    const habitData = await Habit.findByPk(req.params.id, {
      include: [{ model: Tip, as: 'tip' }]
    });

    if (!habitData) {
      res.status(404).json({ message: 'No habit found with this id!' });
      return;
    }

    res.status(200).json(habitData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', withAuth, async (req, res) => {
  try {
    const habitData = await Habit.create(req.body);
    res.status(200).json(habitData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', withAuth, async (req, res) => {
  try {
    const habitData = await Habit.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!habitData[0]) {
      res.status(404).json({ message: 'No habit with this id!' });
      return;
    }
    res.status(200).json(habitData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const habitData = await Habit.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!habitData) {
      res.status(404).json({ message: 'No habit found with this id!' });
      return;
    }

    res.status(200).json(habitData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
