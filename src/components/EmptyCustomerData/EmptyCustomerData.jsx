/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";

const EmptyCustomerData = ({ title, subtitle, buttonText, link }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[500px] text-center">
      <h2 className="text-3xl font-bold text-blue-800 mb-4 animate-fadeIn">
        {title}
      </h2>
      <p className="text-xl text-gray-600 mb-6 max-w-md animate-fadeIn animation-delay-200">
        {subtitle}
      </p>
      <Link
        to={link}
        className="group relative inline-flex items-center overflow-hidden rounded-full bg-blue-600 px-8 py-3 text-white focus:outline-none focus:ring active:bg-blue-500"
      >
        <span className="text-sm font-medium transition-all group-hover:mr-4">
          {buttonText}
        </span>
      </Link>
    </div>
  );
};

export default EmptyCustomerData;
