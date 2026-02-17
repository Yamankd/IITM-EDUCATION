import React from "react";
import { Link } from "react-router-dom";
import { Monitor } from "lucide-react";
import SEO from "../components/common/SEO";

const Portal = () => {
  return (
    <div className="min-h-screen bg-[#0B2A4A] flex flex-col items-center justify-center px-4">
      <SEO title="Portal" description="Authorized Access Only" noindex={true} />
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome to IITM Portal
        </h1>
        <p className="text-gray-300 text-lg">Select your role to continue</p>
      </div>

      <div className="w-full max-w-md">
        {/* Admin Portal Card - Centered & Focused */}
        <Link
          to="/admin-login"
          className="bg-white rounded-2xl p-10 shadow-2xl hover:scale-105 transition-transform group cursor-pointer block border-4 border-transparent hover:border-[#D6A419]"
        >
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="p-6 bg-yellow-100 rounded-full shadow-inner ring-4 ring-[#D6A419]/20">
              <Monitor size={64} className="text-[#D6A419]" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#0B2A4A] mb-2">
                Admin Portal
              </h2>
              <p className="text-gray-600">
                Secure access for authorized personnel only.
              </p>
            </div>
            <span className="w-full mt-4 px-8 py-4 bg-[#0B2A4A] text-white text-lg font-bold rounded-xl group-hover:bg-[#0f3b68] transition-all shadow-lg">
              Login to Console
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Portal;
