import { useEffect, useState } from "react";
import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import LayoutPage from "./pages/LayoutPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import UsersPage from "./pages/Users_AD";
import CalendarPage from "./pages/Calendar_BS";
import ExaminationPage from "./pages/Examination_BS";
import MedicalRecord from "./pages/MedicalRecord_BN";
import { TYPE_EMPLOYEE } from "./utils";
import { useDispatch, useSelector } from "react-redux";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import { logoutAuth, reLoginAuth } from "./redux/slices/authSlice";
import { Spin, notification } from "antd";
import ProfileMedicalPage from "./pages/ProfileMedical_HC";
import PatientPage from "./pages/Patient_BN/PatientPage";
import AppointmentPatientPage from "./pages/AppointmentPatient_HC";
import ProfilePage from "./pages/Profile_ALL/ProfilePage";
import AppointmentsPage from "./pages/Appointments_BN";
import ExaminationDetailPage from "./pages/ExaminationDetail_BS";
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import MedicinePage from "./pages/Medicine_BH";

dayjs.extend(customParseFormat)
const PrivateRoute = ({ element, requiredPermission = [] }) => {
  const userType = useSelector((state) => state.auth?.user?.userType);
  const loading = useSelector((state) => state.auth?.loading);
  const hasPermission =
    requiredPermission.length === 0 || requiredPermission.includes(userType);

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
  const fullName = useSelector((state) => state.auth?.user?.fullName);
  const userId = useSelector((state) => state.auth?.user?._id);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!userId && token) {
      dispatch(reLoginAuth({ token }));
    } else if (!token) {
      const path = window.location.pathname;
      if (!["/login", "/register"].includes(path)) {
        navigate("/login", { replace: true });
      }
    }
  }, [dispatch, navigate, userId]);

  useEffect(() => {
    const path = window.location.pathname;
    if (userId && !fullName && path !== "/profile") {
      navigate("/profile");
      notification.warning({
        message: "Thông báo",
        description: "Vui lòng cập nhật thông tin cá nhân",
      });
    }
  }, [userId, fullName, navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<LayoutPage />}>
          <Route path="/" element={<h1>Home</h1>} />
          <Route
            path="/profile"
            element={<PrivateRoute element={<ProfilePage />} />}
          />
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
            path="/examination/:id"
            element={
              <PrivateRoute
                element={<ExaminationDetailPage />}
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
            path="/appointment"
            element={
              <PrivateRoute
                element={<AppointmentsPage />}
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
          <Route
            path="/appointments-patient"
            element={
              <PrivateRoute
                element={<AppointmentPatientPage />}
                requiredPermission={[TYPE_EMPLOYEE.administrative]}
              />
            }
          />
          <Route
            path="/medicine"
            element={
              <PrivateRoute
                element={<MedicinePage />}
                requiredPermission={[TYPE_EMPLOYEE.sales]}
              />
            }
          />
          <Route
            path="/sales"
            element={
              <PrivateRoute
                element={<MedicinePage />}
                requiredPermission={[TYPE_EMPLOYEE.sales]}
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
