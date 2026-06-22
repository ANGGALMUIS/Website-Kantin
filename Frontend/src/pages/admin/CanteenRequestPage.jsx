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

      {/* DESKTOP TABLE */}
      <div className="hidden md:block bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-4 text-left">Nama User</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Nama Kantin</th>
              <th className="p-4 text-left">Proposal</th>
              <th className="p-4 text-left">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-t">
                <td className="p-4">{request.user.name}</td>

                <td className="p-4">{request.user.email}</td>

                <td className="p-4">{request.name}</td>

                <td className="p-4">
                  {request.proposalUrl ? (
                    <a
                      href={request.proposalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="
        inline-flex
        items-center
        px-4
        py-2
        bg-orange-100
        text-orange-600
        rounded-lg
        hover:bg-orange-200
        transition
      "
                    >
                      Lihat Proposal
                    </a>
                  ) : (
                    <span className="text-slate-400">Tidak ada file</span>
                  )}
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {requests.length === 0 && <div className="p-10 text-center text-slate-500">Tidak ada pengajuan</div>}
      </div>

      {/* MOBILE CARD */}
      <div className="md:hidden space-y-4">
        {requests.length === 0 && <div className="bg-white rounded-2xl shadow p-6 text-center text-slate-500">Tidak ada pengajuan</div>}

        {requests.map((request) => (
          <div
            key={request.id}
            className="
            bg-white
            rounded-2xl
            shadow
            p-4
          "
          >
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500">Nama User</p>

                <p className="font-semibold">{request.user.name}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Email</p>

                <p className="break-all">{request.user.email}</p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Nama Kantin</p>

                <p className="font-medium">{request.name}</p>

                <div>
                  <p className="text-xs text-slate-500">Proposal</p>

                  {request.proposalUrl ? (
                    <a
                      href={request.proposalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="
        inline-block
        mt-2
        px-4
        py-2
        bg-orange-100
        text-orange-600
        rounded-lg
      "
                    >
                      Lihat Proposal
                    </a>
                  ) : (
                    <p className="text-slate-400">Tidak ada file</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={() => handleApprove(request.id)}
                className="
                flex-1
                py-3
                bg-green-500
                text-white
                rounded-xl
                font-medium
              "
              >
                Approve
              </button>

              <button
                onClick={() => handleReject(request.id)}
                className="
                flex-1
                py-3
                bg-red-500
                text-white
                rounded-xl
                font-medium
              "
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CanteenRequestsPage;
