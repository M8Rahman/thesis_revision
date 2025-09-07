import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { YOUR_CONTRACT_ABI, YOUR_CONTRACT_ADDRESS } from '../config';

function DataDisplay() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [projectData, setProjectData] = useState([]);

  // Search & sort states kept as-is (functionality untouched)
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');

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

  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handleSortChange = (criteria) => setSortCriteria(criteria);

  const handleSort = (data) => {
    if (sortCriteria === '') return data;
    return data.slice().sort((a, b) => {
      const aValue = a[sortCriteria];
      const bValue = b[sortCriteria];
      if (
        sortCriteria === 'budget' ||
        sortCriteria === 'installmentNumber' ||
        sortCriteria === 'fundsSentToCityCorporation' ||
        sortCriteria === 'fundsSentToBuilder'
      ) {
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
      {isConnected ? (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h2 className="text-lg md:text-xl mb-2 font-semibold text-slate-900 dark:text-slate-100">
                  Projects
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Latest project updates and fund distribution status
                </p>
              </div>

              <button
                className="shadow__btn"
                type="button"
                onClick={handleGetAllProjectDetails}
                title="Fetch all project details"
              >
                All Project Details
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-xs uppercase tracking-wide text-white">
                  <tr>
                    <th className="px-6 py-3">Project ID</th>
                    <th className="px-6 py-3" colSpan="4">Ethereum Wallet Addresses</th>
                    <th className="px-6 py-3 whitespace-nowrap">Project Name</th>
                    <th className="px-6 py-3 whitespace-nowrap">Project Area</th>
                    <th className="px-6 py-3 whitespace-nowrap">Allocated Budget</th>
                    <th className="px-6 py-3 whitespace-nowrap">Funds to City Corporation</th>
                    <th className="px-6 py-3 whitespace-nowrap">Funds to Builder</th>
                    <th className="px-6 py-3 whitespace-nowrap">Installment No.</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {projectData.map((project) => (
                    <tr
                      key={project.projectID}
                      className="odd:bg-slate-100 even:bg-white dark:odd:bg-purple-900/30 dark:even:bg-slate-800"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                        {project.projectID}
                      </td>

                      {/* Striped wallet addresses block */}
                      <td className="px-6 py-4 text-sm text-slate-800 dark:text-slate-200" colSpan="4">
                        <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900/40">
                            <strong className="text-slate-700 dark:text-slate-200">FinanceM:</strong>{' '}
                            <span className="break-all">{project.financeMinistry}</span>
                          </div>
                          <div className="px-3 py-2 bg-white dark:bg-slate-800/60">
                            <strong className="text-slate-700 dark:text-slate-200">Treasury:</strong>{' '}
                            <span className="break-all">{project.treasury}</span>
                          </div>
                          <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900/40">
                            <strong className="text-slate-700 dark:text-slate-200">CityCorp:</strong>{' '}
                            <span className="break-all">{project.cityCorporation}</span>
                          </div>
                          <div className="px-3 py-2 bg-white dark:bg-slate-800/60">
                            <strong className="text-slate-700 dark:text-slate-200">Builder:</strong>{' '}
                            <span className="break-all">{project.builder}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                        {project.projectName}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-purple-200">
                        {project.projectArea}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                        {project.allocatedBudget}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                        {project.fundsSentToCityCorporation}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                        {project.fundsSentToBuilder}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-purple-200">
                        {project.installmentNumber}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <button className='inline-flex items-center rounded-lg px-5 py-2.5 font-semibold transition-all duration-200 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 shadow-lg shadow-cyan-500/10'>
          Please connect to MetaMask.
        </button>
      )}
    </div>
  );
}

export default DataDisplay;
