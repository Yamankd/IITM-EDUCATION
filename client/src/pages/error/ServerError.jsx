import React from "react";
import { Link } from "react-router-dom";

const ServerError = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <h1 className="text-9xl font-bold text-red-500">500</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-4">
        Internal Server Error
      </h2>
      <p className="text-gray-600 mt-2 mb-8">
        Oops! Something went wrong on our end. Please try again later.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default ServerError;
