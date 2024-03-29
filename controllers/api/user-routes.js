const router = require('express').Router();
const User = require('../../models/User');

router.get('/', async (req, res) => {
  const userData = await User.findAll();
  res.status(200).json(userData);
})

router.post('/', async (req, res) => {
  console.log(req.body);
  try {
    const userData = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    // const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});


router.get('/:id', async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id, {
      include: [{ model: User, as: 'user' }]
    });

    res.json(200).json(userData);
  } catch (err) {
    res.json(404).json({ message: 'User not found' });
  }
});

router.get('/:username', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { username: req.params.username }});

    res.json(200).json(userData);
  } catch (err) {
    res.json(404).json({ message: 'User not found' });
  }
});



module.exports = router;
