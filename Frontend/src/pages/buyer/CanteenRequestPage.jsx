import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { createCanteenRequest, getMyRequest } from "../../api/canteenRequestApi";

function CanteenRequestPage() {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [request, setRequest] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetchRequest();
  }, []);

  const fetchRequest = async () => {
    try {
      const response = await getMyRequest();

      setRequest(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSending(true);

      await createCanteenRequest(form);

      toast.success("Pengajuan berhasil dikirim");

      fetchRequest();
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengirim pengajuan");
    } finally {
      setSending(false);
    }
  };

  const inputStyle = `
    w-full
    px-5
    py-4
    rounded-2xl
    border
    border-slate-200
    bg-white
    text-slate-700
    placeholder:text-slate-400
    focus:outline-none
    focus:ring-4
    focus:ring-orange-100
    focus:border-orange-400
    transition-all
  `;

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  // =====================================
  // STATUS PENGAJUAN
  // =====================================
  if (request) {
    return (
      <div className="p-10">
        <h1 className="text-5xl font-bold text-slate-900">Status Pengajuan</h1>

        <p className="text-slate-500 text-lg mt-2">Pantau status pengajuan kantinmu</p>

        <div className="mt-10 max-w-4xl">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <p className="text-sm text-slate-500 mb-2">Nama Kantin</p>

            <h2 className="text-3xl font-bold text-slate-900">{request.name}</h2>

            <div className="mt-6">
              {request.status === "PENDING" && <div className="inline-flex items-center px-5 py-3 rounded-full bg-yellow-100 text-yellow-700 font-medium">🟡 Menunggu Persetujuan Admin</div>}

              {request.status === "APPROVED" && <div className="inline-flex items-center px-5 py-3 rounded-full bg-green-100 text-green-700 font-medium">🟢 Pengajuan Disetujui</div>}

              {request.status === "REJECTED" && <div className="inline-flex items-center px-5 py-3 rounded-full bg-red-100 text-red-700 font-medium">🔴 Pengajuan Ditolak</div>}
            </div>

            {request.rejectionReason && (
              <div className="mt-6 bg-red-50 border border-red-100 rounded-2xl p-5">
                <h3 className="font-semibold text-red-700">Alasan Penolakan</h3>

                <p className="text-red-600 mt-2">{request.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =====================================
  // FORM PENGAJUAN
  // =====================================
  return (
    <div className="p-10">
      <h1 className="text-5xl font-bold text-slate-900">Ajukan Kantin</h1>

      <p className="text-slate-500 text-lg mt-2">Daftarkan kantinmu untuk mulai berjualan</p>

      <div className="mt-8 max-w-4xl">
        <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6">
          <h3 className="font-semibold text-orange-700 text-lg mb-2">Informasi</h3>

          <p className="text-orange-600">Pengajuan akan diperiksa oleh admin terlebih dahulu. Setelah disetujui, akunmu akan berubah menjadi pemilik kantin dan dapat mengelola menu.</p>
        </div>
      </div>

      <div className="mt-10 max-w-4xl">
        <h2 className="text-2xl font-semibold text-slate-900">Data Kantin</h2>

        <p className="text-slate-500 mt-1 mb-6">Isi data kantin yang ingin didaftarkan</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Nama Kantin"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className={inputStyle}
          />

          <textarea
            rows={6}
            placeholder="Deskripsi Kantin"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            className={`${inputStyle} resize-none`}
          />

          <button
            type="submit"
            disabled={sending}
            className="
              bg-orange-500
              hover:bg-orange-600
              text-white
              font-semibold
              px-10
              py-4
              rounded-2xl
              transition-all
              duration-200
              hover:shadow-md
              disabled:bg-slate-300
              disabled:cursor-not-allowed
            "
          >
            {sending ? "Mengirim..." : "Kirim Pengajuan"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CanteenRequestPage;
