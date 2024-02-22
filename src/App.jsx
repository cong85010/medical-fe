import { useEffect, useState } from "react";
import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import LayoutPage from "./pages/LayoutPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import UsersPage from "./pages/Users";
import CalendarPage from "./pages/Calendar";
import ExaminationPage from "./pages/Examination";
import MedicalRecord from "./pages/MedicalRecord";
import { TYPE_EMPLOYEE } from "./utils";
import { useDispatch, useSelector } from "react-redux";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import { logoutAuth, reLoginAuth } from "./redux/slices/authSlice";
import { Spin } from "antd";
import ProfileMedicalPage from "./pages/ProfileMedicalPage";
import PatientPage from "./pages/Patient/PatientPage";

const PrivateRoute = ({ element, requiredPermission = [] }) => {
  const userType = useSelector((state) => state.auth?.user?.userType);
  const loading = useSelector((state) => state.auth?.loading);
  const hasPermission = requiredPermission.includes(userType);

  return hasPermission || loading ? (
    element
  ) : (
    <Navigate
      to="/unauthorized"
      replace
      state={{ from: window.location.pathname }}
    />
  );
};

function LogoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(logoutAuth());
    navigate("/login", { replace: true });
  }, []);

  return <Spin fullscreen />;
}

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(reLoginAuth({ token }));
    } else {
      const path = window.location.pathname;
      if (!["/login", "/register"].includes(path)) {
        navigate("/login", { replace: true });
      }
    }
  }, [dispatch, navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<LayoutPage />}>
          <Route path="/" element={<h1>Home</h1>} />
          <Route
            path="/users"
            element={
              <PrivateRoute
                element={<UsersPage />}
                requiredPermission={[TYPE_EMPLOYEE.admin]}
              />
            }
          />
          <Route
            path="/calendar"
            element={
              <PrivateRoute
                element={<CalendarPage />}
                requiredPermission={[TYPE_EMPLOYEE.doctor]}
              />
            }
          />
          <Route
            path="/examination"
            element={
              <PrivateRoute
                element={<ExaminationPage />}
                requiredPermission={[TYPE_EMPLOYEE.doctor]}
              />
            }
          />
          <Route
            path="/medical"
            element={
              <PrivateRoute
                element={<MedicalRecord />}
                requiredPermission={[TYPE_EMPLOYEE.user]}
              />
            }
          />
          <Route
            path="/profile-medical"
            element={
              <PrivateRoute
                element={<ProfileMedicalPage />}
                requiredPermission={[TYPE_EMPLOYEE.administrative]}
              />
            }
          />
          <Route
            path="/profile-medical/:id"
            element={
              <PrivateRoute
                element={<PatientPage />}
                requiredPermission={[TYPE_EMPLOYEE.administrative]}
              />
            }
          />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/logout" element={<LogoutPage />} />
      </Routes>
    </>
  );
}

export default App;
