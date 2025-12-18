// import React, { useState, useEffect } from 'react';
// import Web3 from 'web3';
// import { YOUR_CONTRACT_ABI, YOUR_CONTRACT_ADDRESS } from '../config';

// function DataDisplay() {
//   const [web3, setWeb3] = useState(null);
//   const [accounts, setAccounts] = useState([]);
//   const [contract, setContract] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [projectData, setProjectData] = useState([]);

//   // Search & sort states kept as-is (functionality untouched)
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortCriteria, setSortCriteria] = useState('');

//   useEffect(() => {
//     const initWeb3 = async () => {
//       if (window.ethereum) {
//         const web3Instance = new Web3(window.ethereum);
//         try {
//           await window.ethereum.enable();
//           setWeb3(web3Instance);
//           const accounts = await web3Instance.eth.getAccounts();
//           setAccounts(accounts);
//           setIsConnected(true);
//         } catch (error) {
//           console.error('User denied account access:', error);
//         }
//       } else {
//         const web3Instance = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
//         setWeb3(web3Instance);
//         const accounts = await web3Instance.eth.getAccounts();
//         setAccounts(accounts);
//         setIsConnected(true);
//       }
//     };

//     initWeb3();
//   }, []);

//   useEffect(() => {
//     if (web3) {
//       const contractInstance = new web3.eth.Contract(YOUR_CONTRACT_ABI, YOUR_CONTRACT_ADDRESS);
//       setContract(contractInstance);
//     }
//   }, [web3]);

//   const handleSearchChange = (event) => setSearchTerm(event.target.value);
//   const handleSortChange = (criteria) => setSortCriteria(criteria);

//   const handleSort = (data) => {
//     if (sortCriteria === '') return data;
//     return data.slice().sort((a, b) => {
//       const aValue = a[sortCriteria];
//       const bValue = b[sortCriteria];
//       if (
//         sortCriteria === 'budget' ||
//         sortCriteria === 'installmentNumber' ||
//         sortCriteria === 'fundsSentToCityCorporation' ||
//         sortCriteria === 'fundsSentToBuilder'
//       ) {
//         return aValue - bValue;
//       } else {
//         return aValue.localeCompare(bValue);
//       }
//     });
//   };

//   const filteredAndSortedData = handleSort(
//     projectData.filter((project) => {
//       const searchTermLowerCase = searchTerm.toLowerCase();
//       return (
//         project.projectID.toLowerCase().includes(searchTermLowerCase) ||
//         project.financeMinistry.toLowerCase().includes(searchTermLowerCase) ||
//         project.treasury.toLowerCase().includes(searchTermLowerCase) ||
//         project.cityCorporation.toLowerCase().includes(searchTermLowerCase) ||
//         project.builder.toLowerCase().includes(searchTermLowerCase) ||
//         project.projectName.toLowerCase().includes(searchTermLowerCase) ||
//         project.projectArea.toLowerCase().includes(searchTermLowerCase) ||
//         project.allocatedBudget.includes(searchTerm) ||
//         project.fundsSentToCityCorporation.includes(searchTerm) ||
//         project.fundsSentToBuilder.includes(searchTerm) ||
//         project.installmentNumber.includes(searchTerm)
//       );
//     })
//   );

//   // const handleGetAllProjectDetails = async () => {
//   //   try {
//   //     if (!isConnected) {
//   //       console.error('Not connected to MetaMask. Please connect first.');
//   //       return;
//   //     }
//   //     if (!contract) {
//   //       console.error('Contract instance not available. Please wait for the contract to initialize.');
//   //       return;
//   //     }

//   //     const result = await contract.methods.getAllProjectDetails().call({ from: accounts[0] });

//   //     // Destructure the result
//   //     const [projectIDs, allAllocatedBudgets, allFundsSent] = result;

//   //     // Fetch full project details for each ID
//   //     const projectDetails = [];
//   //     for (let i = 0; i < projectIDs.length; i++) {
//   //       const project = await contract.methods.projects(projectIDs[i]).call();
//   //       projectDetails.push({
//   //         projectID: project.projectID,
//   //         financeMinistry: project.financeMinistry,
//   //         treasury: project.treasury,
//   //         cityCorporation: project.cityCorporation,
//   //         builder: project.builder,
//   //         projectName: project.projectName,
//   //         projectArea: project.projectArea,
//   //         allocatedBudget: project.allocatedBudget.toString(),
//   //         fundsSentToCityCorporation: allFundsSent[i].toString(),
//   //         fundsSentToBuilder: (await contract.methods.cityCorporationToBuilder(projectIDs[i]).call()).toString(),
//   //         installmentNumber: project.installmentNumber.toString(),
//   //       });
//   //     }

//   //     setProjectData(projectDetails);
//   //   } catch (error) {
//   //     console.error('Error fetching project details:', error);
//   //   }
//   // };
//   const handleGetAllProjectDetails = async () => {
//     try {
//       if (!isConnected) {
//         console.error('Not connected to MetaMask. Please connect first.');
//         return;
//       }
//       if (!contract) {
//         console.error('Contract instance not available. Please wait for the contract to initialize.');
//         return;
//       }

//       const result = await contract.methods.getAllProjectDetails().call({ from: accounts[0] });
//       console.log('Raw result from getAllProjectDetails:', result); // Debug log

//       // Continue with processing...
//     } catch (error) {
//       console.error('Error fetching project details:', error);
//     }
//   };

//   return (
//     <div>
//       {isConnected ? (
//         <>
//           <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 overflow-hidden">
//             {/* Header */}
//             <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
//               <div>
//                 <h2 className="text-lg md:text-xl mb-2 font-semibold text-slate-900 dark:text-slate-100">
//                   Projects
//                 </h2>
//                 <p className="text-sm text-slate-600 dark:text-slate-400">
//                   Latest project updates and fund distribution status
//                 </p>
//               </div>

//               <button
//                 className="shadow__btn"
//                 type="button"
//                 onClick={handleGetAllProjectDetails}
//                 title="Fetch all project details"
//               >
//                 All Project Details
//               </button>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-xs uppercase tracking-wide text-white">
//                   <tr>
//                     <th className="px-6 py-3">Project ID</th>
//                     <th className="px-6 py-3" colSpan="4">Ethereum Wallet Addresses</th>
//                     <th className="px-6 py-3 whitespace-nowrap">Project Name</th>
//                     <th className="px-6 py-3 whitespace-nowrap">Project Area</th>
//                     <th className="px-6 py-3 whitespace-nowrap">Allocated Budget</th>
//                     <th className="px-6 py-3 whitespace-nowrap">Funds to City Corporation</th>
//                     <th className="px-6 py-3 whitespace-nowrap">Funds to Builder</th>
//                     <th className="px-6 py-3 whitespace-nowrap">Installment No.</th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
//                   {projectData.map((project) => (
//                     <tr
//                       key={project.projectID}
//                       className="odd:bg-slate-100 even:bg-white dark:odd:bg-purple-900/30 dark:even:bg-slate-800"
//                     >
//                       <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
//                         {project.projectID}
//                       </td>

//                       {/* Striped wallet addresses block */}
//                       <td className="px-6 py-4 text-sm text-slate-800 dark:text-slate-200" colSpan="4">
//                         <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
//                           <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900/40">
//                             <strong className="text-slate-700 dark:text-slate-200">FinanceM:</strong>{' '}
//                             <span className="break-all">{project.financeMinistry}</span>
//                           </div>
//                           <div className="px-3 py-2 bg-white dark:bg-slate-800/60">
//                             <strong className="text-slate-700 dark:text-slate-200">Treasury:</strong>{' '}
//                             <span className="break-all">{project.treasury}</span>
//                           </div>
//                           <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900/40">
//                             <strong className="text-slate-700 dark:text-slate-200">CityCorp:</strong>{' '}
//                             <span className="break-all">{project.cityCorporation}</span>
//                           </div>
//                           <div className="px-3 py-2 bg-white dark:bg-slate-800/60">
//                             <strong className="text-slate-700 dark:text-slate-200">Builder:</strong>{' '}
//                             <span className="break-all">{project.builder}</span>
//                           </div>
//                         </div>
//                       </td>

//                       <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
//                         {project.projectName}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-slate-700 dark:text-purple-200">
//                         {project.projectArea}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
//                         {project.allocatedBudget}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
//                         {project.fundsSentToCityCorporation}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
//                         {project.fundsSentToBuilder}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-slate-700 dark:text-purple-200">
//                         {project.installmentNumber}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </section>
//         </>
//       ) : (
//         <button className='inline-flex items-center rounded-lg px-5 py-2.5 font-semibold transition-all duration-200 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 shadow-lg shadow-cyan-500/10'>
//           Please connect to MetaMask.
//         </button>
//       )}
//     </div>
//   );
// }

// export default DataDisplay;

import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { YOUR_CONTRACT_ABI, YOUR_CONTRACT_ADDRESS } from '../config';

function DataDisplay() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Search & sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setWeb3(web3Instance);
          const accounts = await web3Instance.eth.getAccounts();
          setAccounts(accounts);
          setIsConnected(true);
        } catch (error) {
          console.error('User denied account access:', error);
          setError('User denied account access');
        }
      } else {
        const web3Instance = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
        setWeb3(web3Instance);
        try {
          const accounts = await web3Instance.eth.getAccounts();
          setAccounts(accounts);
          setIsConnected(true);
        } catch (error) {
          console.error('Error connecting to local provider:', error);
          setError('Error connecting to local provider');
        }
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
        project.allocatedBudget.toString().includes(searchTerm) ||
        project.fundsSentToCityCorporation.toString().includes(searchTerm) ||
        project.fundsSentToBuilder.toString().includes(searchTerm) ||
        project.installmentNumber.toString().includes(searchTerm)
      );
    })
  );

  const handleGetAllProjectDetails = async () => {
    try {
      setLoading(true);
      setError('');

      if (!isConnected) {
        setError('Not connected to MetaMask. Please connect first.');
        setLoading(false);
        return;
      }
      if (!contract) {
        setError('Contract instance not available. Please wait for the contract to initialize.');
        setLoading(false);
        return;
      }

      console.log('Fetching project details from contract...');
      console.log('Contract address:', YOUR_CONTRACT_ADDRESS);
      console.log('Account:', accounts[0]);

      // Call the contract method
      const result = await contract.methods.getAllProjectDetails().call({ from: accounts[0] });
      console.log('Raw result from getAllProjectDetails:', result);

      // Handle both array destructuring and object property access
      let projectIDs, allAllocatedBudgets, allFundsSent;
      
      if (Array.isArray(result)) {
        [projectIDs, allAllocatedBudgets, allFundsSent] = result;
      } else {
        projectIDs = result[0] || result['0'];
        allAllocatedBudgets = result[1] || result['1'];
        allFundsSent = result[2] || result['2'];
      }

      console.log('Project IDs:', projectIDs);
      console.log('Allocated Budgets:', allAllocatedBudgets);
      console.log('Funds Sent:', allFundsSent);

      if (!projectIDs || projectIDs.length === 0) {
        setError('No projects found. Please add projects first.');
        setProjectData([]);
        setLoading(false);
        return;
      }

      // Fetch full project details for each ID
      const projectDetails = [];
      for (let i = 0; i < projectIDs.length; i++) {
        console.log(`Fetching details for project ${i}: ${projectIDs[i]}`);
        
        const project = await contract.methods.projects(projectIDs[i]).call();
        console.log(`Project ${i} details:`, project);
        
        const fundsToBuilder = await contract.methods.cityCorporationToBuilder(projectIDs[i]).call();
        console.log(`Funds to builder for project ${i}:`, fundsToBuilder);

        projectDetails.push({
          projectID: project.projectID || project[6],
          financeMinistry: project.financeMinistry || project[1],
          treasury: project.treasury || project[2],
          cityCorporation: project.cityCorporation || project[3],
          builder: project.builder || project[4],
          projectName: project.projectName || project[7],
          projectArea: project.projectArea || project[8],
          allocatedBudget: (project.allocatedBudget || project[0]).toString(),
          fundsSentToCityCorporation: allFundsSent[i].toString(),
          fundsSentToBuilder: fundsToBuilder.toString(),
          installmentNumber: (project.installmentNumber || project[9]).toString(),
        });
      }

      console.log('Processed project details:', projectDetails);
      setProjectData(projectDetails);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching project details:', error);
      setError(`Error: ${error.message}`);
      setLoading(false);
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
                disabled={loading}
              >
                {loading ? 'Loading...' : 'All Project Details'}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="px-6 py-4 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="px-6 py-8 text-center">
                <p className="text-slate-600 dark:text-slate-400">Loading project data...</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && projectData.length === 0 && !error && (
              <div className="px-6 py-8 text-center">
                <p className="text-slate-600 dark:text-slate-400">
                  No projects to display. Click "All Project Details" to fetch data.
                </p>
              </div>
            )}

            {/* Table */}
            {!loading && projectData.length > 0 && (
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
                    {filteredAndSortedData.map((project) => (
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
            )}
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
