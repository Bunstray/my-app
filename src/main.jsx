import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./loginpage.jsx";
import RegisterPage from "./RegisterPage.jsx";
import "./index.css";
import MainPage from "./MainPage";
import NotificationPage from "./NotificationPage";
import AcaraPage from "./AcaraPage";
import PeralatanPage from "./PeralatanPage";
import HasilPage from "./HasilPage";
import AcaraSayaPage from "./AcaraSayaPage";
import AccountPage from "./AccountPage";
import CreateEventPage from "./CreateEventPage";
import AdminRoute from "./AdminRoute";
import AdminEventPage from "./AdminEventPage";

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
