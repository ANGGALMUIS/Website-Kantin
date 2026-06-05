import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { registerApi } from "../../api/authApi";

function RegisterPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Konfirmasi password tidak sama");
      return;
    }

    try {
      setLoading(true);

      await registerApi({
        name: form.name,
        email: form.email.toLowerCase(),
        password: form.password,
      });

      toast.success("Registrasi berhasil");

      navigate("/login");
    } catch (error) {
      const response = error.response?.data;

      if (response?.errors?.length > 0) {
        toast.error(response.errors[0].message);
      } else {
        toast.error(response?.message || "Registrasi gagal");
      }

      console.log(response);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div
        className="
    w-full
    max-w-md
    bg-white
    rounded-[32px]
    border
    border-slate-100
    shadow-sm
    p-10
  "
      >
        <div className="flex justify-center mb-6">
          <div
            className="
      w-16
      h-16
      rounded-2xl
      bg-orange-500
      flex
      items-center
      justify-center
      text-white
      text-2xl
    "
          >
            🍽️
          </div>
        </div>
        <h1 className="text-4xl font-bold text-slate-900 text-center">Register</h1>

        <p className="text-center text-slate-500 mt-2 mb-8">Buat akun baru</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Nama Lengkap" value={form.name} onChange={handleChange} className={inputStyle} />

          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className={inputStyle} />

          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className={inputStyle} />

          <input type="password" name="confirmPassword" placeholder="Konfirmasi Password" value={form.confirmPassword} onChange={handleChange} className={inputStyle} />

          <button
            type="submit"
            disabled={loading}
            className="
w-full
bg-orange-500
hover:bg-orange-600
text-white
font-semibold
py-4
rounded-2xl
transition-all
duration-200
hover:shadow-md
disabled:bg-slate-300
disabled:cursor-not-allowed
"
          >
            {loading ? "Loading..." : "Daftar"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8">
          Sudah punya akun?
          <Link
            to="/login"
            className="
    text-orange-500
    font-medium
    ml-2
    hover:text-orange-600
  "
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
