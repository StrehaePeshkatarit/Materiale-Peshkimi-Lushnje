export default function FishingStore() {
  const products = [
    {
      id: 1,
      name: "Set Spinning Siweda 2.7m",
      description: "Kallam 10-30g + makinetë 3000 + fije",
      price: 5000,
      category: "Sete",
    },
    {
      id: 2,
      name: "Kallam Bolognese 5m",
      description: "Ideal për peshkim të lehtë dhe praktik",
      price: 6500,
      category: "Kallama",
    },
    {
      id: 3,
      name: "Makinetë 4000 Spinning",
      description: "E fortë, e përshtatshme për përdorim në det",
      price: 3500,
      category: "Makineta",
    },
    {
      id: 4,
      name: "Set Surf 4.2m",
      description: "Kallam + makinetë 8000 + fije e bobinuar",
      price: 8500,
      category: "Surf",
    },
  ];

  const { useMemo, useState } = React;
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Të gjitha");
  const [showCheckout, setShowCheckout] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    address: "",
    note: "",
  });

  const categories = ["Të gjitha", ...new Set(products.map((p) => p.category))];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = category === "Të gjitha" || p.category === category;
      const q = search.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const submitOrder = () => {
    if (!form.fullName || !form.phone || !form.city || !form.address || cart.length === 0) {
      alert("Plotëso të dhënat dhe shto të paktën një produkt.");
      return;
    }
    setSubmitted(true);
    setShowCheckout(false);
    setCart([]);
    setForm({ fullName: "", phone: "", city: "", address: "", note: "" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-300">Streha e Peshkatarit</p>
              <h1 className="mt-2 text-4xl font-bold">Porosit direkt nga Streha e Peshkatarit</h1>
              <p className="mt-3 max-w-2xl text-slate-300">
                Zgjidh produktet, plotëso adresën dhe bëj porosinë. Pagesa bëhet vetëm cash në dorëzim. Dyqani ndodhet në Lushnje dhe porositë merren direkt nga faqja.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 px-5 py-4 shadow-lg backdrop-blur">
              <p className="text-sm text-slate-300">Shporta</p>
              <p className="text-3xl font-bold">{cart.reduce((a, b) => a + b.quantity, 0)}</p>
              <p className="mt-1 text-sm text-slate-300">Totali: {total.toLocaleString("sq-AL")} lekë</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        {submitted && (
          <div className="mb-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800 shadow-sm">
            Porosia u dërgua me sukses. Klienti paguan cash në dorëzim.
          </div>
        )}

        <section className="grid gap-4 rounded-3xl bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_220px] md:p-5">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kërko produktin..."
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-0 transition focus:border-slate-400"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowCheckout(true)}
            className="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            Përfundo porosinë
          </button>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <div key={product.id} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {product.category}
                  </span>
                  <span className="text-lg font-bold">{product.price.toLocaleString("sq-AL")} lekë</span>
                </div>
                <h3 className="text-xl font-bold">{product.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-5 w-full rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:opacity-90"
                >
                  Shto në shportë
                </button>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Shporta</h2>
              <span className="text-sm text-slate-500">{cart.length} produkte</span>
            </div>

            <div className="mt-5 space-y-4">
              {cart.length === 0 ? (
                <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                  Nuk ke shtuar ende asnjë produkt.
                </p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="mt-1 text-sm text-slate-500">{item.price.toLocaleString("sq-AL")} lekë / copë</p>
                      </div>
                      <p className="font-bold">{(item.quantity * item.price).toLocaleString("sq-AL")} lekë</p>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="h-9 w-9 rounded-xl border border-slate-200 text-lg"
                      >
                        -
                      </button>
                      <div className="min-w-10 text-center font-semibold">{item.quantity}</div>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="h-9 w-9 rounded-xl border border-slate-200 text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Totali</span>
                <span>{total.toLocaleString("sq-AL")} lekë</span>
              </div>
              <p className="mt-2 text-sm text-slate-500">Pagesa: cash në dorëzim</p>
              <p className="mt-2 text-sm text-slate-500">Telefon: +355 69 460 6944</p>
              <p className="mt-1 text-sm text-slate-500">Adresa: Lushnje</p>
              <button
                onClick={() => setShowCheckout(true)}
                className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:opacity-90"
              >
                Vazhdo te checkout
              </button>
            </div>
          </aside>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-600 md:px-6">
          <p className="text-lg font-bold text-slate-900">Streha e Peshkatarit</p>
          <p className="mt-2">Telefon: +355 69 460 6944</p>
          <p className="mt-1">Adresa: Lushnje</p>
          <p className="mt-3">Porositë bëhen direkt nga faqja dhe pagesa kryhet cash në dorëzim.</p>
        </div>
      </footer>

      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Checkout</p>
                <h2 className="mt-1 text-3xl font-bold">Përfundo porosinë</h2>
              </div>
              <button
                onClick={() => setShowCheckout(false)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                Mbyll
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                placeholder="Emri dhe mbiemri"
                className="rounded-2xl border border-slate-200 px-4 py-3"
              />
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Numri i telefonit"
                className="rounded-2xl border border-slate-200 px-4 py-3"
              />
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Qyteti"
                className="rounded-2xl border border-slate-200 px-4 py-3"
              />
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Adresa e saktë"
                className="rounded-2xl border border-slate-200 px-4 py-3"
              />
            </div>

            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Shënim shtesë për porosinë"
              className="mt-4 min-h-[110px] w-full rounded-2xl border border-slate-200 px-4 py-3"
            />

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold">Metoda e pagesës</h3>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                  Cash në dorëzim
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600">
                Klienti paguan në momentin që merr porosinë. Nuk ka pagesë online.
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-100 p-4">
              <h3 className="font-bold">Përmbledhja e porosisë</h3>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>{(item.price * item.quantity).toLocaleString("sq-AL")} lekë</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-lg font-bold">
                <span>Totali</span>
                <span>{total.toLocaleString("sq-AL")} lekë</span>
              </div>
            </div>

            <button
              onClick={submitOrder}
              className="mt-6 w-full rounded-2xl bg-emerald-600 px-4 py-4 text-lg font-bold text-white transition hover:opacity-90"
            >
              Porosit tani
            </button>

            <p className="mt-4 text-center text-sm text-slate-500">
              Streha e Peshkatarit • +355 69 460 6944 • Lushnje
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
