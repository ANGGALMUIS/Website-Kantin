import { useCart } from "../../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import { createOrder } from "../../api/orderApi";
import toast from "react-hot-toast";
import { useState } from "react";

import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";

function CartPage() {
  const { cart, increaseQty, decreaseQty, removeFromCart, clearCart } = useCart();

  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  const total = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const handleCheckout = async () => {
    if (checkingOut) return;

    try {
      setCheckingOut(true);

      if (cart.length === 0) {
        toast.error("Keranjang kosong");
        return;
      }

      const payload = {
        canteenId: cart[0].canteenId,

        items: cart.map((item) => ({
          menuId: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await createOrder(payload);

      toast.success(`Nomor Antrian: ${response.data.data.queueNumber}`);

      clearCart();

      navigate("/buyer/orders");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Checkout gagal");
    } finally {
      setCheckingOut(false);
    }
  };

  // ==========================
  // EMPTY CART
  // ==========================
  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800">Keranjang Belanja</h1>

          <p className="text-slate-500 mt-2">Periksa pesanan sebelum checkout</p>
        </div>

        {/* Empty State */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-12 shadow-md text-center">
            <ShoppingCart size={80} className="mx-auto text-slate-300" />

            <h2 className="text-2xl font-bold mt-5 text-slate-700">Keranjang Kosong</h2>

            <p className="text-slate-500 mt-2">Belum ada menu yang kamu pilih</p>

            <Link
              to="/buyer"
              className="
                inline-flex
                items-center
                gap-2
                mt-6
                bg-orange-500
                hover:bg-orange-600
                text-white
                px-6
                py-3
                rounded-xl
                transition-all
              "
            >
              Jelajahi Kantin
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================
  // CART HAS ITEMS
  // ==========================
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Keranjang Belanja</h1>

        <p className="text-slate-500 mt-2">Periksa pesanan sebelum checkout</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Item */}
        <div className="lg:col-span-2 space-y-5">
          {cart.map((item) => (
            <div
              key={item.id}
              className="
                bg-white
                rounded-3xl
                shadow-md
                p-5
                flex
                flex-col
                md:flex-row
                gap-5
              "
            >
              {/* Image */}
              <div className="w-full md:w-40 h-40 flex-shrink-0">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="
                      w-full
                      h-full
                      object-cover
                      rounded-2xl
                    "
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 rounded-2xl flex items-center justify-center">Tidak Ada Gambar</div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800">{item.name}</h3>

                <p className="text-slate-500 mt-1">Rp {Number(item.price).toLocaleString("id-ID")}</p>

                <div className="flex items-center gap-3 mt-5">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-slate-100
                      hover:bg-slate-200
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Minus size={16} />
                  </button>

                  <span className="font-bold text-lg min-w-[30px] text-center">{item.quantity}</span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-orange-100
                      text-orange-600
                      hover:bg-orange-200
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="flex justify-between items-center mt-5">
                  <span className="font-bold text-lg">Rp {(Number(item.price) * item.quantity).toLocaleString("id-ID")}</span>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="
                      flex
                      items-center
                      gap-2
                      text-red-500
                      hover:text-red-600
                    "
                  >
                    <Trash2 size={18} />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-3xl shadow-md p-6 sticky top-6">
            <h3 className="text-xl font-bold mb-5">Ringkasan Pesanan</h3>

            <div className="flex justify-between mb-3">
              <span className="text-slate-500">Total Item</span>
              <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>

            <div className="flex justify-between mb-5">
              <span className="text-slate-500">Subtotal</span>
              <span>Rp {total.toLocaleString("id-ID")}</span>
            </div>

            <hr />

            <div className="flex justify-between mt-5 mb-6">
              <span className="font-semibold">Total</span>

              <span className="font-bold text-xl text-orange-600">Rp {total.toLocaleString("id-ID")}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="
    w-full
    bg-orange-500
    hover:bg-orange-600
    text-white
    py-3
    rounded-xl
    font-medium
    transition-all
    disabled:opacity-50
    disabled:cursor-not-allowed
    disabled:hover:bg-orange-500
  "
            >
              {checkingOut ? "Memproses Pesanan..." : "Checkout"}
            </button>

            <button
              onClick={clearCart}
              className="
                w-full
                mt-3
                bg-red-50
                text-red-600
                py-3
                rounded-xl
                font-medium
              "
            >
              Kosongkan Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
