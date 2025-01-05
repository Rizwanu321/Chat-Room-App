import React from "react";
import { Menu, X } from "lucide-react";

const Sidebar = ({ showSidebar, onToggleSidebar, children, onLogout }) => {
  return (
    <>
      <button
        onClick={onToggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
      >
        {showSidebar ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        onClick={onToggleSidebar}
        className={`
        fixed lg:static w-64 md:w-72 h-full bg-gray-600 text-white transform transition-transform duration-300 ease-in-out
        ${showSidebar ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        flex flex-col z-40
      `}
      >
        {children}
        <button
          onClick={onLogout}
          className="m-3 md:m-4 p-2 md:p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          Logout
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
