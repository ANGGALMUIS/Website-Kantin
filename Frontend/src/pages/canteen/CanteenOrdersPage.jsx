import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { ClipboardList, Clock3, CheckCircle2, ChefHat } from "lucide-react";
import socket from "../../sockets";
import { getCanteenOrders, updateOrderStatus } from "../../api/orderApi";

function CanteenOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ACTIVE");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (!orders.length) return;

    const canteenId = orders[0]?.canteenId;

    if (!canteenId) return;

    socket.emit("join-canteen", canteenId);

    console.log("JOIN ROOM:", canteenId);
  }, [orders]);

  useEffect(() => {
    const handleNewOrder = (newOrder) => {
      toast.success(`Pesanan baru ${newOrder.queueNumber}`);

      fetchOrders();
    };

    socket.on("new-order", handleNewOrder);

    return () => {
      socket.off("new-order", handleNewOrder);
    };
  }, []);

  useEffect(() => {
    const handleOrderUpdated = () => {
      fetchOrders();
    };

    socket.on("order-updated", handleOrderUpdated);

    return () => {
      socket.off("order-updated", handleOrderUpdated);
    };
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("SOCKET CONNECTED:", socket.id);
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await getCanteenOrders();

      setOrders(response.data.data || []);
    } catch (error) {
      console.error(error);

      toast.error("Gagal mengambil data pesanan");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);

      toast.success("Status pesanan berhasil diperbarui");

      fetchOrders();
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Gagal mengubah status");
    }
  };

  const stats = useMemo(() => {
    return {
      total: orders.length,

      pending: orders.filter((o) => o.status === "PENDING").length,

      accepted: orders.filter((o) => o.status === "ACCEPTED").length,

      ready: orders.filter((o) => o.status === "READY").length,

      completed: orders.filter((o) => o.status === "COMPLETED").length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    switch (filter) {
      case "ACTIVE":
        return orders.filter((order) => ["PENDING", "ACCEPTED", "READY"].includes(order.status));

      case "PENDING":
        return orders.filter((order) => order.status === "PENDING");

      case "ACCEPTED":
        return orders.filter((order) => order.status === "ACCEPTED");

      case "READY":
        return orders.filter((order) => order.status === "READY");

      case "COMPLETED":
        return orders.filter((order) => order.status === "COMPLETED");

      default:
        return orders;
    }
  }, [orders, filter]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "ACCEPTED":
        return "bg-blue-100 text-blue-700";

      case "READY":
        return "bg-green-100 text-green-700";

      case "COMPLETED":
        return "bg-slate-100 text-slate-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">Kelola Pesanan</h1>

        <p className="text-slate-500 mt-2">Pantau dan proses pesanan pelanggan</p>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <ClipboardList size={22} className="text-orange-500" />
            <span className="text-slate-500">Total</span>
          </div>

          <h2 className="text-3xl font-bold mt-3">{stats.total}</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Clock3 size={22} className="text-yellow-500" />
            <span className="text-slate-500">Pending</span>
          </div>

          <h2 className="text-3xl font-bold mt-3 text-yellow-600">{stats.pending}</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <ChefHat size={22} className="text-blue-500" />
            <span className="text-slate-500">Accepted</span>
          </div>

          <h2 className="text-3xl font-bold mt-3 text-blue-600">{stats.accepted}</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <ChefHat size={22} className="text-green-500" />
            <span className="text-slate-500">Ready</span>
          </div>

          <h2 className="text-3xl font-bold mt-3 text-green-600">{stats.ready}</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={22} className="text-slate-500" />
            <span className="text-slate-500">Completed</span>
          </div>

          <h2 className="text-3xl font-bold mt-3 text-slate-700">{stats.completed}</h2>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        {["ACTIVE", "PENDING", "ACCEPTED", "READY", "COMPLETED"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-4 py-2 rounded-xl transition ${filter === item ? "bg-orange-500 text-white" : "bg-white text-slate-600 hover:bg-orange-50"}`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Orders */}
      {loading ? (
        <div className="text-center py-20">Memuat pesanan...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <p className="text-slate-500">Tidak ada pesanan</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="
                bg-white
                rounded-3xl
                p-6
                shadow-sm
                hover:shadow-md
                transition
              "
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h2 className="text-2xl font-bold text-orange-500">{order.queueNumber}</h2>

                  <p className="text-slate-500 text-sm">{order.buyer?.name}</p>
                </div>

                <span
                  className={`
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-medium
                    ${getStatusStyle(order.status)}
                  `}
                >
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.menu?.imageUrl}
                      alt={item.menu?.name}
                      className="
                        w-16
                        h-16
                        rounded-xl
                        object-cover
                      "
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold">{item.menu?.name}</h3>

                      <p className="text-sm text-slate-500">Qty {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="mt-5 pt-5 border-t border-slate-100">
                <p className="text-slate-500 text-sm">Total Pesanan</p>

                <h3 className="text-2xl font-bold text-orange-600">Rp {Number(order.totalPrice).toLocaleString("id-ID")}</h3>
              </div>

              {/* Action */}
              <div className="mt-5">
                {order.status === "PENDING" && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, "ACCEPTED")}
                    className="
                      w-full
                      bg-blue-500
                      hover:bg-blue-600
                      text-white
                      py-3
                      rounded-xl
                    "
                  >
                    Terima Pesanan
                  </button>
                )}

                {order.status === "ACCEPTED" && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, "READY")}
                    className="
                      w-full
                      bg-green-500
                      hover:bg-green-600
                      text-white
                      py-3
                      rounded-xl
                    "
                  >
                    Siap Diambil
                  </button>
                )}

                {order.status === "READY" && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, "COMPLETED")}
                    className="
                      w-full
                      bg-orange-500
                      hover:bg-orange-600
                      text-white
                      py-3
                      rounded-xl
                    "
                  >
                    Selesaikan Pesanan
                  </button>
                )}

                {order.status === "COMPLETED" && (
                  <div
                    className="
                      text-center
                      py-3
                      rounded-xl
                      bg-green-50
                      text-green-700
                      font-medium
                    "
                  >
                    ✅ Pesanan selesai
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CanteenOrdersPage;
