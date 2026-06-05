import { useEffect, useState } from "react";

import { getOrderHistory } from "../../api/orderApi";

import { History, Receipt, CheckCircle2 } from "lucide-react";

function HistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await getOrderHistory();

      setOrders(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">Riwayat Pesanan</h1>

        <p className="text-slate-500 mt-2">Semua pesanan yang telah selesai</p>
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-md p-12 text-center">
          <History size={70} className="mx-auto text-slate-300" />

          <h3 className="mt-5 text-2xl font-bold text-slate-700">
            Belum Ada Riwayat
          </h3>

          <p className="text-slate-500 mt-2">
            Riwayat pesanan yang selesai akan muncul di sini
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="
                bg-white
                rounded-3xl
                shadow-md
                hover:shadow-xl
                transition-all
                duration-300
                p-6
              "
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Kiri */}
                <div>
                  <div className="flex items-center gap-3">
                    <Receipt size={22} className="text-blue-600" />

                    <h3 className="text-2xl font-bold text-slate-800">
                      {order.queueNumber}
                    </h3>
                  </div>

                  <p className="text-slate-500 mt-3">
                    {new Date(order.createdAt).toLocaleString("id-ID")}
                  </p>
                </div>

                {/* Kanan */}
                <div className="flex flex-col items-start md:items-end gap-3">
                  <span
                    className="
                      flex
                      items-center
                      gap-2
                      px-4
                      py-2
                      rounded-full
                      font-medium
                      bg-green-100
                      text-green-700
                    "
                  >
                    <CheckCircle2 size={16} />
                    Selesai
                  </span>

                  <span className="text-2xl font-bold text-blue-600">
                    Rp {Number(order.totalPrice).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
