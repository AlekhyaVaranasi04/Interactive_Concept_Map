import { useState, useEffect } from "react";
import Home from "./pages/home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // "login" or "register"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-700 mb-2">mindmap</h1>
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authMode === "login" ? (
      <Login
        onLoginSuccess={() => setIsAuthenticated(true)}
        onSwitchToRegister={() => setAuthMode("register")}
      />
    ) : (
      <Register
        onRegisterSuccess={() => setIsAuthenticated(true)}
        onSwitchToLogin={() => setAuthMode("login")}
      />
    );
  }

  // clear token and reload the page then flip auth state
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.location.reload();
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-100 text-black transition-colors duration-300">
      <Home onLogout={handleLogout} />
    </div>
  );
}

export default App;
