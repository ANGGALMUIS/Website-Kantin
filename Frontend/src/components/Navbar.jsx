import { Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar({ collapsed }) {
  const { user } = useAuth();

  return (
    <header
      className="
        bg-white
        border-b
        border-slate-200
        px-8
        py-4
      "
    >
      <div className="flex items-center">
        {collapsed && (
          <div className="mr-auto">
            <h1 className="font-bold text-2xl text-slate-900">
              Kantin POLINES
            </h1>

            <p className="text-sm text-slate-500">Smart Canteen</p>
          </div>
        )}

        <div className="ml-auto flex items-center gap-5">
          <button
            className="
              w-11
              h-11
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

          <div className="flex items-center gap-3">
            <div
              className="
                w-11
                h-11
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

            <div>
              <p className="font-semibold text-slate-800">{user?.name}</p>

              <p className="text-sm text-slate-500">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
