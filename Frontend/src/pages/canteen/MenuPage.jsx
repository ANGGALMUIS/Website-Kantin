import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { Plus, Pencil, Trash2, Search, X, Image as ImageIcon } from "lucide-react";

import { getMyMenus, createMenu, updateMenu, deleteMenu, updateMenuAvailability } from "../../api/menuApi";

import { getCategories } from "../../api/categoryApi";

import { uploadImage } from "../../api/uploadApi";

function MenuPage() {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);

  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingMenu, setEditingMenu] = useState(null);

  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    categoryId: "",
  });

  useEffect(() => {
    fetchMenus();
    fetchCategories();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await getMyMenus();
      console.log("CATEGORY RESPONSE =", response.data);
      setMenus(response.data.data || []);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Gagal mengambil menu");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();

      console.log("CATEGORY RESPONSE:", response.data);

      setCategories(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setEditingMenu(null);

    setForm({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      categoryId: "",
    });

    setShowModal(false);
  };

  const handleEdit = (menu) => {
    setEditingMenu(menu);

    setForm({
      name: menu.name || "",
      description: menu.description || "",
      price: menu.price || "",
      imageUrl: menu.imageUrl || "",
      categoryId: menu.categoryId || "",
    });

    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (uploading) {
      toast.error("Tunggu upload gambar selesai");
      return;
    }

    if (!form.imageUrl) {
      toast.error("Silakan upload gambar menu terlebih dahulu");
      return;
    }
    if (submitting) return;

    try {
      setSubmitting(true);

      if (editingMenu) {
        await updateMenu(editingMenu.id, form);

        toast.success("Menu berhasil diperbarui");
      } else {
        await createMenu(form);

        toast.success("Menu berhasil ditambahkan");
      }

      await fetchMenus();

      resetForm();
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Hapus menu ini?");

    if (!confirmed) return;

    try {
      await deleteMenu(id);

      toast.success("Menu berhasil dihapus");

      fetchMenus();
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Gagal menghapus menu");
    }
  };

  const handleToggleAvailability = async (id, currentValue) => {
    try {
      await updateMenuAvailability(id, !currentValue);

      fetchMenus();
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Gagal mengubah status");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const response = await uploadImage(file);

      setForm((prev) => ({
        ...prev,
        imageUrl: response.data.imageUrl,
      }));

      toast.success("Gambar berhasil diupload");
    } catch (error) {
      console.error(error);

      toast.error("Upload gambar gagal");
    } finally {
      setUploading(false);
    }
  };

  const filteredMenus = useMemo(() => {
    return menus.filter((menu) => menu.name.toLowerCase().includes(search.toLowerCase()));
  }, [menus, search]);

  const stats = useMemo(() => {
    return {
      total: menus.length,

      available: menus.filter((menu) => menu.isAvailable).length,

      unavailable: menus.filter((menu) => !menu.isAvailable).length,
    };
  }, [menus]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Kelola Menu</h1>

          <p className="text-slate-500 mt-2">Tambah, edit, dan kelola menu kantin</p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="
            flex items-center gap-2
            bg-orange-500
            hover:bg-orange-600
            text-white
            px-5
            py-3
            rounded-xl
            transition
          "
        >
          <Plus size={18} />
          Tambah Menu
        </button>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            placeholder="Cari menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
    w-full
    pl-11
    pr-4
    py-3
    bg-white
    border
    border-slate-200
    rounded-2xl
    shadow-sm
    text-slate-700
    placeholder:text-slate-400

    focus:outline-none
    focus:ring-2
    focus:ring-orange-200
    focus:border-orange-400

    transition-all
  "
          />
        </div>
      </div>

      {/* Statistik */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-slate-500">Total Menu</p>

          <h2 className="text-3xl font-bold mt-2">{stats.total}</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-slate-500">Tersedia</p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">{stats.available}</h2>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-slate-500">Tidak Tersedia</p>

          <h2 className="text-3xl font-bold text-red-600 mt-2">{stats.unavailable}</h2>
        </div>
      </div>

      {/* Tabel Menu */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div
          className="
    grid
    grid-cols-12
    gap-4
    px-6
    py-4
    bg-slate-50
    border-b
    border-slate-200
    font-semibold
    text-slate-700
  "
        >
          <div className="col-span-5">Menu</div>

          <div className="col-span-2">Kategori</div>

          <div className="col-span-2">Harga</div>

          <div className="col-span-1">Status</div>

          <div className="col-span-2">Aksi</div>
        </div>
        {filteredMenus.length === 0 && <div className="p-10 text-center text-slate-500">Tidak ada menu ditemukan</div>}

        {filteredMenus.map((menu) => (
          <div
            key={menu.id}
            className="
  grid
  grid-cols-12
  gap-4
  px-6
  py-5
  border-b
  border-slate-100
  items-center
  hover:bg-slate-50
  transition-colors
"
          >
            <div className="col-span-5 flex items-center gap-4">
              {menu.imageUrl ? (
                <img
                  src={menu.imageUrl}
                  alt={menu.name}
                  className="
                    w-16
                    h-16
                    rounded-xl
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    w-16
                    h-16
                    rounded-xl
                    bg-slate-100
                    flex
                    items-center
                    justify-center
                  "
                >
                  <ImageIcon size={22} className="text-slate-300" />
                </div>
              )}

              <div>
                <h3 className="font-semibold">{menu.name}</h3>

                <p className="text-sm text-slate-500">{menu.description}</p>
              </div>
            </div>

            <div className="col-span-2">{menu.category?.name || "Tanpa Kategori"}</div>

            <div className="col-span-2 font-semibold text-orange-600">Rp {Number(menu.price).toLocaleString("id-ID")}</div>

            <div className="col-span-1">
              <button
                onClick={() => handleToggleAvailability(menu.id, menu.isAvailable)}
                className={`
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  ${menu.isAvailable ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                `}
              >
                {menu.isAvailable ? "Aktif" : "Nonaktif"}
              </button>
            </div>

            <div className="col-span-2 flex gap-2">
              <button
                onClick={() => handleEdit(menu)}
                className="
                  p-2
                  rounded-lg
                  bg-orange-500
                  hover:bg-orange-600
                  text-white
                "
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => handleDelete(menu.id)}
                className="
                  p-2
                  rounded-lg
                  bg-red-500
                  hover:bg-red-600
                  text-white
                "
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="
            fixed
            inset-0
            bg-black/50
            flex
            items-center
            justify-center
            z-50
            p-4
          "
        >
          <div
            className="
    bg-white
    rounded-[32px]
    w-full
    max-w-2xl
    p-8
    shadow-2xl
    border
    border-slate-100

    max-h-[90vh]
    overflow-y-auto

    custom-scrollbar
  "
          >
            <div
              className="
    flex
    justify-between
    items-center

    pb-4
    mb-6

    border-b
    border-slate-100
  "
            >
              <div>
                <h2 className="text-3xl font-bold text-slate-800">{editingMenu ? "Edit Menu" : "Tambah Menu"}</h2>

                <p className="text-slate-500 mt-1">Lengkapi informasi menu kantin</p>
              </div>
              <button onClick={resetForm}>
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nama Menu"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="
  w-full
  px-4
  py-3
  bg-white
  border
  border-slate-200
  rounded-2xl

  focus:outline-none
  focus:ring-4
  focus:ring-orange-100
  focus:border-orange-400

  transition-all
"
                required
              />

              <select
                value={form.categoryId}
                onChange={(e) => {
                  console.log("CATEGORY SELECTED:", e.target.value);
                  setForm({
                    ...form,
                    categoryId: e.target.value,
                  });
                }}
                className="
    w-full
    px-4
    py-4

    bg-white

    border
    border-slate-200

    rounded-2xl

    text-slate-700

    focus:outline-none
    focus:ring-4
    focus:ring-orange-100
    focus:border-orange-400

    transition-all
  "
              >
                <option value="">Pilih Kategori</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <div className="relative">
                <span
                  className="
      absolute
      left-4
      top-1/2
      -translate-y-1/2
      text-slate-400
      font-medium
    "
                >
                  Rp
                </span>

                <input
                  type="number"
                  placeholder="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value,
                    })
                  }
                  className="
      w-full
      pl-12
      pr-4
      py-4

      border
      border-slate-200

      rounded-2xl

      focus:outline-none
      focus:ring-4
      focus:ring-orange-100
      focus:border-orange-400

      transition-all
    "
                />
              </div>

              <textarea
                rows={5}
                placeholder="Contoh: Nasi goreng spesial dengan telur dan ayam"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                className="
    w-full

    px-4
    py-4

    border
    border-slate-200

    rounded-2xl

    resize-none

    focus:outline-none
    focus:ring-4
    focus:ring-orange-100
    focus:border-orange-400

    transition-all
  "
              />

              <label
                className="
    flex
    flex-col
    items-center
    justify-center

    border-2
    border-dashed
    border-orange-200

    rounded-2xl

    py-8

    cursor-pointer

    hover:bg-orange-50
    hover:border-orange-400

    transition
  "
              >
                <ImageIcon size={40} className="text-orange-500 mb-3" />

                <p className="font-medium text-slate-700">{uploading ? "Mengupload..." : "Klik untuk upload foto"}</p>

                <p className="text-sm text-slate-400">JPG, PNG, WEBP</p>

                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              {uploading && (
                <div className="flex items-center gap-2 text-orange-500 text-sm">
                  <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  Sedang mengupload gambar...
                </div>
              )}

              {form.imageUrl && !uploading && <div className="flex items-center gap-2 text-green-600 text-sm">✓ Gambar berhasil diupload</div>}
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="
    w-full
    h-44
    object-cover
    rounded-2xl
    border
    border-slate-200
  "
                />
              )}

              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="
  px-6
  py-3

  rounded-2xl

  bg-orange-500
  hover:bg-orange-600

  text-white
  font-medium

  shadow-lg
  shadow-orange-200

  transition

  disabled:opacity-50
"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="
    px-5
    py-3
    bg-orange-500
    hover:bg-orange-600
    text-white
    rounded-xl
    disabled:opacity-50
    disabled:cursor-not-allowed
    disabled:hover:bg-orange-500
  "
                >
                  {uploading ? "Mengupload Gambar..." : submitting ? "Menyimpan..." : editingMenu ? "Update Menu" : "Tambah Menu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuPage;
