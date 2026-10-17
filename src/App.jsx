
import { useEffect, useMemo, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import {
  ShoppingBag,
  Search,
  Plus,
  Minus,
  X,
  Menu,
  ArrowRight,
  Clock,
  Star,
  Utensils,
  Trash2,
} from "lucide-react";

const foods = [
  {
    id: 1,
    name: "Classic Beef Burger",
    category: "Burgers",
    price: 6500,
    rating: 4.9,
    time: "20 min",
    description: "Juicy beef, fresh lettuce and signature sauce.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&q=85",
  },
  {
    id: 2,
    name: "Margherita Pizza",
    category: "Pizza",
    price: 8500,
    rating: 4.8,
    time: "25 min",
    description: "Mozzarella, fresh basil and tomato sauce.",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=700&q=85",
  },
  {
    id: 3,
    name: "Crispy Chicken",
    category: "Chicken",
    price: 7200,
    rating: 4.9,
    time: "20 min",
    description: "Golden crispy chicken with a tasty coating.",
    image:
      "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=700&q=85",
  },
  {
    id: 4,
    name: "Double Smash Burger",
    category: "Burgers",
    price: 9000,
    rating: 5.0,
    time: "25 min",
    description: "Two beef patties, melted cheese and pickles.",
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=700&q=85",
  },
  {
    id: 5,
    name: "Pepperoni Pizza",
    category: "Pizza",
    price: 10500,
    rating: 4.8,
    time: "30 min",
    description: "Loaded with pepperoni and melted cheese.",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=700&q=85",
  },
  {
    id: 6,
    name: "Chicken Sandwich",
    category: "Chicken",
    price: 5500,
    rating: 4.7,
    time: "15 min",
    description:
      "Crispy chicken, fresh vegetables and creamy sauce.",
    image:
      "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=700&q=85",
  },
];

const categories = ["All", "Burgers", "Pizza", "Chicken"];

const money = (amount) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);

export default function App() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 80,
      easing: "ease-out-cubic",
      mirror: false,
    });

    return () => {
      AOS.refreshHard();
    };
  }, []);

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesCategory =
        category === "All" || food.category === category;

      const matchesSearch = food.name
        .toLowerCase()
        .includes(search.toLowerCase().trim());

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  // Refresh animation positions when menu results change
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      AOS.refresh();
    });

    return () => cancelAnimationFrame(frame);
  }, [filteredFoods]);

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const delivery = subtotal > 0 ? 1500 : 0;
  const total = subtotal + delivery;

  function addToCart(food) {
    setCart((current) => {
      const existing = current.find(
        (item) => item.id === food.id
      );

      if (existing) {
        return current.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { ...food, quantity: 1 }];
    });
  }

  function changeQuantity(id, amount) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id) {
    setCart((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  function checkout() {
    alert(
      "Thanks for trying QuickBite! This is a demo checkout. Connect a backend and payment provider to accept real orders."
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#25221f]">
      {/* NAVIGATION */}
      <header
        data-aos="fade-down"
        className="sticky top-0 z-30 border-b border-orange-100 bg-[#fffaf5]/95 backdrop-blur"
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <a
            href="#home"
            className="flex items-center gap-2"
            aria-label="QuickBite home"
          >
            <span className="rounded-xl bg-orange-500 p-2 text-white">
              <Utensils size={22} />
            </span>

            <span className="text-2xl font-black tracking-tight">
              Quick<span className="text-orange-500">Bite.</span>
            </span>
          </a>

          <div className="hidden items-center gap-8 text-sm font-semibold md:flex">
            <a href="#home" className="hover:text-orange-500">
              Home
            </a>
            <a href="#menu" className="hover:text-orange-500">
              Our Menu
            </a>
            <a href="#about" className="hover:text-orange-500">
              About Us
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 rounded-full bg-[#25221f] px-4 py-3 text-white transition hover:bg-orange-500"
              aria-label={`Open shopping cart, ${cartCount} items`}
            >
              <ShoppingBag size={19} />

              <span className="hidden sm:inline">My Order</span>

              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold">
                {cartCount}
              </span>
            </button>

            <button
              onClick={() => setMobileMenu((open) => !open)}
              className="rounded-lg border border-stone-200 p-2 md:hidden"
              aria-label="Toggle navigation"
              aria-expanded={mobileMenu}
            >
              {mobileMenu ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>
          </div>
        </nav>

        {mobileMenu && (
          <div
            data-aos="fade-down"
            className="flex flex-col gap-4 border-t border-orange-100 px-6 py-4 md:hidden"
          >
            <a
              href="#home"
              onClick={() => setMobileMenu(false)}
            >
              Home
            </a>
            <a
              href="#menu"
              onClick={() => setMobileMenu(false)}
            >
              Our Menu
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenu(false)}
            >
              About Us
            </a>
          </div>
        )}
      </header>

      <main>
        {/* HERO */}
        <section
          id="home"
          className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 md:grid-cols-2 md:py-20 lg:px-8"
        >
          <div data-aos="fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700">
              <span>🔥</span>
              Fresh food, happy mood
            </span>

            <h1 className="mt-6 max-w-xl text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Good food.
              <br />
              <span className="text-orange-500">
                Good mood.
              </span>
              <br />
              Delivered.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-stone-600 sm:text-lg">
              Craving something delicious? Discover your
              favourites, order in a few clicks, and let the
              good food come to you.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#menu"
                className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-4 font-bold text-white transition hover:bg-orange-600"
              >
                Explore Menu
                <ArrowRight size={19} />
              </a>

              <a
                href="#about"
                className="rounded-full border border-stone-300 px-6 py-4 font-bold transition hover:border-orange-500"
              >
                Our Story
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-6 text-sm text-stone-600">
              <span className="flex items-center gap-2">
                <Star
                  size={17}
                  className="fill-orange-400 text-orange-400"
                />
                4.9 customer rating
              </span>

              <span className="flex items-center gap-2">
                <Clock
                  size={17}
                  className="text-orange-500"
                />
                Fast delivery
              </span>
            </div>
          </div>

          <div
            data-aos="fade-left"
            data-aos-delay="150"
            className="relative"
          >
            <div className="absolute -inset-3 rounded-[2rem] bg-orange-200/50 blur-2xl" />

            <img
              src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1100&q=90"
              alt="Delicious freshly prepared burger"
              fetchPriority="high"
              className="relative h-[330px] w-full rounded-[2rem] object-cover shadow-xl sm:h-[450px]"
            />

            <div className="absolute -bottom-5 left-4 rounded-2xl bg-white p-4 shadow-xl sm:left-8">
              <p className="text-sm text-stone-500">
                Customer favourite
              </p>

              <p className="mt-1 font-extrabold">
                Classic Beef Burger 🍔
              </p>

              <p className="mt-1 font-bold text-orange-500">
                {money(6500)}
              </p>
            </div>
          </div>
        </section>

        {/* MENU */}
        <section
          id="menu"
          className="scroll-mt-24 bg-white py-16 sm:py-20"
        >
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div
              data-aos="fade-up"
              className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
            >
              <div>
                <p className="font-bold uppercase tracking-[0.2em] text-orange-500">
                  Made fresh for you
                </p>

                <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                  Explore our menu
                </h2>

                <p className="mt-3 text-stone-500">
                  Find your next favourite meal.
                </p>
              </div>

              <label className="flex items-center gap-3 rounded-full border border-stone-200 px-4 py-3 sm:w-72">
                <Search
                  size={19}
                  className="text-stone-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search meals..."
                  aria-label="Search meals"
                  className="w-full bg-transparent text-sm outline-none"
                />
              </label>
            </div>

            {/* CATEGORY FILTERS */}
            <div
              data-aos="fade-up"
              data-aos-delay="100"
              className="mt-8 flex flex-wrap gap-3"
            >
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  aria-pressed={category === item}
                  className={`rounded-full px-5 py-3 text-sm font-bold transition ${
                    category === item
                      ? "bg-orange-500 text-white"
                      : "bg-orange-50 text-stone-600 hover:bg-orange-100"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* FOOD CARDS */}
            <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFoods.map((food, index) => (
                <article
                  key={food.id}
                  data-aos="fade-up"
                  data-aos-delay={(index % 3) * 100}
                  className="group overflow-hidden rounded-3xl border border-stone-100 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={food.image}
                      alt={food.name}
                      loading="lazy"
                      className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-2 text-xs font-bold shadow">
                      ⭐ {food.rating.toFixed(1)}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-extrabold">
                          {food.name}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-stone-500">
                          {food.description}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-orange-50 px-2 py-1 text-xs font-semibold text-orange-600">
                        {food.time}
                      </span>
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-lg font-black">
                        {money(food.price)}
                      </span>

                      <button
                        onClick={() => addToCart(food)}
                        className="flex items-center gap-2 rounded-full bg-[#25221f] px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-500"
                      >
                        <Plus size={17} />
                        Add
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* EMPTY SEARCH RESULTS */}
            {filteredFoods.length === 0 && (
              <div
                data-aos="fade-up"
                className="py-16 text-center"
              >
                <p className="text-xl font-bold">
                  No meals found.
                </p>

                <p className="mt-2 text-stone-500">
                  Try another search or category.
                </p>

                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                  className="mt-4 font-bold text-orange-500"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ABOUT */}
        <section
          id="about"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-16 lg:px-8"
        >
          <div
            data-aos="zoom-in"
            className="rounded-[2rem] bg-[#25221f] px-6 py-12 text-center text-white sm:px-12 sm:py-16"
          >
            <p className="font-bold uppercase tracking-[0.2em] text-orange-400">
              Why QuickBite?
            </p>

            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-black sm:text-4xl">
              Good meals make everyday moments better.
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-stone-300">
              We bring your cravings and convenience together
              with delicious meals, simple ordering, and a
              smooth experience.
            </p>

            <a
              href="#menu"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-orange-500 px-6 py-4 font-bold transition hover:bg-orange-600"
            >
              Find your meal
              <ArrowRight size={18} />
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer
        data-aos="fade-up"
        className="border-t border-orange-100 bg-white px-5 py-8"
      >
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <a
            href="#home"
            className="text-xl font-black"
          >
            Quick<span className="text-orange-500">Bite.</span>
          </a>

          <p className="text-sm text-stone-500">
            © {new Date().getFullYear()} QuickBite. Built with React.
          </p>

          <a
            href="mailto:hello@example.com"
            className="text-sm font-semibold transition hover:text-orange-500"
          >
            Contact us
          </a>
        </div>
      </footer>

      {/* SHOPPING CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            aria-label="Close cart overlay"
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 bg-black/50"
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Your shopping cart"
            className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-xl font-black">
                  Your order
                </h2>

                <p className="mt-1 text-sm text-stone-500">
                  {cartCount} item(s)
                </p>
              </div>

              <button
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                className="rounded-lg p-2 transition hover:bg-orange-50"
              >
                <X size={23} />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="py-16 text-center">
                  <ShoppingBag
                    className="mx-auto text-orange-400"
                    size={44}
                  />

                  <p className="mt-4 font-bold">
                    Your cart is empty
                  </p>

                  <p className="mt-2 text-sm text-stone-500">
                    Add something delicious from our menu.
                  </p>

                  <button
                    onClick={() => setCartOpen(false)}
                    className="mt-5 rounded-full bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-orange-600"
                  >
                    Browse menu
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm font-semibold text-orange-500">
                        {money(item.price)}
                      </p>

                      <div className="mt-3 flex items-center gap-3">
                        <button
                          onClick={() =>
                            changeQuantity(item.id, -1)
                          }
                          className="rounded-full border p-1 transition hover:border-orange-500"
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          <Minus size={15} />
                        </button>

                        <span className="text-sm font-bold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            changeQuantity(item.id, 1)
                          }
                          className="rounded-full border p-1 transition hover:border-orange-500"
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus size={15} />
                        </button>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto text-stone-400 transition hover:text-red-500"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* ORDER SUMMARY */}
            {cart.length > 0 && (
              <div className="space-y-3 border-t p-5">
                <div className="flex justify-between text-sm text-stone-500">
                  <span>Subtotal</span>
                  <span>{money(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm text-stone-500">
                  <span>Delivery fee</span>
                  <span>{money(delivery)}</span>
                </div>

                <div className="flex justify-between border-t pt-3 text-lg font-black">
                  <span>Total</span>
                  <span>{money(total)}</span>
                </div>

                <button
                  onClick={checkout}
                  className="w-full rounded-full bg-orange-500 py-4 font-bold text-white transition hover:bg-orange-600"
                >
                  Continue to checkout
                </button>

                <p className="text-center text-xs text-stone-400">
                  Demo checkout — no payment will be taken.
                </p>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
