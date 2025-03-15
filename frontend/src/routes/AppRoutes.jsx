import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../views/Home";
import Register from "../views/Register";
import Login from "../views/Login";
import Protected from "../components/Protected";
import Project from "../views/Project";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Protected><Home /></Protected>} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/project" element={<Protected><Project /></Protected>} />
        </Routes>
    );
};

export default AppRoutes;
