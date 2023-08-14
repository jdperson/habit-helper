const router = require('express').Router();
const { Tip, Habit } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', withAuth,  async (req, res) => {
  try {
    const tipData = await Tip.findAll({
      include: [{ model: Habit, as: 'habit' }]
    });
    res.status(200).json(tipData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', withAuth, async (req, res) => {
  try {
    const tipData = await Tip.findByPk(req.params.id, {
      include: [{ model: Habit, as: 'habit' }]
    });

    if (!tipData) {
      res.status(404).json({ message: 'No tip found with this id!' });
      return;
    }

    res.status(200).json(tipData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;