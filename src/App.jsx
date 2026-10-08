import React, { useState } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  function handleLogin(userData) {
    console.log("Login successful:", userData);
    setLoggedIn(true);
  }

  function handleLogout() {
    setLoggedIn(false);
  }

  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <DashboardPage onLogout={handleLogout} />;
}

export default App;