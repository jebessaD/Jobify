import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminManagement from "../pages/AdminManagement";
import JobManagement from "../pages/JobManagement";
import CompanyManagement from "../pages/CompanyManagement";
import Header from "../components/Layout/Header";
import { useSelector } from "react-redux";
const Login = lazy(() => import("../pages/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard"));

const AppRoutes = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-management" element={<AdminManagement />} />
          <Route path="/job-management" element={<JobManagement />} />
          <Route path="/company-management" element={<CompanyManagement />} />
          <Route path="/" exact element={<Login />} />{" "}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRoutes;
