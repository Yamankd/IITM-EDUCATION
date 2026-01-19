import React from "react";
import { Route, Routes, Navigate } from "react-router-dom"; // Import Routes instead of Router
import Home from "../pages/Home";
import Courses from "../pages/Courses";

import CourseDetail from "../pages/CourseDetail";
import About from "../pages/About";
import Gallery from "../pages/Gallery";
import AdminDashboard from "../ADMIN/pages/AdminDashboard";
import AdminLogin from "../ADMIN/pages/AdminLogin";
import ProtectRoute from "../protectedRoutes/ProtectRoute";

const Routing = () => {
  return (
    <Routes>
      {" "}
      {/* Use Routes instead of Router */}
      <Route path="/" element={<Home />} />
      <Route path="/course" element={<Courses />} />
      <Route path="/course/:id" element={<CourseDetail />} />
      {/* <Route path="/team" element={<Team />} /> */}
      {/* <Route path="/store" element={<Store />} /> */}
      <Route
        path="/admin"
        element={<Navigate to="/admin/loginpage" replace />}
      />
      <Route path="/admin/loginpage" element={<AdminLogin />} />
      <Route
        path="/admin/Dashboard"
        element={
          <ProtectRoute>
            <AdminDashboard />
          </ProtectRoute>
        }
      />
      <Route path="/about" element={<About />} />
      <Route path="/gallery" element={<Gallery />} />
    </Routes>
  );
};

export default Routing;
