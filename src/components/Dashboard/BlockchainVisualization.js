import React from "react";
import { Hash, FileText, Building } from "lucide-react";

const BlockchainVisualization = () => {
    return (
        <div className="p-0">
            <div className=" mx-auto">
                {/* Info Panel */}
                <div className=" bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-3xl shadow-2xl p-10 border-2 border-blue-200">
                <h2 className="text-3xl font-extrabold text-center text-blue-900 mb-8 tracking-tight drop-shadow">
                    How It Works
                </h2>
                <div className="grid md:grid-cols-3 gap-10">
                    <div className="text-center">
                    <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
                        <Hash className="text-blue-600" size={32} />
                    </div>
                    <h3 className="font-semibold text-blue-900 mb-2 text-xl drop-shadow">
                        Cryptographic Security
                    </h3>
                    <p className="text-base text-blue-700/90 font-medium">
                        Each block contains a unique hash linking to the previous block,
                        ensuring data integrity.
                    </p>
                    </div>
                    <div className="text-center">
                    <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
                        <Building className="text-green-600" size={32} />
                    </div>
                    <h3 className="font-semibold text-green-900 mb-2 text-xl drop-shadow">
                        Project Data
                    </h3>
                    <p className="text-base text-green-700/90 font-medium">
                        Comprehensive project information including budgets, addresses,
                        and stakeholder details.
                    </p>
                    </div>
                    <div className="text-center">
                    <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg">
                        <FileText className="text-purple-600" size={32} />
                    </div>
                    <h3 className="font-semibold text-purple-900 mb-2 text-xl drop-shadow">
                        Immutable Records
                    </h3>
                    <p className="text-base text-purple-700/90 font-medium">
                        Once recorded, project data cannot be altered, providing
                        transparent audit trails.
                    </p>
                    </div>
                </div>
                </div>
            </div>
        {/* Hide scrollbar for horizontal scroll */}
        <style>{`
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            /* Animation for block details */
            @keyframes fade-in {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
            }
            .animate-fade-in {
            animation: fade-in 0.35s cubic-bezier(.4,0,.2,1);
            }
        `}</style>
        </div>
    );
};

export default BlockchainVisualization;
