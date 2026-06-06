import { NavLink } from "react-router-dom";
import { Home, ShoppingCart, ClipboardList, History, Store } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function MobileBottomNav() {
  const { cart } = useCart();
  const { user } = useAuth();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navClass = ({ isActive }) =>
    `
      flex
      flex-col
      items-center
      justify-center
      gap-1
      flex-1
      py-2
      transition
      ${isActive ? "text-orange-500" : "text-slate-500"}
    `;

  if (user?.role === "BUYER") {
    return (
      <div
        className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        bg-white
        border-t
        border-slate-200
        shadow-lg
        lg:hidden
      "
      >
        <div className="flex">
          <NavLink to="/buyer" end className={navClass}>
            <Home size={20} />
            <span className="text-xs">Home</span>
          </NavLink>

          <NavLink to="/buyer/cart" className={navClass}>
            <div className="relative">
              <ShoppingCart size={20} />

              {cartCount > 0 && (
                <span
                  className="
                  absolute
                  -top-2
                  -right-2
                  bg-red-500
                  text-white
                  text-[10px]
                  rounded-full
                  px-1
                "
                >
                  {cartCount}
                </span>
              )}
            </div>

            <span className="text-xs">Cart</span>
          </NavLink>

          <NavLink to="/buyer/orders" className={navClass}>
            <ClipboardList size={20} />
            <span className="text-xs">Order</span>
          </NavLink>

          <NavLink to="/buyer/history" className={navClass}>
            <History size={20} />
            <span className="text-xs">Riwayat</span>
          </NavLink>

          <NavLink to="/buyer/request-canteen" className={navClass}>
            <Store size={20} />
            <span className="text-xs">Kantin</span>
          </NavLink>
        </div>
      </div>
    );
  }

  if (user?.role === "SUPER_ADMIN") {
    return (
      <div
        className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        bg-white
        border-t
        border-slate-200
        lg:hidden
      "
      >
        <div className="flex">
          <NavLink to="/admin" className={navClass}>
            <Home size={20} />
            <span className="text-xs">Dashboard</span>
          </NavLink>

          <NavLink to="/admin/requests" className={navClass}>
            <ClipboardList size={20} />
            <span className="text-xs">Pengajuan</span>
          </NavLink>
        </div>
      </div>
    );
  }

  if (user?.role === "CANTEEN_ADMIN") {
    return (
      <div
        className="
        fixed
        bottom-0
        left-0
        right-0
        z-50
        bg-white
        border-t
        border-slate-200
        lg:hidden
      "
      >
        <div className="flex">
          <NavLink to="/canteen" className={navClass}>
            <Home size={20} />
            <span className="text-xs">Dashboard</span>
          </NavLink>

          <NavLink to="/canteen/menus" className={navClass}>
            <UtensilsCrossed size={20} />
            <span className="text-xs">Menu</span>
          </NavLink>

          <NavLink to="/canteen/orders" className={navClass}>
            <Package size={20} />
            <span className="text-xs">Pesanan</span>
          </NavLink>

          <NavLink to="/canteen/profile" className={navClass}>
            <UserCircle size={20} />
            <span className="text-xs">Profil</span>
          </NavLink>
        </div>
      </div>
    );
  }
}

export default MobileBottomNav;
