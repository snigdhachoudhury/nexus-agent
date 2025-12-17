import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import StandbyMode from "./pages/StandbyMode";
import ActiveMode from "./pages/ActiveMode";
import QRScanner from "./components/QRScanner";

function App() {
  const [mode, setMode] = useState("standby"); // 'standby' | 'active'
  const [session, setSession] = useState(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Listen for mock session data
  useEffect(() => {
    const handleSessionData = (e) => {
      setSession(e.detail);
      setMode("active");
    };

    window.addEventListener("mock-session-data", handleSessionData);
    return () =>
      window.removeEventListener("mock-session-data", handleSessionData);
  }, []);

  const handleQuickStart = async (query) => {
    setIsLoading(true);
    try {
      const sessionId = uuidv4();
      const userId = `kiosk-${uuidv4().substring(0, 8)}`;

      // Call the chat API to get recommendations
      const response = await fetch("http://localhost:5000/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          userId,
          message: query,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const sessionData = {
          userId,
          sessionId,
          parsedIntent: data.data.parsedIntent,
          tags: data.data.tags,
          recommendations: data.data.recommendations,
          aiResponse: data.data.aiResponse,
        };

        setSession(sessionData);
        setMode("active");
        toast.success("Recommendations loaded!");
      } else {
        toast.error("Failed to load recommendations");
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      toast.error("Connection error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanQR = () => {
    setShowQRScanner(true);
  };

  const handleScanSuccess = (sessionData) => {
    // QR code validated and session data loaded
    console.log("Session data from QR:", sessionData);
    setSession(sessionData);
    setMode("active");
    toast.success("Welcome back! Your session has been restored.");
  };

  const handleStartOver = () => {
    setMode("standby");
    setSession(null);
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {mode === "standby" ? (
          <StandbyMode 
            key="standby" 
            onScanQR={handleScanQR}
          />
        ) : (
          <ActiveMode
            key="active"
            session={session}
            onStartOver={handleStartOver}
          />
        )}
      </AnimatePresence>

      {showQRScanner && (
        <QRScanner
          onClose={() => setShowQRScanner(false)}
          onScanSuccess={handleScanSuccess}
        />
      )}

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
            fontSize: "18px",
            padding: "16px 24px",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  );
}

export default App;
