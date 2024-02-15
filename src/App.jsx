import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import LayoutPage from "./pages/LayoutPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import UsersPage from "./pages/Users";
import CalendarPage from "./pages/Calendar";
import ExaminationPage from "./pages/Examination";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path="/" element={<LayoutPage />}>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/examination" element={<ExaminationPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default App;
