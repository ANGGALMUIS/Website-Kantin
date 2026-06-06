import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MobileBottomNav from "../components/MobileBottomNav";

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebarCollapsed") === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", collapsed);
  }, [collapsed]);

  return (
    <div className="h-screen flex bg-[#F8F9FB]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main
          className="
            flex-1
            overflow-y-auto
            p-4
            md:p-6
            lg:p-8
            pb-24
            lg:pb-8
          "
        >
          <Outlet />
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}

export default DashboardLayout;
