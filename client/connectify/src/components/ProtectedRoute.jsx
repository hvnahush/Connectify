import { Navigate } from "react-router-dom";
import React from "react";
export default function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem("token");

  if (!token) {
    // Not logged in, redirect to home
    return <Navigate to="/" replace />;
  }

  // Logged in, render the child component (feed or profile)
  return children;
}
