const express = require('express');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

const router = express.Router();

// Middleware: express.json() for parsing JSON bodies
router.use(express.json());

/**
 * GET /api/wishlist/:userId/:sessionId
 * Get wishlist for a user session
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

    let wishlist = await Wishlist.findOne({ userId, sessionId });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId,
        sessionId,
        items: [],
        totalItems: 0,
      });
      await wishlist.save();
    }

    return res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    console.error('Error in GET /api/wishlist:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

/**
 * POST /api/wishlist/add
 * Add item to wishlist
 */
router.post('/add', async (req, res) => {
  try {
    const { userId, sessionId, productId, notes } = req.body;

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

    // Find or create wishlist
    let wishlist = await Wishlist.findOne({ userId, sessionId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, sessionId, items: [] });
    }

    // Check if item already exists
    const existingItem = wishlist.items.find(item => item.productId === productId);
    if (existingItem) {
      return res.status(400).json({
        success: false,
        error: 'Item already in wishlist',
      });
    }

    // Add new item
    wishlist.items.push({
      productId: product.productId,
      name: product.name,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      inStock: product.inStock,
      notes,
      addedAt: new Date(),
    });

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: 'Item added to wishlist',
      data: wishlist,
    });
  } catch (error) {
    console.error('Error in POST /api/wishlist/add:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

/**
 * DELETE /api/wishlist/remove
 * Remove item from wishlist
 */
router.delete('/remove', async (req, res) => {
  try {
    const { userId, sessionId, productId } = req.body;

    if (!userId || !sessionId || !productId) {
      return res.status(400).json({
        success: false,
        error: 'userId, sessionId, and productId are required',
      });
    }

    const wishlist = await Wishlist.findOne({ userId, sessionId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        error: 'Wishlist not found',
      });
    }

    wishlist.items = wishlist.items.filter(item => item.productId !== productId);
    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: 'Item removed from wishlist',
      data: wishlist,
    });
  } catch (error) {
    console.error('Error in DELETE /api/wishlist/remove:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

/**
 * DELETE /api/wishlist/clear/:userId/:sessionId
 * Clear entire wishlist
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

    const wishlist = await Wishlist.findOne({ userId, sessionId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        error: 'Wishlist not found',
      });
    }

    wishlist.items = [];
    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: 'Wishlist cleared',
      data: wishlist,
    });
  } catch (error) {
    console.error('Error in DELETE /api/wishlist/clear:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

/**
 * GET /api/wishlist/all
 * Get all wishlists (for kiosk dashboard)
 */
router.get('/all', async (req, res) => {
  try {
    const wishlists = await Wishlist.find({ items: { $exists: true, $not: { $size: 0 } } })
      .sort({ updatedAt: -1 })
      .limit(50);

    // Populate full product details for each item
    const enrichedWishlists = await Promise.all(
      wishlists.map(async (wishlist) => {
        const enrichedItems = await Promise.all(
          wishlist.items.map(async (item) => {
            const product = await Product.findOne({ productId: item.productId });
            return {
              ...item.toObject(),
              category: product?.category,
              aisle: product?.aisle,
              inStock: product?.inStock,
            };
          })
        );
        return {
          ...wishlist.toObject(),
          items: enrichedItems,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: enrichedWishlists,
    });
  } catch (error) {
    console.error('Error in GET /api/wishlist/all:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

module.exports = router;
