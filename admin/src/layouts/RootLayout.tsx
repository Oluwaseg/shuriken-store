import React, { useState } from "react";
import Sidebar from "./sidebar";
import Navbar from "../components/Navbar";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} />
        <main className="flex-1 overflow-hidden">
          <Navbar toggleSidebar={toggleSidebar} />
          {children}
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
