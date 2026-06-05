import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Store, Image as ImageIcon, Upload, Save } from "lucide-react";
import socket from "../../sockets";
import api from "../../api/axios";
import { getMyCanteen, updateMyCanteen } from "../../api/canteenApi";

function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    isOpen: false,
  });

  useEffect(() => {
    fetchProfile();

    socket.on("canteen-status-updated", (data) => {
      setForm((prev) => ({
        ...prev,
        isOpen: data.isOpen,
      }));
    });

    return () => {
      socket.off("canteen-status-updated");
    };
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getMyCanteen();

      setForm(response.data.data);
    } catch (error) {
      console.error(error);

      toast.error("Gagal mengambil profil kantin");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("image", file);

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setForm((prev) => ({
        ...prev,
        imageUrl: response.data.imageUrl,
      }));

      toast.success("Foto kantin berhasil diupload");
    } catch (error) {
      console.error(error);

      toast.error("Upload foto gagal");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await updateMyCanteen(form);

      toast.success("Profil kantin berhasil diperbarui");
    } catch (error) {
      console.error(error);

      toast.error("Gagal update profil");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-slate-500">Memuat profil...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">Profil Kantin</h1>

        <p className="text-slate-500 mt-2">Kelola informasi dan status kantin</p>
      </div>

      {/* Content */}
      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          rounded-3xl
          p-8
          shadow-sm
        "
      >
        <div className="grid lg:grid-cols-3 gap-8">
          {/* FOTO */}
          <div className="lg:col-span-1">
            <div
              className="
                bg-slate-50
                rounded-3xl
                p-6
                h-full
              "
            >
              <div className="flex items-center gap-2 mb-5">
                <ImageIcon size={20} className="text-orange-500" />

                <h3 className="font-semibold">Foto Kantin</h3>
              </div>

              <div className="flex justify-center">
                {form.imageUrl ? (
                  <img
                    src={form.imageUrl}
                    alt="Kantin"
                    className="
                      w-64
                      h-64
                      rounded-2xl
                      object-cover
                      border
                      border-slate-200
                    "
                  />
                ) : (
                  <div
                    className="
                      w-64
                      h-64
                      rounded-2xl
                      border-2
                      border-dashed
                      border-slate-300
                      flex
                      flex-col
                      items-center
                      justify-center
                    "
                  >
                    <Store size={50} className="text-slate-300" />

                    <p className="text-slate-400 mt-3">Belum ada foto</p>
                  </div>
                )}
              </div>

              <label
                className="
                  mt-6
                  flex
                  items-center
                  justify-center
                  gap-2
                  bg-orange-50
                  hover:bg-orange-100
                  text-orange-600
                  py-3
                  rounded-2xl
                  cursor-pointer
                  transition
                "
              >
                <Upload size={18} />

                {uploading ? "Mengupload..." : "Upload Foto"}

                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>

              {uploading && <p className="text-center text-sm text-slate-500 mt-3">Mohon tunggu, gambar sedang diupload...</p>}
            </div>
          </div>

          {/* FORM */}
          <div className="lg:col-span-2 space-y-6">
            {/* Nama */}
            <div>
              <label
                className="
                  block
                  mb-2
                  font-medium
                  text-slate-700
                "
              >
                Nama Kantin
              </label>

              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                placeholder="Nama Kantin"
                className="
                  w-full
                  px-4
                  py-3
                  rounded-2xl
                  border
                  border-slate-200
                  focus:outline-none
                  focus:ring-2
                  focus:ring-orange-200
                "
              />
            </div>

            {/* Deskripsi */}
            <div>
              <label
                className="
                  block
                  mb-2
                  font-medium
                  text-slate-700
                "
              >
                Deskripsi
              </label>

              <textarea
                rows={6}
                value={form.description || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                placeholder="Ceritakan tentang kantin Anda..."
                className="
                  w-full
                  px-4
                  py-3
                  rounded-2xl
                  border
                  border-slate-200
                  resize-none
                  focus:outline-none
                  focus:ring-2
                  focus:ring-orange-200
                "
              />
            </div>

            {/* Status */}
            <div>
              <label
                className="
      block
      mb-3
      font-medium
      text-slate-700
    "
              >
                Status Kantin
              </label>

              <div
                className={`
      inline-flex
      px-5
      py-3
      rounded-full
      font-medium
      ${form.isOpen ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
    `}
              >
                {form.isOpen ? "🟢 Kantin Buka" : "🔴 Kantin Tutup"}
              </div>

              <p className="text-sm text-slate-500 mt-2">Status kantin sekarang hanya dapat diubah melalui Dashboard.</p>
            </div>

            {/* Tombol */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={saving || uploading}
                className="
                  flex
                  items-center
                  gap-2
                  bg-orange-500
                  hover:bg-orange-600
                  text-white
                  px-8
                  py-3
                  rounded-2xl
                  transition
                  disabled:opacity-50
                "
              >
                <Save size={18} />

                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProfilePage;
