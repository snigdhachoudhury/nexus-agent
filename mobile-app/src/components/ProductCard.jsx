import { ShoppingCart, Heart } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

// Product card component for mobile app
export default function ProductCard({ product }) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!product.inStock) {
      toast.error("This item is out of stock");
      return;
    }

    setIsAddingToCart(true);
    try {
      const sessionId = localStorage.getItem("nexus-session-id");
      const userId = localStorage.getItem("nexus-user-id") || "guest-user";

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

  const handleAddToWishlist = async (e) => {
    e.stopPropagation();
    
    setIsAddingToWishlist(true);
    try {
      const sessionId = localStorage.getItem("nexus-session-id");
      const userId = localStorage.getItem("nexus-user-id") || "guest-user";

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
    <div className="w-[160px] sm:w-[180px] bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex-shrink-0 border border-slate-100">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="h-24 sm:h-28 w-full object-cover rounded-t-lg"
      />
      <div className="p-3">
        <h3 className="text-xs font-semibold text-gray-900 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-sm font-bold text-blue-600 mt-1">
          ${product.price.toFixed(2)}
        </p>
        <div className="flex items-center gap-1.5 mt-2">
          <div
            className={`w-2 h-2 rounded-full ${
              product.inStock ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span
            className={`text-xs ${
              product.inStock ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1.5 mt-3">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAddingToCart}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
              product.inStock
                ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <ShoppingCart className="w-3 h-3" />
            {isAddingToCart ? "..." : "Add"}
          </button>
          <button
            onClick={handleAddToWishlist}
            disabled={isAddingToWishlist}
            className="flex items-center justify-center px-2 py-1.5 rounded-md text-xs font-medium bg-pink-50 text-pink-600 hover:bg-pink-100 active:bg-pink-200 border border-pink-200 transition-colors"
          >
            <Heart className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
