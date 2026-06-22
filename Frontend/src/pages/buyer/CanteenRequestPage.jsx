import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createCanteenRequest, getMyRequest } from "../../api/canteenRequestApi";

function CanteenRequestPage() {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [request, setRequest] = useState(null);
  const [proposalFile, setProposalFile] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    proposalUrl: "",
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

  const uploadProposal = async (file) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/raw/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      console.log("CLOUDINARY RESPONSE:", data);

      const fileUrl = data.secure_url || data.url;

      if (!fileUrl) {
        throw new Error("URL proposal tidak ditemukan");
      }

      setForm((prev) => {
        const updatedForm = {
          ...prev,
          proposalUrl: fileUrl,
        };

        console.log("UPDATED FORM:", updatedForm);

        return updatedForm;
      });

      toast.success("Proposal berhasil diupload");
    } catch (error) {
      console.error(error);
      toast.error("Upload proposal gagal");
    } finally {
      setUploading(false);
    }
  };
  const handleProposalChange = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];

    if (!allowedTypes.includes(file.type)) {
      return toast.error("Hanya PDF atau DOCX yang diperbolehkan");
    }

    setProposalFile(file);

    await uploadProposal(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("FORM BEFORE SUBMIT:", form);

    if (!form.proposalUrl) {
      return toast.error("Upload proposal terlebih dahulu");
    }

    try {
      setSending(true);

      await createCanteenRequest(form);

      toast.success("Pengajuan berhasil dikirim");

      fetchRequest();
    } catch (error) {
      console.error(error.response?.data);
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
  `;

  if (loading) return <div className="p-10">Loading...</div>;

  if (request) {
    return (
      <div className="p-10">
        <h1 className="text-5xl font-bold">Status Pengajuan</h1>
        <p className="mt-3">{request.name}</p>

        {request.proposalUrl && (
          <a href={request.proposalUrl} target="_blank" rel="noreferrer" className="text-orange-500 underline mt-4 inline-block">
            Lihat Proposal
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-5xl font-bold text-slate-900">Ajukan Kantin</h1>

      <p className="text-slate-500 text-lg mt-2">Daftarkan kantinmu untuk mulai berjualan</p>

      <div className="mt-10 max-w-4xl">
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

          <div className="space-y-2">
            <label className="font-medium text-slate-700">Upload Proposal (PDF/DOCX)</label>

            <input type="file" accept=".pdf,.doc,.docx" onChange={handleProposalChange} className={inputStyle} />

            {proposalFile && <p className="text-sm text-green-600">File dipilih: {proposalFile.name}</p>}

            {uploading && <p className="text-sm text-orange-500">Uploading proposal...</p>}
          </div>

          <button type="submit" disabled={sending || uploading} className="bg-orange-500 text-white px-10 py-4 rounded-2xl">
            {sending ? "Mengirim..." : "Kirim Pengajuan"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CanteenRequestPage;
