import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";

const ProtectStudentRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check if we have a token in local storage first to save a call?
    // But verification is better.
    // We assume access token is in localStorage for students based on my controller logic
    // (I sent it in body, frontend should save it).
    // Let's assume frontend logic:
    const token = localStorage.getItem("studentToken");
    if (!token) {
      setAuthorized(false);
      setLoading(false);
      return;
    }

    // Verify with backend
    api
      .get("/students/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setAuthorized(true);
      })
      .catch(() => {
        localStorage.removeItem("studentToken");
        setAuthorized(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center text-[#D6A419]">
        Loading...
      </div>
    );

  return authorized ? children : <Navigate to="/student/login" replace />;
};

export default ProtectStudentRoute;
