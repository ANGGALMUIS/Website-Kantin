import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Search, Clock3, Store } from "lucide-react";

import { getAllCanteens } from "../../api/canteenApi";
import socket from "../../sockets";

function HomePage() {
  const [canteens, setCanteens] = useState([]);
  const [filteredCanteens, setFilteredCanteens] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCanteens();
  }, []);

  useEffect(() => {
    socket.on("canteen-status-updated", (data) => {
      setCanteens((prev) =>
        prev.map((canteen) =>
          canteen.id === data.canteenId
            ? {
                ...canteen,
                isOpen: data.isOpen,
              }
            : canteen,
        ),
      );
    });

    return () => {
      socket.off("canteen-status-updated");
    };
  }, []);

  useEffect(() => {
    const filtered = canteens.filter((canteen) => canteen.name.toLowerCase().includes(search.toLowerCase()));

    setFilteredCanteens(filtered);
  }, [search, canteens]);

  const fetchCanteens = async () => {
    try {
      const response = await getAllCanteens();

      const data = response.data.data || [];

      setCanteens(data);
      setFilteredCanteens(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-900">Selamat Datang 👋</h1>

        <p className="text-slate-500 mt-2 text-lg">Pilih kantin dan pesan makanan favoritmu</p>
      </div>

      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Kantin Tersedia</h2>

          <p className="text-slate-500 text-sm mt-1">Temukan kantin favoritmu</p>
        </div>

        <div className="relative">
          <Search
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            placeholder="Cari kantin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              md:w-80
              bg-white
              border
              border-[#EEEEEE]
              rounded-2xl
              pl-11
              pr-4
              py-3.5
              shadow-sm
              focus:outline-none
              focus:ring-2
              focus:ring-orange-200
            "
          />
        </div>
      </div>

      {/* Empty */}
      {filteredCanteens.length === 0 ? (
        <div
          className="
            bg-white
            rounded-3xl
            border
            border-slate-200
            p-12
            text-center
          "
        >
          <Store size={60} className="mx-auto text-slate-300 mb-4" />

          <h3 className="text-xl font-bold text-slate-700">Kantin tidak ditemukan</h3>

          <p className="text-slate-500 mt-2">Coba gunakan kata kunci lain</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredCanteens.map((canteen) => (
            <div
              key={canteen.id}
              className="
                group
                bg-white
                rounded-[28px]
                border
                border-[#F1F1F1]
                shadow-sm
                overflow-hidden
                transition-all
                duration-300
                hover:-translate-y-2
                hover:shadow-2xl
              "
            >
              {/* Image */}
              <div className="h-44 bg-orange-50 overflow-hidden">
                {canteen.imageUrl ? (
                  <img
                    src={canteen.imageUrl}
                    alt={canteen.name}
                    className="
                      w-full
                      h-full
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-105
                    "
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Store size={48} className="text-orange-300" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-xl text-slate-900">{canteen.name}</h3>

                <p className="text-sm text-slate-500 mt-2 line-clamp-2 min-h-[40px]">{canteen.description || "Tidak ada deskripsi"}</p>

                <div className="flex items-center gap-2 text-slate-400 text-sm mt-4">
                  <Clock3 size={14} />
                  07.00 - 15.00
                </div>

                <div className="mt-4">
                  <span
                    className={`
                      px-3
                      py-1.5
                      rounded-full
                      text-xs
                      font-medium
                      ${canteen.isOpen ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}
                    `}
                  >
                    ● {canteen.isOpen ? "Buka" : "Tutup"}
                  </span>
                </div>

                <Link
                  to={`/buyer/canteens/${canteen.id}`}
                  className="
                    block
                    mt-5
                    text-center
                    bg-[#FF7A30]
                    hover:bg-[#F06B1F]
                    text-white
                    py-3
                    rounded-xl
                    font-medium
                    transition
                  "
                >
                  Lihat Menu
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
