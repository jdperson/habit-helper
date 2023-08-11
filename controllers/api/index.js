const router = require('express').Router();
const userRoutes = require('./user-routes');
const habitRoutes = require('./habit-routes');
const tipRoutes = require('./tip-routes');

router.use('/user', userRoutes);
router.use('/habit', habitRoutes);
router.use('/tip', tipRoutes);

module.exports = router;
