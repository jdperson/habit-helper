const router = require('express').Router();
const { Tip, Habit } = require('../../models');
const withAuth = require('../../utils/auth');


router.put('/:id', withAuth, async (req, res) => {
  try {
    const tipData = await Tip.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!tipData[0]) {
      res.status(404).json({ message: 'No tip with this id!' });
      return;
    }
    res.status(200).json(tipData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const tipData = await Tip.destroy({
      where: {
        id: req.params.id
      }
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