const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const router = express.Router();

// Middleware: express.json() for parsing JSON bodies
router.use(express.json());

/**
 * GET /api/cart/:userId/:sessionId
 * Get cart for a user session
 */
router.get('/:userId/:sessionId', async (req, res) => {
  try {
    const { userId, sessionId } = req.params;

    if (!userId || !sessionId) {
      return res.status(400).json({
        success: false,
        error: 'userId and sessionId are required',
      });
    }

    let cart = await Cart.findOne({ userId, sessionId });

    if (!cart) {
      cart = new Cart({
        userId,
        sessionId,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      });
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    console.error('Error in GET /api/cart:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

/**
 * POST /api/cart/add
 * Add item to cart
 */
router.post('/add', async (req, res) => {
  try {
    const { userId, sessionId, productId, quantity = 1, size, color } = req.body;

    if (!userId || !sessionId || !productId) {
      return res.status(400).json({
        success: false,
        error: 'userId, sessionId, and productId are required',
      });
    }

    // Get product details
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId, sessionId });
    if (!cart) {
      cart = new Cart({ userId, sessionId, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId === productId && item.size === size && item.color === color
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId: product.productId,
        name: product.name,
        price: product.price,
        quantity,
        size,
        color,
        imageUrl: product.imageUrl,
        addedAt: new Date(),
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart,
    });
  } catch (error) {
    console.error('Error in POST /api/cart/add:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

/**
 * PUT /api/cart/update
 * Update item quantity in cart
 */
router.put('/update', async (req, res) => {
  try {
    const { userId, sessionId, productId, quantity, size, color } = req.body;

    if (!userId || !sessionId || !productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        error: 'userId, sessionId, productId, and quantity are required',
      });
    }

    const cart = await Cart.findOne({ userId, sessionId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId === productId && item.size === size && item.color === color
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart',
      });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: cart,
    });
  } catch (error) {
    console.error('Error in PUT /api/cart/update:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

/**
 * DELETE /api/cart/remove
 * Remove item from cart
 */
router.delete('/remove', async (req, res) => {
  try {
    const { userId, sessionId, productId, size, color } = req.body;

    if (!userId || !sessionId || !productId) {
      return res.status(400).json({
        success: false,
        error: 'userId, sessionId, and productId are required',
      });
    }

    const cart = await Cart.findOne({ userId, sessionId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found',
      });
    }

    cart.items = cart.items.filter(
      item => !(item.productId === productId && item.size === size && item.color === color)
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cart,
    });
  } catch (error) {
    console.error('Error in DELETE /api/cart/remove:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

/**
 * DELETE /api/cart/clear/:userId/:sessionId
 * Clear entire cart
 */
router.delete('/clear/:userId/:sessionId', async (req, res) => {
  try {
    const { userId, sessionId } = req.params;

    if (!userId || !sessionId) {
      return res.status(400).json({
        success: false,
        error: 'userId and sessionId are required',
      });
    }

    const cart = await Cart.findOne({ userId, sessionId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found',
      });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: cart,
    });
  } catch (error) {
    console.error('Error in DELETE /api/cart/clear:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

module.exports = router;
