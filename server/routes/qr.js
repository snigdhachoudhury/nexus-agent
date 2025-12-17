const express = require('express');
const { generateQR, validateQR, expireQR } = require('../services/qrService');
const Session = require('../models/Session');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

const router = express.Router();

/**
 * POST /api/qr/generate
 * Generate a QR code for a session
 */
router.post('/generate', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'sessionId is required',
      });
    }

    // Verify session exists
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Session not found',
      });
    }

    // Generate QR code
    const qrData = await generateQR(sessionId);

    // Update session with QR code data
    session.qrCode = qrData.qrId;
    session.qrExpiry = qrData.expiresAt;
    await session.save();

    return res.status(200).json({
      success: true,
      data: {
        qrId: qrData.qrId,
        qrImage: qrData.qrImage,
        expiresAt: qrData.expiresAt,
        signature: qrData.signature,
      },
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

/**
 * POST /api/qr/validate
 * Validate a QR code (Demo mode: accepts any code)
 */
router.post('/validate', async (req, res) => {
  try {
    const { qrId, signature } = req.body;

    if (!qrId || !signature) {
      return res.status(400).json({
        success: false,
        error: 'qrId and signature are required',
      });
    }

    // DEMO MODE: Accept any code and return mock session data
    const { v4: uuidv4 } = require('uuid');
    const mockSessionId = uuidv4();
    const mockUserId = `demo-user-${qrId.substring(0, 4)}`;

    // Get some sample products for demo
    const { getRecommendations } = require('../services/recommendationEngine');
    const demoIntent = {
      occasion: 'wedding',
      category: 'formal',
      style: 'elegant',
      season: 'spring',
      budget: 500,
      priceRange: 'mid-high',
      gender: 'unisex'
    };
    const recommendationsResult = await getRecommendations(demoIntent, 8);
    const recommendations = recommendationsResult.products || [];

    return res.status(200).json({
      success: true,
      data: {
        sessionId: mockSessionId,
        userId: mockUserId,
        parsedIntent: demoIntent,
        tags: ['wedding', 'formal', 'elegant', 'spring'],
        conversationHistory: [
          { sender: 'user', message: 'I need a wedding dress', timestamp: new Date() },
          { sender: 'ai', message: 'I found some great formal options for your wedding! Here are my top picks:', timestamp: new Date() }
        ],
        recommendations: recommendations,
        cart: null,
        wishlist: null,
      },
    });
  } catch (error) {
    console.error('Error validating QR code:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

/**
 * DELETE /api/qr/:qrId
 * Expire a QR code immediately
 */
router.delete('/:qrId', async (req, res) => {
  try {
    const { qrId } = req.params;

    if (!qrId) {
      return res.status(400).json({
        success: false,
        error: 'qrId is required',
      });
    }

    const deleted = await expireQR(qrId);

    return res.status(200).json({
      success: true,
      message: deleted ? 'QR code expired successfully' : 'QR code not found',
      data: {
        qrId,
        deleted,
      },
    });
  } catch (error) {
    console.error('Error expiring QR code:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error',
    });
  }
});

module.exports = router;

