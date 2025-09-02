import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from '../../components/Dashboard/Dashboard';
import ProjectCreation from '../../components/ProjectCreation';
import CityCorporation from '../CityCorporation';
import InstallmentTransfer from '../../components/InstallmentTransfer';
import FundsTransfer from '../../components/FundsTransfer';
import DataDisplay from '../../components/DataDisplay';
import Builder from '../../components/Builder/Builder';
import Home from '../Home';
import ParticleHTML from '../../components/ParticleHTML';
import '../../components/Builder/Builder.css';

function App() {
  return (
    
    <BrowserRouter>
    <Dashboard/>
      {/* <ParticleHTML/> */}
      {/* Render the ParticleHTML component */}
      <Routes>
        <Route path='/Home' element={<Home/>}></Route>
        <Route path="/project-creation" element={<ProjectCreation/>} />
        <Route path="/city-corporation" element={<CityCorporation/>} />
        <Route path="/installment-transfer" element={<InstallmentTransfer/>} />
        <Route path="/funds-transfer" element={<FundsTransfer/>} />
        <Route path="/data-display" element={<DataDisplay/>} />          
        <Route path="/builder" element={<Builder/>} />          
        {/* <Route path="/metamask" element={<Metamask/>} /> */}
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
