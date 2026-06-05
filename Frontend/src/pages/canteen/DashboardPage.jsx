import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getCanteenStats, getRevenueChart, getMyCanteen, updateCanteenStatus } from "../../api/canteenApi";

import RevenueChart from "../../components/RevenueChart";

function DashboardPage() {
  const [stats, setStats] = useState({
    totalMenus: 0,
    totalOrders: 0,
    revenue: 0,
    pendingOrders: 0,
    readyOrders: 0,
    completedOrders: 0,
  });

  const [canteen, setCanteen] = useState(null);

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const statsResponse = await getCanteenStats();

      const chartResponse = await getRevenueChart();

      const canteenResponse = await getMyCanteen();

      setStats(statsResponse.data.data);

      setChartData(chartResponse.data.data);

      setCanteen(canteenResponse.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleStatus = async () => {
    try {
      await updateCanteenStatus(!canteen.isOpen);

      const response = await getMyCanteen();

      setCanteen(response.data.data);

      toast.success(response.data.data.isOpen ? "Kantin berhasil dibuka" : "Kantin berhasil ditutup");
    } catch (error) {
      console.error(error);

      toast.error("Gagal mengubah status kantin");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Kantin</h1>

          <p className="text-slate-500 mt-1">Kelola operasional kantin Anda</p>
        </div>

        {canteen && (
          <button
            onClick={handleToggleStatus}
            className={`px-6 py-3 rounded-xl font-semibold text-white transition
    ${canteen?.isOpen ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
  `}
          >
            {canteen?.isOpen ? "🔴 Tutup Kantin" : "🟢 Buka Kantin"}
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Total Menu</h3>

          <p className="text-3xl font-bold">{stats.totalMenus}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Total Pesanan</h3>

          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Pendapatan</h3>

          <p className="text-3xl font-bold text-green-600">Rp {Number(stats.revenue).toLocaleString("id-ID")}</p>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl shadow">
          <h3 className="text-yellow-700">Pending</h3>

          <p className="text-3xl font-bold">{stats.pendingOrders}</p>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl shadow">
          <h3 className="text-blue-700">Ready</h3>

          <p className="text-3xl font-bold">{stats.readyOrders}</p>
        </div>

        <div className="bg-green-50 p-6 rounded-xl shadow">
          <h3 className="text-green-700">Completed</h3>

          <p className="text-3xl font-bold">{stats.completedOrders}</p>
        </div>
      </div>

      <div className="mt-8">
        <RevenueChart data={chartData} />
      </div>
    </div>
  );
}

export default DashboardPage;
