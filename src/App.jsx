import React from "react";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const {
    user,
    loading,
    signOut,
  } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-card">
          <div className="loading-spinner"></div>

          <h2>GYM MANAGEMENT</h2>

          <p>
            Connecting to your workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <DashboardPage
      onLogout={signOut}
      user={user}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;