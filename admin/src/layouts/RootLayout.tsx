import React from "react";
import Sidebar from "./sidebar";
import Navbar from "../components/Navbar";

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen ">
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <Navbar />
          {children}
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
