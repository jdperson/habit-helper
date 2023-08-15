const router = require('express').Router();
const userRoutes = require('./user-routes');
const habitRoutes = require('./habit-routes');
const tipRoutes = require('./tip-routes');
const friendRequestRoutes = require('./friendRequest-routes');

router.use('/users', userRoutes);
router.use('/habit', habitRoutes);
router.use('/tip', tipRoutes);
router.use('./friendRequest', friendRequestRoutes);

module.exports = router;
