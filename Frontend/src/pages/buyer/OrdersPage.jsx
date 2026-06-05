import { useEffect, useState } from "react";
import socket from "../../sockets";

import { getMyOrders } from "../../api/orderApi";

import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  ChefHat,
  Receipt,
} from "lucide-react";

function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await getMyOrders();

      const activeOrders = response.data.data.filter(
        (order) => order.status !== "COMPLETED",
      );

      setOrders(activeOrders);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    socket.emit("join-buyer", user.id);

    socket.on("order-status-updated", () => {
      fetchOrders();
    });

    return () => {
      socket.off("order-status-updated");
    };
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          icon: <Clock3 size={16} />,
          label: "Pending",
        };

      case "READY":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          icon: <ChefHat size={16} />,
          label: "Siap Diambil",
        };

      case "COMPLETED":
        return {
          bg: "bg-blue-100",
          text: "text-blue-700",
          icon: <CheckCircle2 size={16} />,
          label: "Selesai",
        };

      default:
        return {
          bg: "bg-slate-100",
          text: "text-slate-700",
          icon: null,
          label: status,
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">Pesanan Saya</h1>

        <p className="text-slate-500 mt-2">
          Pantau status pesananmu secara realtime
        </p>
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-md p-12 text-center">
          <ClipboardList size={70} className="mx-auto text-slate-300" />

          <h3 className="mt-5 text-2xl font-bold text-slate-700">
            Tidak Ada Pesanan Aktif
          </h3>

          <p className="text-slate-500 mt-2">
            Semua pesananmu sudah selesai atau belum ada pesanan.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {orders.map((order) => {
            const status = getStatusStyle(order.status);

            return (
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
                  {/* Left */}
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

                  {/* Right */}
                  <div className="flex flex-col items-start md:items-end gap-3">
                    <span
                      className={`
                        flex
                        items-center
                        gap-2
                        px-4
                        py-2
                        rounded-full
                        font-medium
                        ${status.bg}
                        ${status.text}
                      `}
                    >
                      {status.icon}
                      {status.label}
                    </span>

                    <span className="text-2xl font-bold text-blue-600">
                      Rp {Number(order.totalPrice).toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
