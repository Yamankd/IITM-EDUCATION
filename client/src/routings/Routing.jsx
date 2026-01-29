import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Courses from "../pages/Courses";
import About from "../pages/About";
import Gallery from "../pages/Gallery";

import AdminLogin from "../ADMIN/pages/AdminLogin";
import AdminDashboard from "../ADMIN/pages/AdminDashboard";
import CourseDetail from "../pages/CourseDetail";
import ProtectRoute from "../protectedRoutes/ProtectRoute";

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/course" element={<Courses />} />
      <Route path="/course/:id" element={<CourseDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/gallery" element={<Gallery />} />

      <Route path="/admin-login" element={<AdminLogin />} />
      <Route
        path="/AdminDashboard"
        element={
          <ProtectRoute>
            <AdminDashboard />
          </ProtectRoute>
        }
      />
    </Routes>
  );
};

export default Routing;
