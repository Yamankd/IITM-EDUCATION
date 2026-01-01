import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

const ProtectRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    api
      .get("/auth-check")
      .then(() => setAuthorized(true))
      .catch(
        () => setAuthorized(false),
        navigate("/admin/Dashboard", { replace: true })
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return authorized ? children : <Navigate to="/admin/loginpage" replace />;
};

export default ProtectRoute;
