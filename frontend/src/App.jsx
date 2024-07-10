import { useState } from "react";
import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import Button from "./core/components/Button/Button";
import Login from "./modules/Login/pages/Login";
import SignUp from "./modules/Signup/pages/SignUp";
import PrivateRoute from "./utils/PrivateRoute";
import Participants from "./modules/Participants/pages/Participants";
import ForgetPassword from "./modules/ForgetPass/pages/ForgetPassword";
import ResetPassword from "./modules/ForgetPass/pages/ResetPassword";
import EventsPage from "./modules/Events/pages/EventsPage";
import { Toaster } from "react-hot-toast";
import Workshops from "./modules/Workshops/pages/Workshops";
import Forms from "./modules/Form/pages/FormsPage";

function App() {
  return (
    <div className="App">
      <Toaster />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route
          path="/participants"
          element={
            <PrivateRoute>
              <Participants />
            </PrivateRoute>
          }
        />
        <Route
          path="/forms"
          element={
            <PrivateRoute>
              <Forms />
            </PrivateRoute>
          }
        />
        <Route
          path="/workshops"
          element={
            <PrivateRoute>
              <Workshops />
            </PrivateRoute>
          }
        />
        <Route
          path="/events"
          element={
            <PrivateRoute>
              <EventsPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
