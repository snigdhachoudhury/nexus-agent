import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Send, User, Package, QrCode, Sparkles, ShoppingBag } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { mockEmit } from "../services/socket";
import ProductCard from "../components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatPage() {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // Initialize session ID
  useEffect(() => {
    let id = localStorage.getItem("nexus-session-id");
    if (!id) {
      id = uuidv4();
      localStorage.setItem("nexus-session-id", id);
    }
    setSessionId(id);
  }, []);

  // Listen for mock AI responses
  useEffect(() => {
    const handleAIResponse = (e) => {
      const response = e.detail;
      setIsTyping(false);

      const aiMessage = {
        id: uuidv4(),
        role: "ai",
        text: response.message,
        timestamp: new Date(),
        recommendations: response.recommendations || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
      toast.success("AI responded!");
    };

    window.addEventListener("mock-ai-response", handleAIResponse);
    return () =>
      window.removeEventListener("mock-ai-response", handleAIResponse);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputText.trim() || isTyping) return;

    const userMessage = {
      id: uuidv4(),
      role: "user",
      text: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Mock emit
    mockEmit("mobile:message", {
      sessionId,
      message: inputText.trim(),
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleGenerateQR = () => {
    mockEmit("mobile:generateQR", { sessionId });
    navigate("/qr");
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Modern Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-lg border-b border-slate-200/60 flex items-center justify-between px-4 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">NEXUS</h1>
            <p className="text-xs text-slate-500">AI Shopping Assistant</p>
          </div>
        </div>
        
        <Avatar>
          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100">
            <User className="w-5 h-5 text-blue-600" />
          </AvatarFallback>
        </Avatar>
      </header>

      {/* Messages Area with improved design */}
      <ScrollArea className="flex-1 mt-16 mb-20">
        <div className="px-4 py-6 space-y-4 max-w-4xl mx-auto">
          {messages.length === 0 && !isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-[calc(100vh-16rem)] text-center"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to NEXUS</h2>
              <p className="text-slate-600 max-w-md">
                Your AI-powered shopping assistant. Tell me what you're looking for and I'll help you find the perfect products.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {["Wedding dress", "Casual outfit", "Formal wear"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInputText(suggestion)}
                    className="px-4 py-2 rounded-full bg-white border border-slate-200 text-sm text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] ${
                    msg.role === "user" ? "items-end" : "items-start"
                  } flex flex-col gap-1`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                        : "bg-white border border-slate-200 text-slate-800"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-xs text-slate-400 px-2">
                    {formatTime(msg.timestamp)}
                  </span>

                  {/* Product Recommendations with improved cards */}
                  {msg.recommendations && msg.recommendations.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex gap-3 overflow-x-auto pb-2 pt-2 w-full scrollbar-hide -mx-2 px-2"
                    >
                      {msg.recommendations.map((product) => (
                        <ProductCard key={product.productId} product={product} />
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator with animation */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm inline-flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                      animate={{
                        y: [-2, 2, -2],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500">AI is thinking...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* FAB - Transfer to Store with improved design */}
      <AnimatePresence>
        {messages.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-4 z-30"
          >
            <Button
              onClick={handleGenerateQR}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-full px-5 py-6 shadow-xl flex items-center gap-2 text-white font-semibold"
            >
              <QrCode className="w-5 h-5" />
              <span>Transfer to Store</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area with modern design */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200/60 px-4 py-3 z-40">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe what you're looking for..."
            disabled={isTyping}
            className="flex-1 px-4 py-3 rounded-full bg-slate-100 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none text-sm placeholder-slate-400 disabled:opacity-50"
          />
          <Button
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            size="icon"
            className="rounded-full w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
