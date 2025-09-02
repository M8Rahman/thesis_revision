import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Dashboard.css';


function Dashboard() {
  // Get the current location using useLocation hook from react-router-dom
  const location = useLocation();

  return (
    <nav className="m-8">
      <ul className="flex items-center p-4 max-w-7xl my-4 mx-auto shadow-2xl h-20 text-white bg-slate-800">
        <div className='text-4xl font-bold text-gradient-to-r from-indigo-500 mr-52'>GovtChain</div>
        <div className='flex space-x-2 rounded-xl text-white'>
          <li className={`hover:bg-violet-600 font-semibold hover:text-black focus:outline-none focus:ring focus:ring-violet-300 rounded-lg p-2 ${location.pathname === '/home' ? 'active' : ''}`}>
            <NavLink exact to="/home">Home</NavLink>
          </li>
          <li className={`hover:bg-violet-600 font-semibold hover:text-black focus:outline-none focus:ring focus:ring-violet-300 rounded-lg p-2 ${location.pathname === '/project-creation' ? 'active' : ''}`}>
            <NavLink to="/project-creation">Project Creation</NavLink>
          </li>
          <li className={`hover:bg-violet-600 font-semibold hover:text-black focus:outline-none focus:ring focus:ring-violet-300 rounded-lg p-2 ${location.pathname === '/city-corporation' ? 'active' : ''}`}>
            <NavLink to="/city-corporation">City Corporation</NavLink>
          </li>
          <li className={`hover:bg-violet-600 font-semibold hover:text-black focus:outline-none focus:ring focus:ring-violet-300 rounded-lg p-2 ${location.pathname === '/builder' ? 'active' : ''}`}>
            <NavLink to="/builder">Builder</NavLink>
          </li>
          <li className={`hover:bg-violet-600 font-semibold hover:text-black focus:outline-none focus:ring focus:ring-violet-300 rounded-lg p-2 ${location.pathname === '/installment-transfer' ? 'active' : ''}`}>
            <NavLink to="/installment-transfer">Installment Transfer</NavLink>
          </li>
          <li className={`hover:bg-violet-600 font-semibold hover:text-black focus:outline-none focus:ring focus:ring-violet-300 rounded-lg p-2 ${location.pathname === '/funds-transfer' ? 'active' : ''}`}>
            <NavLink to="/funds-transfer">Funds Transfer</NavLink>
          </li>
          <li className={`hover:bg-violet-600 font-semibold hover:text-black focus:outline-none focus:ring focus:ring-violet-300 rounded-lg p-2 ${location.pathname === '/data-display' ? 'active' : ''}`}>
            <NavLink to="/data-display">Data Display</NavLink>
          </li>
        </div>
      </ul>
    </nav>
  );
}

export default Dashboard;
