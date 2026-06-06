import { useState, useEffect, useRef } from "react";
import { Bell, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
function Navbar() {
  const { user, logout } = useAuth();
  const [openProfile, setOpenProfile] = useState(false);

  return (
    <header
      className="
        bg-white
        border-b
        border-slate-200
        px-4
        md:px-6
        lg:px-8
        py-4
      "
    >
      <div className="flex items-center justify-between">
        {/* Logo Mobile */}
        <div className="lg:hidden">
          <h1 className="font-bold text-lg text-slate-900">Kantin POLINES</h1>

          <p className="text-xs text-slate-500">Smart Canteen</p>
        </div>

        {/* User */}
        <div className="flex items-center gap-3 ml-auto">
          <button
            className="
              w-10
              h-10
              rounded-xl
              bg-slate-100
              hover:bg-slate-200
              flex
              items-center
              justify-center
            "
          >
            <Bell size={18} />
          </button>

          <div className="relative">
            <button onClick={() => setOpenProfile(!openProfile)} className="flex items-center gap-2">
              <div
                className="
        w-10
        h-10
        rounded-full
        bg-purple-500
        text-white
        flex
        items-center
        justify-center
        font-bold
      "
              >
                {user?.name?.charAt(0)}
              </div>

              <div className="hidden sm:block text-left">
                <p className="font-semibold text-slate-800">{user?.name}</p>

                <p className="text-sm text-slate-500">{user?.role}</p>
              </div>
            </button>

            {openProfile && (
              <div
                className="
        absolute
        right-0
        top-14
        w-56
        bg-white
        rounded-2xl
        shadow-xl
        border
        border-slate-200
        overflow-hidden
        z-50
      "
              >
                <div className="p-4 border-b border-slate-100">
                  <p className="font-semibold text-slate-900">{user?.name}</p>

                  <p className="text-sm text-slate-500">{user?.role}</p>
                </div>

                <button
                  onClick={logout}
                  className="
          w-full
          flex
          items-center
          gap-3
          px-4
          py-3
          text-red-500
          hover:bg-red-50
          transition
        "
                >
                  <LogOut size={18} />
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
