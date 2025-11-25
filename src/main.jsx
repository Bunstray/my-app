import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login/LoginPage.jsx";
import RegisterPage from "./pages/login/RegisterPage.jsx";
import "./index.css";
import MainPage from "./pages/home/MainPage.jsx";
import NotificationPage from "./NotificationPage.jsx";
import AcaraPage from "./pages/event/AcaraPage.jsx";
import PeralatanPage from "./PeralatanPage.jsx";
import HasilPage from "./HasilPage.jsx";
import AcaraSayaPage from "./AcaraSayaPage.jsx";
import AccountPage from "./AccountPage.jsx";
import CreateEventPage from "./pages/create-event/CreateEventPage.jsx";
import AdminRoute from "./AdminRoute.jsx";
import AdminEventPage from "./AdminEventPage.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/daftar" element={<RegisterPage />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/acara" element={<AcaraPage />} />
        <Route path="/peralatan" element={<PeralatanPage />} />
        <Route path="/hasil" element={<HasilPage />} />
        <Route path="/acarasaya" element={<AcaraSayaPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/acara/create" element={<CreateEventPage />} />
        <Route
          path="/admin/event/:id"
          element={
            <AdminRoute>
              <AdminEventPage />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
