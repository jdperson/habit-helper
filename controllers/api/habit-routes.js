const router = require('express').Router();
const { Habit, Tip} = require('../../models');
const withAuth = require('../../utils/auth');


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
