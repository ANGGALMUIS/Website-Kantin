import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import { Home, ShoppingCart, ClipboardCheck, ClipboardList, History, Store, UtensilsCrossed, Package, UserCircle, Shield, LogOut } from "lucide-react";

function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();

  const { cart } = useCart();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const linkClass = ({ isActive }) =>
    `
      flex
      items-center
      gap-3
      px-4
      py-3
      rounded-2xl
      transition-all
      duration-200
      ${isActive ? "bg-[#FFF1E8] text-[#FF7A00] font-semibold" : "text-slate-600 hover:bg-slate-100"}
    `;

  return (
    <aside
      className={`
        bg-white
        border-r
        border-slate-200
        flex
        flex-col
        transition-all
        duration-300
        h-screen
        shrink-0
        ${collapsed ? "w-20" : "w-72"}
      `}
    >
      {/* Logo */}
      <div className="p-5">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
            flex
            items-center
            gap-3
            w-full
            group
          "
        >
          <div
            className="
              w-12
              h-12
              rounded-2xl
              bg-orange-500
              flex
              items-center
              justify-center
              text-white
              text-xl
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:rotate-6
              group-hover:bg-orange-600
            "
          >
            🍽️
          </div>

          {!collapsed && (
            <div className="text-left">
              <h1 className="font-bold text-2xl text-slate-900">Kantin</h1>

              <p className="text-slate-500">POLINES</p>
            </div>
          )}
        </button>
      </div>

      {/* Menu */}
      <div className="flex-1 px-4 space-y-2">
        {!collapsed && <p className="text-xs font-semibold text-slate-400 px-3 mb-3">MENU</p>}

        {user?.role === "BUYER" && (
          <>
            <NavLink to="/buyer" end className={linkClass} title="Beranda">
              <Home size={20} />

              {!collapsed && <span>Beranda</span>}
            </NavLink>

            <NavLink to="/buyer/cart" className={linkClass} title="Keranjang">
              <ShoppingCart size={20} />

              {!collapsed ? (
                <>
                  <span className="flex-1">Keranjang</span>

                  {cartCount > 0 && (
                    <span
                      className="
                        bg-red-500
                        text-white
                        text-xs
                        px-2
                        py-1
                        rounded-full
                      "
                    >
                      {cartCount}
                    </span>
                  )}
                </>
              ) : (
                cartCount > 0 && (
                  <span
                    className="
                      absolute
                      top-1
                      right-1
                      w-2
                      h-2
                      bg-red-500
                      rounded-full
                    "
                  />
                )
              )}
            </NavLink>

            <NavLink to="/buyer/orders" className={linkClass} title="Pesanan">
              <ClipboardList size={20} />

              {!collapsed && <span>Pesanan</span>}
            </NavLink>

            <NavLink to="/buyer/history" className={linkClass} title="Riwayat">
              <History size={20} />

              {!collapsed && <span>Riwayat</span>}
            </NavLink>

            <NavLink to="/buyer/request-canteen" className={linkClass} title="Buka Kantin">
              <Store size={20} />

              {!collapsed && <span>Buka Kantin</span>}
            </NavLink>
          </>
        )}

        {user?.role === "CANTEEN_ADMIN" && (
          <>
            <NavLink to="/canteen" end className={linkClass} title="Dashboard">
              <Home size={20} />

              {!collapsed && <span>Dashboard</span>}
            </NavLink>

            <NavLink to="/canteen/menus" className={linkClass} title="Menu">
              <UtensilsCrossed size={20} />

              {!collapsed && <span>Menu</span>}
            </NavLink>

            <NavLink to="/canteen/orders" className={linkClass} title="Pesanan">
              <Package size={20} />

              {!collapsed && <span>Pesanan</span>}
            </NavLink>

            <NavLink to="/canteen/profile" className={linkClass} title="Profil Kantin">
              <UserCircle size={20} />

              {!collapsed && <span>Profil Kantin</span>}
            </NavLink>
          </>
        )}

        {user?.role === "SUPER_ADMIN" && (
          <>
            <NavLink to="/admin" end className={linkClass}>
              <Shield size={20} />

              {!collapsed && <span>Dashboard Admin</span>}
            </NavLink>

            <NavLink to="/admin/requests" className={linkClass}>
              <ClipboardCheck size={20} />

              {!collapsed && <span>Pengajuan Kantin</span>}
            </NavLink>
          </>
        )}
      </div>

      {/* Logout */}
      <div
        className="
    mx-4
    p-4
    border-t
    border-slate-200
  "
      >
        <button
          onClick={logout}
          title="Keluar"
          className={`
      w-full
      flex
      items-center
      rounded-2xl
      text-red-500
      hover:bg-red-50
      transition
      py-3
      ${collapsed ? "justify-center" : "justify-start gap-3 px-4"}
    `}
        >
          <LogOut size={20} />

          {!collapsed && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
