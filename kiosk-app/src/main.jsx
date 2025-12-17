import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AdminApp from "./AdminApp.jsx";
import "./index.css";

// Check URL parameter to determine which app to load
const urlParams = new URLSearchParams(window.location.search);
const isAdmin = urlParams.get('mode') === 'admin';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isAdmin ? <AdminApp /> : <App />}
  </React.StrictMode>
);
