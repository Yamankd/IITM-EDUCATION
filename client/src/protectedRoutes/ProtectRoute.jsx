import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";

const ProtectRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    api
      .get("/auth-check")
      .then(() => {
        setAuthorized(true);
      })
      .catch((err) => {
        // Just set authorized to false.
        // The return statement below will handle the redirection to login.
        setAuthorized(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  // If authorized, show the protected page (children).
  // If NOT authorized, redirect to the login page.
  return authorized ? children : <Navigate to="/admin/loginpage" replace />;
};

export default ProtectRoute;
