import { MapPin, Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useState } from "react";

export default function ProductCard({ product, index }) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  const handleTryOn = () => {
    toast.success("Associate notified! Someone will be with you shortly.");
  };

  const handleAddToCart = async () => {
    if (!product.inStock) {
      toast.error("This item is out of stock");
      return;
    }

    setIsAddingToCart(true);
    try {
      const sessionId = localStorage.getItem("nexus-session-id");
      const userId = localStorage.getItem("nexus-user-id") || "kiosk-user";

      const response = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          sessionId,
          productId: product.productId,
        }),
      });

      if (response.ok) {
        toast.success(`Added ${product.name} to cart!`);
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    setIsAddingToWishlist(true);
    try {
      const sessionId = localStorage.getItem("nexus-session-id");
      const userId = localStorage.getItem("nexus-user-id") || "kiosk-user";

      const response = await fetch("http://localhost:5000/api/wishlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          sessionId,
          productId: product.productId,
        }),
      });

      if (response.ok) {
        toast.success(`Added ${product.name} to wishlist!`);
      } else {
        toast.error("Failed to add to wishlist");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist");
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -8 }}
      className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden flex flex-col border-2 border-gray-100 hover:border-blue-300 transform transition-all duration-500 hover:shadow-blue-500/20"
    >
      {/* Image Section with Gradient Overlay */}
      <div className="relative h-48 sm:h-56 lg:h-64 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        {/* Stock Badge - Modern Pill */}
        <div className="absolute top-4 right-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl shadow-lg ${
              product.inStock 
                ? "bg-green-500/90 text-white" 
                : "bg-red-500/90 text-white"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-white" : "bg-white"} animate-pulse`}></div>
            <span className="text-sm font-bold">
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
        
        {/* Price Tag - Floating */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-xl border-2 border-blue-200">
            <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ${product.price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Info Section - Modern Glass Card */}
      <div className="flex-1 p-4 sm:p-5 lg:p-6 flex flex-col justify-between bg-gradient-to-br from-white to-gray-50">
        <div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight mb-2">
            {product.name}
          </h3>
          
          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg text-gray-700 mb-3">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-sm">Aisle {product.aisle}</span>
          </div>

          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-2">
            {product.explanation}
          </p>
        </div>

        {/* Action Buttons - Enhanced */}
        <div className="mt-6 sm:mt-7 lg:mt-8 flex flex-col gap-3">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAddingToCart}
            className="group relative h-16 sm:h-18 lg:h-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg sm:text-xl lg:text-2xl font-bold rounded-2xl flex items-center justify-center gap-3 hover:from-blue-700 hover:to-purple-700 active:scale-95 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" />
            <span className="relative z-10">{isAddingToCart ? "Adding..." : "Add to Cart"}</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleWishlist}
              disabled={isAddingToWishlist}
              className="flex-1 h-11 sm:h-12 bg-white border-2 border-pink-500 text-pink-600 text-sm sm:text-base font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-pink-50 hover:border-pink-600 active:scale-95 transition-all duration-200 shadow-md disabled:opacity-50"
            >
              <Heart className="w-4 h-4" />
              <span>{isAddingToWishlist ? "Saving..." : "Wishlist"}</span>
            </button>
            <button
              onClick={handleTryOn}
              disabled={!product.inStock}
              className="flex-1 h-11 sm:h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm sm:text-base font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 active:scale-95 transition-all duration-300 shadow-md hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Try-On
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
