import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { YOUR_CONTRACT_ABI, YOUR_CONTRACT_ADDRESS } from '../config';


function DataDisplay() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [projectData, setProjectData] = useState([]);
  // New state variables for search and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState(''); // 'budget', 'installmentNumber', 'fundsSentToCityCorporation', 'fundsSentToBuilder'

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccounts(accounts);
          setIsConnected(true);
        } catch (error) {
          console.error('User denied account access:', error);
        }
      } else {
        const web3Instance = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
        setWeb3(web3Instance);
        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts);
        setIsConnected(true);
      }
    };

    initWeb3();
  }, []);

  useEffect(() => {
    if (web3) {
      const contractInstance = new web3.eth.Contract(YOUR_CONTRACT_ABI, YOUR_CONTRACT_ADDRESS);
      setContract(contractInstance);
    }
  }, [web3]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (criteria) => {
    setSortCriteria(criteria);
  };

  const handleSort = (data) => {
    if (sortCriteria === '') {
      return data;
    }

    return data.slice().sort((a, b) => {
      const aValue = a[sortCriteria];
      const bValue = b[sortCriteria];

      if (sortCriteria === 'budget' || sortCriteria === 'installmentNumber' || sortCriteria === 'fundsSentToCityCorporation' || sortCriteria === 'fundsSentToBuilder') {
        return aValue - bValue;
      } else {
        return aValue.localeCompare(bValue);
      }
    });
  };

  const filteredAndSortedData = handleSort(
    projectData.filter((project) => {
      const searchTermLowerCase = searchTerm.toLowerCase();
      return (
        project.projectID.toLowerCase().includes(searchTermLowerCase) ||
        project.financeMinistry.toLowerCase().includes(searchTermLowerCase) ||
        project.treasury.toLowerCase().includes(searchTermLowerCase) ||
        project.cityCorporation.toLowerCase().includes(searchTermLowerCase) ||
        project.builder.toLowerCase().includes(searchTermLowerCase) ||
        project.projectName.toLowerCase().includes(searchTermLowerCase) ||
        project.projectArea.toLowerCase().includes(searchTermLowerCase) ||
        project.allocatedBudget.includes(searchTerm) ||
        project.fundsSentToCityCorporation.includes(searchTerm) ||
        project.fundsSentToBuilder.includes(searchTerm) ||
        project.installmentNumber.includes(searchTerm)
      );
    })
  );


  const handleGetAllProjectDetails = async () => {
    try {
      if (!isConnected) {
        console.error('Not connected to MetaMask. Please connect first.');
        return;
      }

      if (!contract) {
        console.error('Contract instance not available. Please wait for the contract to initialize.');
        return;
      }

      const result = await contract.methods.getAllProjectDetails().call({ from: accounts[0] });

      // Map the result directly to ProjectSummary
      const projectDetails = result.map((project) => ({
        projectID: project.projectID,
        financeMinistry: project.financeMinistry,
        treasury: project.treasury,
        cityCorporation: project.cityCorporation,
        builder: project.builder,
        projectName: project.projectName,
        projectArea: project.projectArea,
        allocatedBudget: project.allocatedBudget.toString(),
        fundsSentToCityCorporation: project.fundsSentToCityCorporation.toString(),
        fundsSentToBuilder: project.fundsSentToBuilder.toString(),
        installmentNumber: project.installmentNumber.toString(),
      }));

      setProjectData(projectDetails);
    } catch (error) {
      console.error('Error fetching project details:', error);
    }
  };

  return (
    <div>
      {/* <h1 className="text-4xl mb-5 ml-36">Data Display</h1> */}
      {isConnected ? (
        <>
          {/* <button
            className="text-black hover:text-white bg-green-400 p-1 hover:bg-green-800 rounded-xl mt-8 mb-4 h-10 w-[200px] ml-48 font-bold text-[16px]"
            onClick={handleGetAllProjectDetails}
          >
            All Project Details
          </button> */}
          
          <button className="shadow__btn ml-16" type="button" onClick={handleGetAllProjectDetails}>
              All Project Details
          </button >

          {/* <table className="table-auto mt-4 border-separate border-spacing-2 border border-slate-50"> */}
          <table className="table-auto mt-4 border-separate border-spacing-2 border border-slate-50 w-full">
            <thead>
            <tr>
              <th className="border border-slate-800 bg-sky-400 px-4 py-2">Project ID</th>
              <th className="border border-slate-800 bg-white px-4 py-2" colSpan="4">Ethereum Wallet Addresses</th>
              <th className="border border-slate-800 bg-sky-400 px-4 py-2">Project Name</th>
              <th className="border border-slate-800 bg-white px-4 py-2">Project Area</th>
              <th className="border border-slate-800 bg-sky-400 px-4 py-2">Allocated Budget</th>
              <th className="border border-slate-800 bg-white px-4 py-2">Funds Sent to City Corporation</th>
              <th className="border border-slate-800 bg-sky-400 px-4 py-2">Funds Sent to Builder</th>
              <th className="border border-slate-800 bg-white px-4 py-2">Installment Number</th>
            </tr>
            </thead>
            <tbody>
              {projectData.map((project) => (
                <tr key={project.projectID}>
                  <td className="border border-slate-800 bg-white px-4 py-2">{project.projectID}</td>
                  {/* <td className="border border-slate-800 px-4 py-2" colSpan="4">
                    <div style={{ backgroundColor: 'white' }} className="truncate">FinanceM: {project.financeMinistry}</div>
                    <div style={{ backgroundColor: 'sky' }} className="truncate">Treaury: {project.treasury}</div>
                    <div style={{ backgroundColor: 'white' }} className="truncate">CityCorp: {project.cityCorporation}</div>
                    <div style={{ backgroundColor: 'sky' }} className="truncate">Builder: {project.builder}</div>
                  </td> */}
                  <td className="border border-slate-800 bg-gray-200 px-4 py-2" colSpan="4">
                    <div style={{ backgroundColor:'#f0f0f0' }}>
                      <strong>FinanceM:</strong> {project.financeMinistry}
                    </div>
                    <div style={{ backgroundColor:'#ffffff' }}>
                      <strong>Treasury:</strong> {project.treasury}
                    </div>
                    <div style={{ backgroundColor:'#f0f0f0' }}>
                      <strong>CityCorp:</strong> {project.cityCorporation}
                    </div>
                    <div style={{ backgroundColor:'#ffffff' }}>
                      <strong>Builder:</strong> {project.builder}
                    </div>
                  </td>
                  <td className="border border-slate-800 bg-sky-400 px-4 py-2" style={{ width: '120px' }}>{project.projectName}</td>
                  <td className="border border-slate-800 bg-white px-4 py-2" style={{ width: '120px' }}>{project.projectArea}</td>
                  <td className="border border-slate-800 bg-sky-400 px-4 py-2" style={{ width: '120px' }}>{project.allocatedBudget}</td>
                  <td className="border border-slate-800 bg-white px-4 py-2" style={{ width: '120px' }}>{project.fundsSentToCityCorporation}</td>
                  <td className="border border-slate-800 bg-sky-400 px-4 py-2" style={{ width: '120px' }}>{project.fundsSentToBuilder}</td>
                  <td className="border border-slate-800 bg-white px-4 py-2" style={{ width: '120px' }}>{project.installmentNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
      
        </>
      ) : (
        <p>Please connect to MetaMask.</p>
      )}
    </div>
  );
}

export default DataDisplay;
