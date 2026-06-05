import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { loginApi } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";
import { googleLoginApi } from "../../api/authApi";
import { useGoogleLogin } from "@react-oauth/google";

function LoginPage() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await loginApi({
        email: form.email.toLowerCase(),
        password: form.password,
      });

      login(response.data);
      toast.success("Login berhasil");
      const role = response.data.user.role;

      if (role === "SUPER_ADMIN") {
        navigate("/admin");
      }

      if (role === "CANTEEN_ADMIN") {
        navigate("/canteen");
      }

      if (role === "BUYER") {
        navigate("/buyer");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    flow: "implicit",

    onSuccess: async (tokenResponse) => {
      try {
        const response = await googleLoginApi(tokenResponse.access_token);

        login(response.data);

        toast.success("Login Google berhasil");

        const role = response.data.user.role;

        if (role === "SUPER_ADMIN") {
          navigate("/admin");
        } else if (role === "CANTEEN_ADMIN") {
          navigate("/canteen");
        } else {
          navigate("/buyer");
        }
      } catch (error) {
        toast.error("Login Google gagal");
      }
    },
  });

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
        <h1 className="text-4xl font-bold text-slate-900 text-center">Login</h1>

        <p className="text-center text-slate-500 mt-2 mb-8">Masuk ke Kantin Polines</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" name="email" placeholder="Email" onChange={handleChange} className={inputStyle} />

          <input type="password" name="password" placeholder="Password" onChange={handleChange} className={inputStyle} />

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
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        <div className="flex items-center my-8">
          <div className="flex-1 h-px bg-slate-200"></div>

          <span className="px-4 text-sm text-slate-400">atau</span>

          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        <div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => googleLogin()}
              className="
    w-full
    h-14
    flex
    items-center
    justify-center
    gap-3
    rounded-2xl
    border
    border-slate-200
    bg-white
    hover:bg-orange-50
    hover:border-orange-300
    transition-all
    duration-200
  "
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6">
                <path
                  fill="#FFC107"
                  d="M43.611 20.083H42V20H24v8h11.303C33.655 32.657 29.233 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4c-7.682 0-14.347 4.337-17.694 10.691z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.168 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.141 35.091 26.715 36 24 36c-5.212 0-9.624-3.329-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
                />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.793 2.312-2.302 4.283-4.084 5.57l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>

              <span className="font-medium text-slate-700">Masuk dengan Google</span>
            </button>
          </div>
        </div>
        <p className="text-center text-sm text-slate-500 mt-8">
          Belum punya akun?
          <Link
            to="/register"
            className="
    text-orange-500
    font-medium
    ml-2
    hover:text-orange-600
  "
          >
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
