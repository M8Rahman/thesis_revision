import React, { useState } from "react";
import "./App/App.css";
import block from "../images/blockchain.png";
import {
  HiBuildingOffice2,
  HiCurrencyBangladeshi,
  HiArrowTrendingUp,
  HiRectangleStack,
  HiArrowRightCircle,
  HiBanknotes,
  HiCreditCard,
} from "react-icons/hi2";
import { Link } from "react-router-dom";

const Home = () => {
  const [dashboardData] = useState({
    totalProjects: 12,
    totalBudget: 45000000,
    fundsDisbursed: 28000000,
    activeInstallments: 8,
    recentProjects: [
      {
        projectID: "PRJ-2024-00123",
        projectName: "Dhaka Metro Rail Extension",
        projectArea: "Dhaka",
        allocatedBudget: "15000000",
        fundsSentToCityCorporation: "5000000",
        fundsSentToBuilder: "3000000",
        installmentNumber: "3",
        status: "Active",
      },
      {
        projectID: "PRJ-2024-00124",
        projectName: "Chittagong Port Development",
        projectArea: "Chittagong",
        allocatedBudget: "12000000",
        fundsSentToCityCorporation: "4000000",
        fundsSentToBuilder: "2500000",
        installmentNumber: "2",
        status: "Active",
      },
      {
        projectID: "PRJ-2024-00125",
        projectName: "Sylhet Airport Expansion",
        projectArea: "Sylhet",
        allocatedBudget: "8000000",
        fundsSentToCityCorporation: "2000000",
        fundsSentToBuilder: "1500000",
        installmentNumber: "1",
        status: "Planning",
      },
      {
        projectID: "PRJ-2024-00126",
        projectName: "Rajshahi Bridge Construction",
        projectArea: "Rajshahi",
        allocatedBudget: "10000000",
        fundsSentToCityCorporation: "3000000",
        fundsSentToBuilder: "2000000",
        installmentNumber: "2",
        status: "Active",
      },
    ],
  });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/60";
      case "Planning":
        return "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/60";
      case "Completed":
        return "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800/60";
      default:
        return "bg-slate-50 text-slate-800 border-slate-200 dark:bg-slate-700/40 dark:text-slate-300 dark:border-slate-600";
    }
  };

  return (
    <div className="mt-24">
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 rounded-lg dark:to-slate-800">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          {/* Header Card (kept airy but compact) */}
          <div className="rounded-2xl border border-slate-200 bg-white/90 dark:bg-slate-800/90 dark:border-slate-700 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 p-6">
              <div className="flex items-center gap-4">
                <img src={block} className="h-12 w-12" alt="Blockchain" />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    Government Fund Management
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Blockchain-based project tracking and fund distribution
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Row (cards) */}
          <section className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Total Projects",
                value: dashboardData.totalProjects,
                icon: <HiBuildingOffice2 className="h-6 w-6" />,
                bg: "bg-slate-100 dark:bg-slate-700",
                ic: "text-slate-700 dark:text-slate-200",
              },
              {
                label: "Total Budget",
                value: formatCurrency(dashboardData.totalBudget),
                icon: <HiCurrencyBangladeshi className="h-6 w-6" />,
                bg: "bg-emerald-100 dark:bg-emerald-900/40",
                ic: "text-emerald-700 dark:text-emerald-300",
              },
              {
                label: "Funds Disbursed",
                value: formatCurrency(dashboardData.fundsDisbursed),
                icon: <HiArrowTrendingUp className="h-6 w-6" />,
                bg: "bg-indigo-100 dark:bg-indigo-900/40",
                ic: "text-indigo-700 dark:text-indigo-300",
              },
              {
                label: "Active Installments",
                value: dashboardData.activeInstallments,
                icon: <HiRectangleStack className="h-6 w-6" />,
                bg: "bg-purple-100 dark:bg-purple-900/40",
                ic: "text-purple-700 dark:text-purple-300",
              },
            ].map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 flex flex-col justify-between h-full"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg shrink-0 ${kpi.bg}`}
                  >
                    <span className={kpi.ic}>{kpi.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {kpi.label}
                    </p>
                    <p className="mt-1 text-base md:text-lg text-slate-900 dark:text-white">
                      {kpi.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Recent Projects (table card) */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-white">
                  Recent Projects
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Latest project updates and fund distribution status
                </p>
              </div>
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                  <tr>
                    <th className="px-6 py-3">Project ID</th>
                    <th className="px-6 py-3">Project Name</th>
                    <th className="px-6 py-3">Area</th>
                    <th className="px-6 py-3">Budget</th>
                    <th className="px-6 py-3">City Corp Funds</th>
                    <th className="px-6 py-3">Builder Funds</th>
                    <th className="px-6 py-3">Installments</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {dashboardData.recentProjects.map((project, i) => (
                    <tr
                      key={project.projectID}
                      className={
                        i % 2
                          ? "bg-slate-50 dark:bg-slate-700/40"
                          : "bg-white dark:bg-slate-800"
                      }
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-white">
                        {project.projectID}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {project.projectName}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {project.projectArea}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {formatCurrency(parseInt(project.allocatedBudget))}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {formatCurrency(
                          parseInt(project.fundsSentToCityCorporation)
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {formatCurrency(parseInt(project.fundsSentToBuilder))}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {project.installmentNumber}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {project.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Quick Actions (cards with same inner gutter) */}
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-blue-200/70 bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white shadow-sm dark:border-blue-800/40">
              <div className="flex items-center gap-2">
                <HiBanknotes className="h-5 w-5 opacity-90" />
                <h3 className="text-lg font-semibold">Fund Transfer</h3>
              </div>
              <p className="mt-2 text-blue-100">
                Transfer allocated funds to builders
              </p>
              <Link
                to="/funds-transfer"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-blue-600 transition-colors hover:bg-blue-50"
              >
                Transfer Funds <HiArrowRightCircle className="h-5 w-5" />
              </Link>
            </div>

            <div className="rounded-2xl border border-emerald-200/70 bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white shadow-sm dark:border-emerald-800/40">
              <div className="flex items-center gap-2">
                <HiCreditCard className="h-5 w-5 opacity-90" />
                <h3 className="text-lg font-semibold">Installment Payment</h3>
              </div>
              <p className="mt-2 text-emerald-100">
                Process installment payments
              </p>
              <Link
                to="/installment-transfer"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium text-emerald-600 transition-colors hover:bg-emerald-50"
              >
                Pay Installment <HiArrowRightCircle className="h-5 w-5" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
