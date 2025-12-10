const express = require('express');
const router = express.Router();
const healthRoutes = require('./health');
const chatRoutes = require('./chat');
const cartRoutes = require('./cart');
const wishlistRoutes = require('./wishlist');

router.use('/api', healthRoutes);
router.use('/api/chat', chatRoutes);
router.use('/api/cart', cartRoutes);
router.use('/api/wishlist', wishlistRoutes);

module.exports = router;

