import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getPendingRequests, approveRequest, rejectRequest } from "../../api/adminApi";

function CanteenRequestsPage() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await getPendingRequests();

      setRequests(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveRequest(id);

      toast.success("Pengajuan disetujui");

      fetchRequests();
    } catch (error) {
      toast.error("Gagal approve");
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Masukkan alasan penolakan");

    if (!reason) return;

    try {
      await rejectRequest(id, reason);

      toast.success("Pengajuan ditolak");

      fetchRequests();
    } catch (error) {
      toast.error("Gagal reject");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Pengajuan Kantin</h1>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-4 text-left">Nama User</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Nama Kantin</th>
              <th className="p-4 text-left">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-t">
                <td className="p-4">{request.user.name}</td>

                <td className="p-4">{request.user.email}</td>

                <td className="p-4">{request.name}</td>

                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="
                      px-4
                      py-2
                      bg-green-500
                      text-white
                      rounded-lg
                    "
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(request.id)}
                    className="
                      px-4
                      py-2
                      bg-red-500
                      text-white
                      rounded-lg
                    "
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {requests.length === 0 && <div className="p-10 text-center text-slate-500">Tidak ada pengajuan</div>}
      </div>
    </div>
  );
}

export default CanteenRequestsPage;
