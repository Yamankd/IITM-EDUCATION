import React, { useEffect } from "react";
import Navbar from "./components/common/Navbar";
import Routing from "./routings/Routing";
import Footer from "./components/common/Footer";
import Faq from "./components/common/Faq";
import { useLocation } from "react-router-dom";
import { AlertProvider } from "./context/AlertContext";
import { ConfirmProvider } from "./components/ConfirmDialog";
import CustomAlert from "./components/CustomAlert";

const App = () => {
  const location = useLocation();

  // ✅ detect admin/dashboard routes and exam pages
  const isDashboard =
    location.pathname.startsWith("/AdminDashboard") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/student/exam") ||
    location.pathname === "/portal" ||
    location.pathname === "/admin-login";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AlertProvider>
      <ConfirmProvider>
        <>
          {/* ✅ Hide Navbar on dashboard and exam pages */}
          {!isDashboard && <Navbar />}

          <Routing />

          {/* ✅ Show FAQ only on home */}
          {!isDashboard && location.pathname === "/" && <Faq />}

          {/* ✅ Hide Footer on dashboard and exam pages */}
          {!isDashboard && <Footer />}

          {/* Custom Alert Component */}
          <CustomAlert />
        </>
      </ConfirmProvider>
    </AlertProvider>
  );
};

export default App;
