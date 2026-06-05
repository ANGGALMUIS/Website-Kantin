import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAdminStats, getPendingCanteens, approveCanteen, rejectCanteen } from "../../api/adminApi";

function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBuyers: 0,
    totalCanteens: 0,

    pendingCanteens: 0,
    activeCanteens: 0,

    totalOrders: 0,
  });

  const [pendingCanteens, setPendingCanteens] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsResponse = await getAdminStats();

      console.log("ADMIN STATS");
      console.log(statsResponse.data);

      const pendingResponse = await getPendingCanteens();

      console.log("PENDING");
      console.log(pendingResponse.data);

      setStats(statsResponse.data.data);

      setPendingCanteens(pendingResponse.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleApprove = async (id) => {
    try {
      await approveCanteen(id);

      toast.success("Kantin berhasil diapprove");

      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectCanteen(id);

      toast.success("Kantin berhasil direject");

      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>

      {/* Statistik */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-gray-500">Total User</h3>

          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-gray-500">Total Buyer</h3>

          <p className="text-3xl font-bold">{stats.totalBuyers}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-gray-500">Total Kantin</h3>

          <p className="text-3xl font-bold">{stats.totalCanteens}</p>
        </div>

        <div className="bg-yellow-50 p-6 rounded-xl shadow">
          <h3 className="text-yellow-700">Pending Kantin</h3>

          <p className="text-3xl font-bold">{stats.pendingCanteens}</p>
        </div>

        <div className="bg-green-50 p-6 rounded-xl shadow">
          <h3 className="text-green-700">Kantin Active</h3>

          <p className="text-3xl font-bold">{stats.activeCanteens}</p>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl shadow">
          <h3 className="text-blue-700">Total Pesanan</h3>

          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>
      </div>

      {/* Pending Kantin */}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-xl font-semibold mb-4">Pending Kantin</h2>

        {pendingCanteens.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-slate-500">Tidak ada kantin yang menunggu approval</p>
          </div>
        ) : (
          pendingCanteens.map((canteen) => (
            <div key={canteen.id} className="border rounded-lg p-4 mb-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{canteen.name}</h3>

                <p className="text-gray-500">{canteen.email}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleApprove(canteen.id)} className="bg-green-500 text-white px-4 py-2 rounded">
                  Approve
                </button>

                <button onClick={() => handleReject(canteen.id)} className="bg-red-500 text-white px-4 py-2 rounded">
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
