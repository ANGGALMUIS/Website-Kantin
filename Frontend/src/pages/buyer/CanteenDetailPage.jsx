import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../../sockets";

import { useCart } from "../../context/CartContext";
import { getCanteenById, getCanteenMenus } from "../../api/canteenApi";

function CanteenDetailPage() {
  const { id } = useParams();

  const { addToCart } = useCart();

  const [canteen, setCanteen] = useState(null);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    socket.emit("join-canteen", id);

    socket.on("menu-updated", fetchData);

    socket.on("canteen-status-updated", (data) => {
      if (data.canteenId === id) {
        setCanteen((prev) => ({
          ...prev,
          isOpen: data.isOpen,
        }));
      }
    });

    return () => {
      socket.off("menu-updated");
      socket.off("canteen-status-updated");
    };
  }, [id]);

  const fetchData = async () => {
    try {
      const canteenRes = await getCanteenById(id);
      const menuRes = await getCanteenMenus(id);

      setCanteen(canteenRes.data?.data || canteenRes.data);

      const menuData = menuRes.data?.data || menuRes.data;

      setMenus(Array.isArray(menuData) ? menuData : []);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setMenus([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMenus = menus.filter((menu) => menu.name.toLowerCase().includes(search.toLowerCase()));

  const groupedMenus = filteredMenus.reduce((acc, menu) => {
    const category = menu.category?.name || "Lainnya";

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(menu);

    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <h2 className="text-xl font-semibold text-slate-500">Loading...</h2>
      </div>
    );
  }

  if (!canteen) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Kantin tidak ditemukan</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="
          flex
          items-center
          gap-2
          px-5
          py-3
          bg-white
          border
          border-slate-200
          rounded-2xl
          text-slate-600
          hover:bg-slate-50
          transition
          mb-6
        "
      >
        ← Kembali
      </button>

      {/* Hero Header */}
      <div
        className="
          bg-white
          rounded-3xl
          border
          border-slate-100
          shadow-sm
          p-8
          mb-8
        "
      >
        <h1 className="text-4xl font-bold text-slate-900">{canteen.name}</h1>

        <p className="text-slate-500 mt-3 text-lg">{canteen.description || "Tidak ada deskripsi kantin"}</p>

        <div className="flex items-center gap-4 mt-5 flex-wrap">
          <span
            className={`
              px-4
              py-2
              rounded-full
              text-sm
              font-semibold
              ${canteen.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
            `}
          >
            ● {canteen.isOpen ? "Buka Sekarang" : "Tutup"}
          </span>

          <span className="text-slate-500 font-medium">🕒 07.00 - 14.00</span>
        </div>

        {!canteen.isOpen && (
          <div
            className="
              mt-6
              bg-red-50
              border
              border-red-200
              text-red-700
              px-5
              py-4
              rounded-2xl
              font-medium
            "
          >
            ⚠️ Kantin sedang tutup. Menu tidak dapat ditambahkan ke keranjang.
          </div>
        )}
      </div>

      {/* Search */}
      <div className="mb-10">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Cari menu favorit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              pl-12
              pr-4
              py-4
              bg-white
              border
              border-slate-200
              rounded-2xl
              focus:outline-none
              focus:ring-4
              focus:ring-orange-100
              focus:border-orange-400
              transition-all
            "
          />

          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        </div>
      </div>

      {/* Empty State */}
      {filteredMenus.length === 0 ? (
        <div
          className="
            bg-white
            rounded-3xl
            border
            border-slate-100
            shadow-sm
            p-12
            text-center
          "
        >
          <div className="text-5xl mb-4">🍽️</div>

          <p className="text-slate-500">Menu tidak ditemukan</p>
        </div>
      ) : (
        Object.entries(groupedMenus).map(([category, categoryMenus]) => (
          <div key={category} className="mb-14">
            {/* Category */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">{category}</h2>

              <div className="h-px bg-slate-200 mt-3"></div>
            </div>

            {/* Menu Grid */}
            <div
              className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  md:grid-cols-3
                  lg:grid-cols-4
                  gap-6
                "
            >
              {categoryMenus.map((menu) => (
                <div
                  key={menu.id}
                  className="
                      group
                      bg-white
                      border
                      border-slate-100
                      rounded-3xl
                      overflow-hidden
                      shadow-sm
                      hover:shadow-lg
                      hover:-translate-y-1
                      transition-all
                      duration-300
                    "
                >
                  {/* Image */}
                  {menu.imageUrl ? (
                    <img
                      src={menu.imageUrl}
                      alt={menu.name}
                      className="
                          w-full
                          h-44
                          object-cover
                        "
                    />
                  ) : (
                    <div
                      className="
                          w-full
                          h-44
                          bg-orange-50
                          flex
                          items-center
                          justify-center
                          text-5xl
                        "
                    >
                      🍽️
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5">
                    <h3
                      className="
                          text-lg
                          font-bold
                          text-slate-900
                        "
                    >
                      {menu.name}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">{category}</p>

                    {menu.description && <p className="text-sm text-slate-400 mt-3 line-clamp-2">{menu.description}</p>}

                    <div className="flex items-center justify-between mt-5">
                      <span
                        className="
                            text-xl
                            font-bold
                            text-orange-500
                          "
                      >
                        Rp {Number(menu.price).toLocaleString("id-ID")}
                      </span>

                      <button
                        disabled={!canteen.isOpen}
                        onClick={() => addToCart(menu)}
                        className={`
                            w-12
                            h-12
                            rounded-2xl
                            text-white
                            text-xl
                            font-bold
                            flex
                            items-center
                            justify-center
                            transition-all

                            ${canteen.isOpen ? "bg-orange-500 hover:bg-orange-600 hover:scale-105" : "bg-slate-300 cursor-not-allowed"}
                          `}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default CanteenDetailPage;
