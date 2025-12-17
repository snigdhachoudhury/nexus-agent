import { useState, useEffect, useRef } from "react";
import { Bell, RotateCcw, MapPin, Sparkles, ShoppingBag, Tag, MessageCircle, ShoppingCart, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import ProductCard from "../components/ProductCard";
import { mockSession } from "../services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ActiveMode({ session = mockSession, onStartOver }) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [timeoutCountdown, setTimeoutCountdown] = useState(30);
  const lastInteractionRef = useRef(Date.now());
  const timeoutTimerRef = useRef(null);
  const warningTimerRef = useRef(null);

  const hasConversationHistory = session?.conversationHistory && session.conversationHistory.length > 0;
  const hasCart = session?.cart && session.cart.items && session.cart.items.length > 0;
  const hasWishlist = session?.wishlist && session.wishlist.items && session.wishlist.items.length > 0;

  // Auto-timeout logic
  useEffect(() => {
    const checkInactivity = () => {
      const timeSinceLastInteraction = Date.now() - lastInteractionRef.current;
      const twoMinutes = 2 * 60 * 1000;

      if (timeSinceLastInteraction >= twoMinutes && !showTimeoutWarning) {
        setShowTimeoutWarning(true);
        setTimeoutCountdown(30);

        // Countdown to auto-return
        const countdownInterval = setInterval(() => {
          setTimeoutCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              handleForceStartOver();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        warningTimerRef.current = countdownInterval;
      }
    };

    timeoutTimerRef.current = setInterval(checkInactivity, 1000);

    // Track user interactions
    const updateInteraction = () => {
      lastInteractionRef.current = Date.now();
      if (showTimeoutWarning) {
        setShowTimeoutWarning(false);
        if (warningTimerRef.current) {
          clearInterval(warningTimerRef.current);
        }
      }
    };

    window.addEventListener("click", updateInteraction);
    window.addEventListener("keydown", updateInteraction);
    window.addEventListener("touchstart", updateInteraction);

    return () => {
      if (timeoutTimerRef.current) clearInterval(timeoutTimerRef.current);
      if (warningTimerRef.current) clearInterval(warningTimerRef.current);
      window.removeEventListener("click", updateInteraction);
      window.removeEventListener("keydown", updateInteraction);
      window.removeEventListener("touchstart", updateInteraction);
    };
  }, [showTimeoutWarning]);

  const handleCallAssociate = () => {
    lastInteractionRef.current = Date.now();
    toast.success("Calling associate...");
  };

  const handleStartOver = () => {
    lastInteractionRef.current = Date.now();
    setShowConfirmDialog(true);
  };

  const handleConfirmStartOver = () => {
    setShowConfirmDialog(false);
    onStartOver();
  };

  const handleForceStartOver = () => {
    setShowTimeoutWarning(false);
    onStartOver();
  };

  const getOccasionEmoji = (occasion) => {
    const emojis = {
      wedding: "💒",
      casual: "👕",
      formal: "👔",
      party: "🎉",
    };
    return emojis[occasion] || "🛍️";
  };

  const getStyleEmoji = (style) => {
    const emojis = {
      formal: "👔",
      casual: "👕",
      sporty: "🏃",
    };
    return emojis[style] || "👔";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen h-screen overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-100"
    >
      {/* Modern Header with branding */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">NEXUS</h1>
                <p className="text-sm text-slate-500">AI Shopping Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {hasConversationHistory && (
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setShowChatHistory(true)}
                  className="gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat History
                </Button>
              )}
              {(hasCart || hasWishlist) && (
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => setShowCart(true)}
                  className="gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  My Cart ({(session.cart?.totalItems || 0) + (session.wishlist?.totalItems || 0)})
                </Button>
              )}
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleStartOver}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Start Over
              </Button>
              <Button 
                size="lg"
                onClick={handleCallAssociate}
                className="bg-green-600 hover:bg-green-700 gap-2"
              >
                <Bell className="w-4 h-4" />
                Call Associate
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 pb-20">
        {/* Welcome Banner & Session Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Welcome Banner */}
          <Card className="lg:col-span-2 border-0 bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-3">
                <ShoppingBag className="w-8 h-8" />
                <h2 className="text-3xl font-bold">Welcome back!</h2>
              </div>
              <p className="text-lg text-white/90">
                We've curated these perfect recommendations just for your {session.parsedIntent?.occasion || "occasion"}.
              </p>
            </CardContent>
          </Card>

          {/* Session Summary Card */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Tag className="w-5 h-5" />
                Session Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Occasion:</span>
                  <Badge variant="secondary" className="gap-1">
                    {getOccasionEmoji(session.parsedIntent?.occasion)}
                    {session.parsedIntent?.occasion || "N/A"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Style:</span>
                  <Badge variant="secondary" className="gap-1">
                    {getStyleEmoji(session.parsedIntent?.style)}
                    {session.parsedIntent?.style || "N/A"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Season:</span>
                  <Badge variant="secondary" className="gap-1">
                    ☀️ {session.parsedIntent?.season || "N/A"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Budget:</span>
                  <Badge variant="secondary" className="gap-1">
                    💰 ${session.parsedIntent?.budget || 0}
                  </Badge>
                </div>
              </div>
              
              {/* Tags */}
              {session.tags && session.tags.length > 0 && (
                <div className="pt-3 border-t border-slate-200">
                  <p className="text-xs text-slate-500 mb-2">Preferences</p>
                  <div className="flex flex-wrap gap-1.5">
                    {session.tags.map((tag, index) => (
                      <Badge 
                        key={index}
                        variant="outline"
                        className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommendations Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-slate-900">Recommended For You</h2>
            <p className="text-slate-600">
              {session.recommendations?.length || 0} perfect matches
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {session.recommendations?.map((product, index) => (
              <motion.div
                key={product.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} index={index} />
              </motion.div>
            ))}
          </div>

          {/* Browse More Categories */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">
              Looking for something else?
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Party Wear", icon: "🎉" },
                { label: "Business", icon: "👔" },
                { label: "Casual", icon: "👕" },
                { label: "Sportswear", icon: "⚽" },
              ].map((cat, idx) => (
                <button
                  key={idx}
                  onClick={handleStartOver}
                  className="bg-white rounded-lg p-4 text-center hover:shadow-lg hover:scale-105 transition-all duration-200 border border-blue-200"
                >
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <div className="text-sm font-semibold text-slate-700">{cat.label}</div>
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-slate-600 mt-4">
              Click "Start Over" above to browse different categories
            </p>
          </div>
        </div>
      </div>

      {/* Confirm Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowConfirmDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 max-w-md w-full mx-4 shadow-2xl"
            >
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Return to Home?
              </h3>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8">
                Are you sure you want to return to the welcome screen?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 bg-gray-200 text-gray-800 font-semibold rounded-lg sm:rounded-xl py-3 sm:py-4 text-base sm:text-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmStartOver}
                  className="flex-1 bg-blue-600 text-white font-semibold rounded-lg sm:rounded-xl py-3 sm:py-4 text-base sm:text-lg hover:bg-blue-700 transition"
                >
                  Yes, Start Over
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeout Warning */}
      <AnimatePresence>
        {showTimeoutWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 max-w-md w-full mx-4 shadow-2xl text-center"
            >
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Still shopping?
              </h3>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-4 sm:mb-6">
                Returning to home in {timeoutCountdown} seconds...
              </p>
              <button
                onClick={() => {
                  lastInteractionRef.current = Date.now();
                  setShowTimeoutWarning(false);
                  if (warningTimerRef.current) {
                    clearInterval(warningTimerRef.current);
                  }
                }}
                className="bg-blue-600 text-white font-semibold rounded-lg sm:rounded-xl py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg lg:text-xl hover:bg-blue-700 transition"
              >
                Continue Shopping
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat History Modal */}
      <AnimatePresence>
        {showChatHistory && hasConversationHistory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowChatHistory(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  Your Conversation
                </h3>
                <button onClick={() => setShowChatHistory(false)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              <div className="space-y-3">
                {session.conversationHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-blue-100 ml-8'
                        : 'bg-gray-100 mr-8'
                    }`}
                  >
                    <p className="text-sm font-semibold mb-1">
                      {msg.sender === 'user' ? 'You' : 'NEXUS AI'}
                    </p>
                    <p className="text-gray-800">{msg.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart/Wishlist Modal */}
      <AnimatePresence>
        {showCart && (hasCart || hasWishlist) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCart(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6" />
                  Your Cart & Wishlist
                </h3>
                <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              
              {hasCart && (
                <div className="mb-6">
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Shopping Cart ({session.cart.totalItems} items)
                  </h4>
                  <div className="space-y-2">
                    {session.cart.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.imageUrl || 'https://via.placeholder.com/60'}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-blue-600">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${session.cart.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              {hasWishlist && (
                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Wishlist ({session.wishlist.totalItems} items)
                  </h4>
                  <div className="space-y-2">
                    {session.wishlist.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 bg-pink-50 rounded-lg">
                        <img
                          src={item.imageUrl || 'https://via.placeholder.com/60'}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-600">{item.category}</p>
                        </div>
                        <p className="font-bold text-pink-600">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowCart(false)}
                className="mt-6 w-full bg-blue-600 text-white font-semibold rounded-lg py-3 hover:bg-blue-700 transition"
              >
                Continue Shopping
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
