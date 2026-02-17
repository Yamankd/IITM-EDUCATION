import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Courses from "../pages/Courses";
import About from "../pages/About";
import Gallery from "../pages/Gallery";
import ContactUs from "../pages/ContactUs";

import AdminLogin from "../pages/admin/AdminLogin";
import AdminDashboard from "../pages/admin/AdminDashboard";
import CourseDetail from "../pages/CourseDetail";
import ProtectRoute from "../protectedRoutes/ProtectRoute";
import StudentLogin from "../pages/student/StudentLogin";
import StudentDashboard from "../pages/student/StudentDashboard";
import ProtectStudentRoute from "../protectedRoutes/ProtectStudentRoute";
import ExamPortal from "../pages/student/ExamPortal";
import StudentRegister from "../pages/student/StudentRegister";
import CertificationRegister from "../pages/certification/CertificationRegister";
import CertificationLogin from "../pages/certification/CertificationLogin";
import CertificationDashboard from "../pages/certification/CertificationDashboard";
import NotFound from "../pages/error/NotFound";
import ServerError from "../pages/error/ServerError";

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/course" element={<Courses />} />
      <Route path="/course/:id" element={<CourseDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/contact" element={<ContactUs />} />

      <Route path="/admin" element={<Navigate to="/portal" replace />} />
      <Route path="/portal" element={<AdminLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route
        path="/AdminDashboard"
        element={
          <ProtectRoute>
            <AdminDashboard />
          </ProtectRoute>
        }
      />

      {/* Student Routes */}
      <Route path="/student/login" element={<StudentLogin />} />
      <Route path="/student/register" element={<StudentRegister />} />
      <Route
        path="/student/dashboard"
        element={
          <ProtectStudentRoute>
            <StudentDashboard />
          </ProtectStudentRoute>
        }
      />
      <Route
        path="/student/exam/:examId"
        element={
          <ProtectStudentRoute>
            <ExamPortal />
          </ProtectStudentRoute>
        }
      />

      {/* Certification Routes */}
      <Route
        path="/certification"
        element={<Navigate to="/certification/login" replace />}
      />
      <Route
        path="/certification/register"
        element={<CertificationRegister />}
      />
      <Route path="/certification/login" element={<CertificationLogin />} />
      <Route
        path="/certification/dashboard"
        element={<CertificationDashboard />}
      />
      <Route
        path="/certification/exam/:examId"
        element={<ExamPortal isExternal={true} />}
      />

      {/* Error Routes */}
      <Route path="/server-error" element={<ServerError />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routing;
