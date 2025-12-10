const express = require('express');
const Session = require('../models/Session');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const { parseUserMessage } = require('../services/contextEngine');
const { getRecommendations } = require('../services/recommendationEngine');

const router = express.Router();

// Middleware: express.json() for parsing JSON bodies
router.use(express.json());

/**
 * POST /api/chat/message
 * Handle chat messages from users
 */
router.post('/message', async (req, res) => {
  try {
    const { sessionId, userId, message } = req.body || {};

    // Validate inputs
    if (!sessionId || !userId || !message) {
      return res.status(400).json({
        success: false,
        error: 'sessionId, userId, and message are required',
      });
    }

    // Validate message is a string and not empty
    if (typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'message must be a non-empty string',
      });
    }

    // Try to find existing session by sessionId
    let session = await Session.findOne({ sessionId });

    // If not found, create new session
    if (!session) {
      session = new Session({
        sessionId,
        userId,
        conversationHistory: [],
        parsedIntent: {},
        tags: [],
        status: 'active',
      });
    }

    // Add user message to conversationHistory array
    session.conversationHistory = session.conversationHistory || [];
    session.conversationHistory.push({
      text: message,
      sender: 'user',
      timestamp: new Date(),
    });

    // Call contextEngine.parseUserMessage(message, conversationHistory)
    const parsed = parseUserMessage(message, session.conversationHistory || []);
    const parsedIntent = parsed.intent || {};
    const newTags = parsed.tags || [];

    // Update session.parsedIntent with new intent
    session.parsedIntent = parsedIntent;

    // Merge new tags with existing tags (avoid duplicates)
    const existingTags = session.tags || [];
    session.tags = Array.from(new Set([...existingTags, ...newTags]));

    // Detect cart/wishlist actions
    const action = detectAction(message);
    let actionResult = null;

    // Call recommendationEngine.getRecommendations(parsedIntent, 3)
    const recommendationsResult = await getRecommendations(parsedIntent, 3);

    // Add AI response to conversationHistory
    let aiResponseText = parsed.summary || 'Got it. I will keep this in mind.';
    
    // Handle cart/wishlist actions
    if (action.type === 'add_to_cart' && recommendationsResult.products.length > 0) {
      const product = recommendationsResult.products[0];
      actionResult = await addToCart(userId, sessionId, product.productId);
      aiResponseText = `Great! I've added "${product.name}" to your cart. ${aiResponseText}`;
    } else if (action.type === 'add_to_wishlist' && recommendationsResult.products.length > 0) {
      const product = recommendationsResult.products[0];
      actionResult = await addToWishlist(userId, sessionId, product.productId);
      aiResponseText = `Perfect! I've added "${product.name}" to your wishlist. ${aiResponseText}`;
    } else if (action.type === 'view_cart') {
      actionResult = await getCart(userId, sessionId);
      const itemCount = actionResult?.totalItems || 0;
      aiResponseText = `You have ${itemCount} item${itemCount !== 1 ? 's' : ''} in your cart.`;
    } else if (action.type === 'view_wishlist') {
      actionResult = await getWishlist(userId, sessionId);
      const itemCount = actionResult?.totalItems || 0;
      aiResponseText = `You have ${itemCount} item${itemCount !== 1 ? 's' : ''} in your wishlist.`;
    }

    session.conversationHistory.push({
      text: aiResponseText,
      sender: 'ai',
      timestamp: new Date(),
    });

    // Save session to database
    await session.save();

    // Return 200 with success response
    return res.status(200).json({
      success: true,
      data: {
        sessionId: session.sessionId,
        aiResponse: aiResponseText,
        parsedIntent: parsedIntent,
        tags: session.tags,
        recommendations: recommendationsResult.products || [],
        action: action.type !== 'none' ? { type: action.type, result: actionResult } : null,
      },
    });
  } catch (error) {
    console.error('Error in POST /api/chat/message:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

/**
 * GET /api/chat/session/:sessionId
 * Fetch session data by sessionId
 */
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'sessionId is required',
      });
    }

    // Fetch session by sessionId from database
    const session = await Session.findOne({ sessionId });

    // If not found, return 404
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    // Return 200 with session data
    return res.status(200).json({
      success: true,
      data: {
        sessionId: session.sessionId,
        userId: session.userId,
        conversationHistory: session.conversationHistory || [],
        parsedIntent: session.parsedIntent || {},
        tags: session.tags || [],
        status: session.status,
        qrCode: session.qrCode,
        qrExpiry: session.qrExpiry,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/chat/session/:sessionId:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

/**
 * DELETE /api/chat/session/:sessionId
 * Delete session from database
 */
router.delete('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'sessionId is required',
      });
    }

    // Delete session from database
    const result = await Session.deleteOne({ sessionId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    // Return 200 with success message
    return res.status(200).json({
      success: true,
      message: 'Session deleted successfully',
      data: {
        sessionId,
      },
    });
  } catch (error) {
    console.error('Error in DELETE /api/chat/session/:sessionId:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

// Helper function to detect cart/wishlist actions
function detectAction(message) {
  const text = message.toLowerCase();
  
  if (text.match(/add (to|it to|this to)? ?(my )?cart/i)) {
    return { type: 'add_to_cart' };
  }
  if (text.match(/add (to|it to|this to)? ?(my )?wishlist/i) || text.match(/save (it|this) for later/i)) {
    return { type: 'add_to_wishlist' };
  }
  if (text.match(/show (my )?cart|view (my )?cart|what'?s in (my )?cart/i)) {
    return { type: 'view_cart' };
  }
  if (text.match(/show (my )?wishlist|view (my )?wishlist|what'?s in (my )?wishlist/i)) {
    return { type: 'view_wishlist' };
  }
  
  return { type: 'none' };
}

// Helper function to add to cart
async function addToCart(userId, sessionId, productId) {
  try {
    const product = await Product.findOne({ productId });
    if (!product) return null;

    let cart = await Cart.findOne({ userId, sessionId });
    if (!cart) {
      cart = new Cart({ userId, sessionId, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        productId: product.productId,
        name: product.name,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl,
      });
    }

    await cart.save();
    return cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return null;
  }
}

// Helper function to add to wishlist
async function addToWishlist(userId, sessionId, productId) {
  try {
    const product = await Product.findOne({ productId });
    if (!product) return null;

    let wishlist = await Wishlist.findOne({ userId, sessionId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, sessionId, items: [] });
    }

    const existingItem = wishlist.items.find(item => item.productId === productId);
    if (existingItem) {
      return wishlist; // Already in wishlist
    }

    wishlist.items.push({
      productId: product.productId,
      name: product.name,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl,
      inStock: product.inStock,
    });

    await wishlist.save();
    return wishlist;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return null;
  }
}

// Helper function to get cart
async function getCart(userId, sessionId) {
  try {
    let cart = await Cart.findOne({ userId, sessionId });
    if (!cart) {
      cart = new Cart({ userId, sessionId, items: [] });
      await cart.save();
    }
    return cart;
  } catch (error) {
    console.error('Error getting cart:', error);
    return null;
  }
}

// Helper function to get wishlist
async function getWishlist(userId, sessionId) {
  try {
    let wishlist = await Wishlist.findOne({ userId, sessionId });
    if (!wishlist) {
      wishlist = new Wishlist({ userId, sessionId, items: [] });
      await wishlist.save();
    }
    return wishlist;
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return null;
  }
}

module.exports = router;
