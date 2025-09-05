
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard/Dashboard';
import ProjectCreation from '../components/ProjectCreation';
import CityCorporation from '../pages/CityCorporation';
import InstallmentTransfer from '../components/InstallmentTransfer';
import FundsTransfer from '../components/FundsTransfer';
import DataDisplay from '../components/DataDisplay';
import Builder from '../components/Builder/Builder';
import Home from '../pages/Home';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    return isAuthenticated ? children : <Navigate to="/sign-in" />;
};

const Router = () => {
    return (
        <Routes>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }
            >
                <Route index element={<Navigate to="/home" />} />
                <Route path="home" element={<Home />} />
                <Route path="project-creation" element={<ProjectCreation />} />
                <Route path="city-corporation" element={<CityCorporation />} />
                <Route path="installment-transfer" element={<InstallmentTransfer />} />
                <Route path="funds-transfer" element={<FundsTransfer />} />
                <Route path="data-display" element={<DataDisplay />} />
                <Route path="builder" element={<Builder />} />
            </Route>
        </Routes>
    );
};

export default Router;
