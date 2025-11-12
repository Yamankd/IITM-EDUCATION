import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; 

const GoBackButton = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768); 
    };

    checkDevice(); 
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (!isMobile) return null;

  return (
    <button
      onClick={() => navigate(-1)}
      className="fixed bottom-6 right-6 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition"
    >
      <ArrowLeft size={18} /> Back
    </button>
  );
};

export default GoBackButton;
