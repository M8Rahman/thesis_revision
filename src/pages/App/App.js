import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from '../../components/Dashboard/Dashboard';
import ProjectCreation from '../../components/ProjectCreation';
import CityCorporation from '../CityCorporation';
import InstallmentTransfer from '../../components/InstallmentTransfer';
import FundsTransfer from '../../components/FundsTransfer';
import DataDisplay from '../../components/DataDisplay';
import Builder from '../../components/Builder/Builder';
import Home from '../Home';
import SignIn from '../SignIn';
import SignUp from '../SignUp';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        <Route index element={<Navigate to="/home" />} />
        <Route path="home" element={<Home />} />
        <Route path="project-creation" element={<ProjectCreation />} />
        <Route path="city-corporation" element={<CityCorporation />} />
        <Route path="installment-transfer" element={<InstallmentTransfer />} />
        <Route path="funds-transfer" element={<FundsTransfer />} />
        <Route path="data-display" element={<DataDisplay />} />
        <Route path="builder" element={<Builder />} />
      </Route>
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
  );
}

export default App;
