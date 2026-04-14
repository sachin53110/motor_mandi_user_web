
import { useState, useEffect, useRef } from "react";
import {
  Search, ChevronDown, Star, ArrowRight, ShieldCheck, Truck, Tag,
  MapPin, Phone, Mail, Heart, Menu, X,
  Navigation, Clock, Wrench, Car, Bike, Filter, LocateFixed, ChevronRight
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import LOGO_SRC from "../assets/motorMandiLogo.png";
import HERO_IMAGE from "../assets/backHome.png";
import SearchResultsModal from "../components/SearchResultsModal";
import useNearbyShops from "../hooks/useNearbyShops";
import ApiProvider from "../api/ApiProvider";

// SVG icon imports
import TyreSvg from "../assets/svg/tyre.svg";
import RimSvg from "../assets/svg/rim.svg";
import CarSvg from "../assets/svg/car.svg";
import BikeSvg from "../assets/svg/bike.svg";
import AccessorySvg from "../assets/svg/accessory.svg";

const PAGE_SURFACE = "#f3f6fb";

// ── Data ────────────────────────────────────────────────────────────────────
const categories = [
  {
    icon: "tyres",
    label: "Tyres",
    sub: "New & Used",
    count: "2,400+",
    color: "from-slate-900/38 via-slate-900/10 to-slate-950/50",
    image: TyreSvg,
    photo: "https://images.unsplash.com/photo-1527266258038-6ae3e089a609?auto=format&fit=crop&w=900&q=80",
    key: "tyres"
  },
  {
    icon: "wheels",
    label: "Wheels & Rims",
    sub: "Alloy, Steel",
    count: "1,800+",
    color: "from-slate-900/38 via-indigo-900/12 to-slate-950/50",
    image: RimSvg,
    photo: "https://images.unsplash.com/photo-1542377281-73d08e3a10aa?auto=format&fit=crop&w=900&q=80",
    key: "rims"
  },
  {
    icon: "car",
    label: "Cars",
    sub: "All Brands",
    count: "950+",
    color: "from-slate-900/38 via-cyan-900/12 to-slate-950/50",
    image: CarSvg,
    photo: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=900&q=80",
    key: "cars"
  },
  {
    icon: "bike",
    label: "Bikes",
    sub: "Street, Sport",
    count: "640+",
    color: "from-slate-900/38 via-amber-900/12 to-slate-950/50",
    image: BikeSvg,
    photo: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80",
    key: "bikes"
  },
  {
    icon: "accessories",
    label: "Accessories",
    sub: "Parts & More",
    count: "3,100+",
    color: "from-slate-900/38 via-sky-900/12 to-slate-950/50",
    image: AccessorySvg,
    photo: "https://images.unsplash.com/photo-1498887960847-2a5e46312788?auto=format&fit=crop&w=900&q=80",
    key: "accessories"
  },
];

const testimonials = [
  { name: "Rahul Sharma", role: "Car Enthusiast", rating: 5, text: "Found exactly the BBS rims I was hunting for months. Smooth transaction, seller was super professional.", avatar: "RS" },
  { name: "Priya Nair",   role: "Bike Rider",     rating: 5, text: "Sold my old Michelin tyres within 2 days. The platform is incredibly well-designed and easy to use.",     avatar: "PN" },
  { name: "Arjun Singh",  role: "Fleet Manager",  rating: 4, text: "Bulk tyre purchases at the best rates. The brand filter and condition toggle saved me so much time.",     avatar: "AS" },
];

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Category", href: "#categories" },
  { label: "Shops", to: "/shops" },
  { label: "Contact", href: "#footer" },
];

// ── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedStat({ value, label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const target = parseInt(value.replace(/[^0-9]/g, ""));
        const duration = 1500;
        const step = Math.ceil(target / (duration / 16));
        let current = 0;
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          setCount(current);
          if (current >= target) clearInterval(timer);
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);
  const suffix = value.replace(/[0-9,]/g, "");
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-black text-emerald-700 font-mono">{count.toLocaleString()}{suffix}</div>
      <div className="text-emerald-900/60 text-sm mt-1 tracking-widest uppercase">{label}</div>
    </div>
  );
}

// ── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-lg shadow-lg shadow-slate-200/60" : "bg-white/30 backdrop-blur-sm"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img src={LOGO_SRC} alt="MotorMandi Logo" className="h-11 w-auto object-contain" />
            <span className="text-xl font-black text-slate-900" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
              MOTOR<span className="text-sky-600">MANDI</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              link.to ? (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`text-sm font-semibold tracking-wide transition-colors ${link.label === "Home" ? "text-slate-900" : "text-slate-600 hover:text-slate-900"}`}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-semibold tracking-wide text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {link.label}
                </a>
              )
            ))}
          </div>
          <button className="md:hidden text-slate-900" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 pb-4">
            {navLinks.map(link => (
              link.to ? (
                <Link
                  key={link.label}
                  to={link.to}
                  className="block px-4 py-3 text-sm text-slate-700 hover:text-slate-900 font-semibold"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="block px-4 py-3 text-sm text-slate-700 hover:text-slate-900 font-semibold"
                >
                  {link.label}
                </a>
              )
            ))}
            <div className="px-4 pt-3 flex gap-3">
              <button className="flex-1 text-sm text-slate-700 border border-slate-300 py-2 rounded-lg">Sign In</button>
              <button className="flex-1 bg-sky-600 text-white text-sm font-bold py-2 rounded-lg">Post Ad FREE</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const filters = ["All", "Tyres", "Rims", "Cars", "Bikes", "Accessories"];

  const handleSearchClick = () => {
    setSearchModalOpen(true);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <section className="relative overflow-hidden px-4 pt-24 pb-20" style={{ backgroundColor: PAGE_SURFACE }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 0%, rgba(3, 105, 161, 0.12), transparent 32%), radial-gradient(circle at 85% 0%, rgba(14, 165, 233, 0.12), transparent 24%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/70 shadow-2xl">
          <img
            src={HERO_IMAGE}
            alt="MotorMandi Hero"
            className="h-[300px] w-full object-cover object-center sm:h-[390px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-900/35 to-transparent" />

          <div className="absolute left-5 top-6 z-10 max-w-2xl sm:left-10 sm:top-10">
            <p className="inline-flex items-center rounded-full border border-white/20 bg-slate-900/45 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-100 backdrop-blur-sm">
              India's #1 Auto Marketplace
            </p>
            <h1 className="mt-4 text-4xl font-black leading-tight text-slate-50 drop-shadow-[0_6px_14px_rgba(2,6,23,0.75)] sm:text-6xl" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.03em" }}>
              OLD & NEW TYRES,
              <br />
              WHEELS & MORE
            </h1>
            <p className="mt-3 max-w-xl text-sm text-slate-100 drop-shadow-[0_3px_10px_rgba(2,6,23,0.65)] sm:text-base">
              The smartest way to trade automotive parts, vehicles & accessories. 8,000+ verified listings. Real prices. Zero middlemen.
            </p>
          </div>
        </div>

        <div className="relative z-20 -mt-10 mx-auto max-w-5xl rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-xl sm:-mt-12 sm:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-black text-slate-900" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.03em" }}>
              Find The Right Product
            </h2>
            <p className="text-sm font-medium text-slate-500">Fast search. Verified listings. Better deals.</p>
          </div>

          <div className="mb-4 flex gap-2 flex-wrap">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  activeFilter === f
                    ? "bg-sky-600 border-sky-600 text-white"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="flex-1 flex items-center gap-3 rounded-full px-4 py-3 border border-slate-300 bg-white">
              <Search size={18} className="text-sky-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                placeholder="Search tyres, rims, cars, bikes..."
                className="bg-transparent text-slate-900 placeholder-slate-400 text-sm w-full outline-none"
              />
            </div>
            <button
              onClick={handleSearchClick}
              className="inline-flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 py-3 transition-all hover:scale-105 active:scale-95"
              aria-label="Search"
            >
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs sm:text-sm text-slate-600">
            <Link to="/cars" className="font-semibold hover:text-slate-900">Browse Cars</Link>
            <span className="h-4 w-px bg-slate-300" />
            <Link to="/bikes" className="font-semibold hover:text-slate-900">Browse Bikes</Link>
            <span className="h-4 w-px bg-slate-300" />
            <Link to="/accessories" className="font-semibold hover:text-slate-900">Browse Accessories</Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[["8,000+", "Active Listings"], ["12K+", "Happy Buyers"], ["99%", "Verified Sellers"], ["24/7", "Support"]].map(([n, l]) => (
            <div key={l} className="rounded-2xl border border-white/70 bg-white/80 backdrop-blur-sm p-4 text-center">
              <span className="text-sky-700 font-black text-lg">{n}</span>
              <p className="text-slate-500 text-xs mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>

      <SearchResultsModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        initialQuery={searchQuery}
      />
    </section>
  );
}

// ── Categories (opens listings modals from category cards) ───────────────────
function Categories({ onTyresClick, onWheelsClick, onCarsClick, onBikesClick, onAccessoriesClick }) {
  return (
    <section id="categories" className="px-4 py-16" style={{ backgroundColor: PAGE_SURFACE }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-sky-700 text-xs font-bold tracking-widest uppercase mb-2">Browse By Category</p>
            <h2 className="text-4xl font-black text-slate-900" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>WHAT ARE YOU LOOKING FOR?</h2>
          </div>
          <a href="#" className="hidden sm:flex items-center gap-2 text-sky-700 text-sm font-bold hover:text-sky-600 transition-colors">All Categories <ArrowRight size={18} /></a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => {
            const showLiveBadge = cat.key === "tyres" || cat.key === "cars" || cat.key === "bikes" || cat.key === "accessories";

            return (
              <div
                key={cat.label}
                onClick={() => {
                  if (cat.key === "tyres") onTyresClick();
                  if (cat.key === "rims")  onWheelsClick();
                  if (cat.key === "cars")  onCarsClick();
                  if (cat.key === "bikes") onBikesClick();
                  if (cat.key === "accessories") onAccessoriesClick();
                }}
                className={`group relative h-48 overflow-hidden rounded-[1.35rem] border border-white/70 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-300/40 ${["tyres", "rims", "cars", "bikes", "accessories"].includes(cat.key) ? "cursor-pointer ring-0 hover:ring-2 hover:ring-sky-300/80" : "cursor-default"}`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <img
                  src={cat.photo}
                  alt={`${cat.label} background`}
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color}`} />

                <div className="relative z-10 flex h-full items-end p-4">
                  <div className="rounded-xl border border-white/30 bg-slate-900/22 p-3 backdrop-blur-[1px]">
                    <div className="text-slate-50 font-black text-lg leading-tight" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>{cat.label}</div>
                    <div className="text-slate-200/85 text-xs mt-0.5">{cat.sub}</div>
                    <div className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                      <span className="text-sky-700 font-bold">{cat.count}</span>
                      <span>listings</span>
                      <ArrowRight size={11} className="text-sky-700" />
                    </div>
                  </div>
                </div>

                {/* "Live" badge for selected category listings */}
                {showLiveBadge && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-sky-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    LIVE
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Hint text under categories */}
        <p className="text-center text-slate-500 text-xs mt-4 font-medium">
          Click a category to view live listings
        </p>
      </div>
    </section>
  );
}

// ── Listing Card ─────────────────────────────────────────────────────────────
function ListingCard({ item }) {
  const [liked, setLiked] = useState(false);
  const [imgError, setImgError] = useState(false);

  const getItemIcon = (type) => {
    const iconMap = {
      "Tyre": TyreSvg,
      "Rim": RimSvg,
      "Car": CarSvg,
      "Bike": BikeSvg,
      "Accessories": AccessorySvg,
    };
    const svgPath = iconMap[type] || AccessorySvg;
    return <img src={svgPath} alt={type} className="w-20 h-20 object-contain opacity-70" />;
  };

  return (
    <div className="group relative overflow-hidden rounded-[1.45rem] border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl hover:shadow-slate-300/45">
      <div className="relative h-48 overflow-hidden bg-slate-100">
        {item.imageUrl && !imgError ? (
          <img 
            src={item.imageUrl} 
            alt={item.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-100 to-white">
            {getItemIcon(item.type)}
          </div>
        )}
        {item.imageUrl && !imgError && <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-950/15 to-transparent" />}
        {item.badge && <span className={`absolute top-3 left-3 ${item.badgeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm`}>{item.badge}</span>}
        <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${item.condition === "New" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-amber-100 text-amber-700 border border-amber-200"}`}>{item.condition}</span>
        <button onClick={() => setLiked(!liked)} className="absolute bottom-3 right-3 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center transition-colors hover:bg-red-50 shadow-sm">
          <Heart size={14} fill={liked ? "#ef4444" : "none"} stroke={liked ? "#ef4444" : "#64748b"} />
        </button>
      </div>
      <div className="p-4">
        <div className="text-[10px] text-sky-700 font-bold uppercase tracking-wider mb-1">{item.type} · {item.brand}</div>
        <h3 className="text-slate-900 font-bold text-base leading-snug mb-2 group-hover:text-sky-700 transition-colors">{item.name}</h3>
        <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-3"><MapPin size={12} />{item.location}</div>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-slate-900 font-black text-xl">{item.price}</span>
            {item.oldPrice && <span className="text-slate-400 text-xs line-through ml-2">{item.oldPrice}</span>}
          </div>
          <button className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700 transition-colors hover:bg-sky-100">
            View <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Featured Listings ─────────────────────────────────────────────────────────
function FeaturedListings({ onViewMore }) {
  const [activeTab, setActiveTab] = useState("All");
  const [apiData, setApiData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tabs = ["All", "Tyres", "Rims", "Cars", "Bikes", "Accessories"];

  // Fetch data from all APIs on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch data from all 5 APIs (limit to 6 items each)
        const [tyresRes, wheelsRes, carsRes, bikesRes, accessoriesRes] = await Promise.all([
          ApiProvider.tyres.getList({ limit: 6, page: 1 }),
          ApiProvider.wheels.getList({ limit: 6, page: 1 }),
          ApiProvider.cars.getList({ limit: 6, page: 1 }),
          ApiProvider.bikes.getList({ limit: 6, page: 1 }),
          ApiProvider.accessories.getList({ limit: 6, page: 1 }),
        ]);

        // Transform API responses to listing format
        const transformedData = {
          tyres: (tyresRes.data || []).map(item => ({
            id: item.id,
            type: "Tyre",
            name: item.title || item.name || "Tyre",
            condition: item.condition || "New",
            price: `₹${(item.price || 0).toLocaleString()}`,
            oldPrice: item.oldPrice ? `₹${item.oldPrice.toLocaleString()}` : null,
            brand: item.brand || "Unknown",
            location: item.location || "Unknown",
            badge: item.isHot ? "Hot Deal" : item.isFeatured ? "Featured" : null,
            badgeColor: item.isHot ? "bg-emerald-600" : "bg-green-600",
            imageUrl: item.medias?.[0]?.media || null
          })),
          wheels: (wheelsRes.data || []).map(item => ({
            id: item.id,
            type: "Rim",
            name: item.title || item.name || "Wheel",
            condition: item.condition || "New",
            price: `₹${(item.price || 0).toLocaleString()}`,
            oldPrice: item.oldPrice ? `₹${item.oldPrice.toLocaleString()}` : null,
            brand: item.brand || "Unknown",
            location: item.location || "Unknown",
            badge: item.isHot ? "Hot Deal" : item.isFeatured ? "Featured" : null,
            badgeColor: item.isHot ? "bg-emerald-600" : "bg-green-600",
            imageUrl: item.medias?.[0]?.media || null
          })),
          cars: (carsRes.data || []).map(item => ({
            id: item.id,
            type: "Car",
            name: item.title || item.name || "Car",
            condition: item.condition || "Used",
            price: `₹${(item.price || 0).toLocaleString()}`,
            oldPrice: item.oldPrice ? `₹${item.oldPrice.toLocaleString()}` : null,
            brand: item.brand || "Unknown",
            location: item.location || "Unknown",
            badge: item.isFeatured ? "Featured" : null,
            badgeColor: "bg-teal-600",
            imageUrl: item.medias?.[0]?.media || null
          })),
          bikes: (bikesRes.data || []).map(item => ({
            id: item.id,
            type: "Bike",
            name: item.title || item.name || "Bike",
            condition: item.condition || "Used",
            price: `₹${(item.price || 0).toLocaleString()}`,
            oldPrice: item.oldPrice ? `₹${item.oldPrice.toLocaleString()}` : null,
            brand: item.brand || "Unknown",
            location: item.location || "Unknown",
            badge: item.isHot ? "Hot Deal" : null,
            badgeColor: "bg-emerald-600",
            imageUrl: item.medias?.[0]?.media || null
          })),
          accessories: (accessoriesRes.data || []).map(item => ({
            id: item.id,
            type: "Accessories",
            name: item.title || item.name || "Accessory",
            condition: item.condition || "New",
            price: `₹${(item.price || 0).toLocaleString()}`,
            oldPrice: item.oldPrice ? `₹${item.oldPrice.toLocaleString()}` : null,
            brand: item.brand || "Unknown",
            location: item.location || "Unknown",
            badge: item.isTopRated ? "Top Rated" : null,
            badgeColor: "bg-green-700",
            imageUrl: item.medias?.[0]?.media || null
          }))
        };

        setApiData(transformedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching listings:", err);
        setError(err.message || "Failed to load listings");
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Get filtered data based on active tab
  const getFilteredData = () => {
    const allData = [
      ...(apiData.tyres || []),
      ...(apiData.wheels || []),
      ...(apiData.cars || []),
      ...(apiData.bikes || []),
      ...(apiData.accessories || [])
    ];

    if (activeTab === "All") return allData.slice(0, 6);
    if (activeTab === "Tyres") return (apiData.tyres || []).slice(0, 6);
    if (activeTab === "Rims") return (apiData.wheels || []).slice(0, 6);
    if (activeTab === "Cars") return (apiData.cars || []).slice(0, 6);
    if (activeTab === "Bikes") return (apiData.bikes || []).slice(0, 6);
    if (activeTab === "Accessories") return (apiData.accessories || []).slice(0, 6);
    return [];
  };

  const filteredData = getFilteredData();

  const handleViewMore = () => {
    const categoryMap = {
      "All": null,
      "Tyres": "tyres",
      "Rims": "wheels",
      "Cars": "cars",
      "Bikes": "bikes",
      "Accessories": "accessories"
    };
    onViewMore(categoryMap[activeTab]);
  };

  return (
    <section className="py-20 px-4" style={{ backgroundColor: PAGE_SURFACE }}>
      <div className="max-w-7xl mx-auto rounded-[2rem] border border-white/80 bg-gradient-to-b from-white via-white to-sky-50/40 p-6 shadow-xl shadow-slate-200/50 sm:p-8">
        <div className="mb-10">
          <p className="text-sky-700 text-xs font-bold tracking-widest uppercase mb-2">Hot Right Now</p>
          <h2 className="text-4xl font-black text-slate-900 mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>FEATURED LISTINGS</h2>
          <div className="flex gap-2 flex-wrap">
            {tabs.map(t => (
              <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${activeTab === t ? "bg-sky-600 border-sky-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}>{t}</button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-10 h-10 border-3 border-slate-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-slate-600 font-medium">Loading featured listings...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Listings Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredData.length > 0 ? (
                filteredData.map(item => <ListingCard key={item.id} item={item} />)
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-500 font-medium">No listings available for this category</p>
                </div>
              )}
            </div>
            <div className="text-center mt-10">
              <button onClick={handleViewMore} className="border border-sky-300 hover:bg-sky-50 text-sky-700 font-bold px-8 py-3 rounded-xl transition-all hover:scale-105 inline-flex items-center gap-2">View All Listings <ArrowRight size={18} /></button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// ── NEAREST SHOPS ─────────────────────────────────────────────────────────────
function NearestShops({ onOpenNearbyShops }) {
  const { shops, loading, error, userLocation, locationEnabled, requestLocationPermission, fetchShops } = useNearbyShops();
  const [activeType, setActiveType] = useState("All");
  const [selectedShop, setSelectedShop] = useState(null);
  const [showMap, setShowMap] = useState(true);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const initializedRef = useRef(false);

  // Request location permission and fetch shops ONCE on component mount
  useEffect(() => {
    if (initializedRef.current) return; // Prevent re-running
    initializedRef.current = true;

    const initializeShops = async () => {
      await requestLocationPermission();
      // Fetch shops after requesting location permission
      fetchShops({ page: 1, limit: 20 });
    };
    initializeShops();
  }, []); // Empty dependency array - runs only once

  // Auto-set first shop when shops load
  useEffect(() => {
    if (shops.length > 0 && !selectedShop) {
      setSelectedShop(shops[0]);
    }
  }, [shops, selectedShop]);

  const types = ["All"];
  const shopTypes = new Set(shops.map(s => s.name));
  
  const filtered = activeType === "All" 
    ? shops 
    : shops.filter(s => {
        // Filter by distance or other properties if needed
        return true;
      });

  const handleLocate = async () => {
    try {
      const location = await getUserLocation();
      await fetchAndDisplay(location);
    } catch (err) {
      console.error("Failed to get location:", err);
    }
  };

  useEffect(() => {
    if (!showMap || !mapRef.current) return;
    if (mapInstanceRef.current) return;

    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
    }

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = () => {
      const L = window.L;
      const center = userLocation 
        ? [userLocation.lat, userLocation.lng]
        : [28.6480, 77.2350];
      const map = L.map(mapRef.current, { zoomControl: false }).setView(center, 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap contributors" }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      mapInstanceRef.current = map;
      updateMarkers();
    };
    document.body.appendChild(script);

    return () => {
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
    };
  }, [showMap, userLocation]);

  const updateMarkers = () => {
    const L = window.L;
    if (!L || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add user location marker
    if (userLocation) {
      const userIcon = L.divIcon({
        className: "",
        html: `<div style="background:#3b82f6;color:white;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);font-size:16px">📍</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map)
        .bindPopup(`<div style="font-family:sans-serif;text-align:center"><strong style="color:#3b82f6;font-size:14px">Your Location</strong></div>`);
    }

    // Add shop markers
    shops.forEach(shop => {
      const shopIcon = L.divIcon({
        className: "",
        html: `<div style="background:#059669;color:white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);width:40px;height:40px;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);font-size:18px"><span style="transform:rotate(45deg)">🏪</span></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      });
      const marker = L.marker([shop.lat, shop.lng], { icon: shopIcon }).addTo(map)
        .bindPopup(`<div style="font-family:sans-serif;min-width:200px"><strong style="color:#065f46;font-size:14px">${shop.name}</strong><br/><span style="color:#6b7280;font-size:12px">${shop.email || 'Shop'}</span><br/><div style="margin-top:6px;display:flex;align-items:center;gap:4px"><span style="color:#f59e0b">★</span><span style="font-size:12px;font-weight:bold">${shop.rating?.toFixed(1) || 'N/A'}</span></div><div style="margin-top:4px;font-size:12px;color:#374151">📍 ${shop.address || shop.phone}</div><div style="margin-top:4px;font-size:12px;color:${shop.shopStatus === 'open' ? '#059669' : '#ef4444'};font-weight:bold">${shop.shopStatus === 'open' ? '✓ Open' : '✗ Closed'}</div><div style="margin-top:6px;font-size:11px;font-weight:bold;color:#059669">📏 ${(shop.distance / 1000).toFixed(1)} km away</div></div>`);
      marker.on("click", () => setSelectedShop(shop));
      markersRef.current.push(marker);
    });
  };

  // Update markers when shops or filters change
  useEffect(() => { 
    if (mapInstanceRef.current && window.L) updateMarkers(); 
  }, [filtered, shops, userLocation]);

  // Fly to selected shop
  useEffect(() => { 
    if (mapInstanceRef.current && selectedShop) 
      mapInstanceRef.current.flyTo([selectedShop.lat, selectedShop.lng], 15, { duration: 0.8 }); 
  }, [selectedShop]);

  const typeIcon = (type) => {
    if (type.includes("Bike")) return <Bike size={14} />;
    if (type.includes("Tyre")) return <span className="text-xs">🛞</span>;
    return <Car size={14} />;
  };

  const isLocating = loading && !shops.length;

  return (
    <section className="py-16 px-4 relative z-0" id="shops" style={{ backgroundColor: PAGE_SURFACE }}>
      <div className="max-w-7xl mx-auto rounded-[2rem] border border-white/80 bg-white/75 p-5 shadow-xl shadow-slate-200/50 backdrop-blur-sm sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-sky-700 text-xs font-bold tracking-widest uppercase mb-2">Find Nearby</p>
            <h2 className="text-4xl font-black text-slate-900" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>NEAREST REPAIR SHOPS</h2>
            <p className="text-slate-500 text-sm mt-2">
              {shops.length > 0 
                ? `${shops.length} shops near you` 
                : 'Locate trusted car & bike workshops near you on the map'}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={handleLocate} disabled={loading}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${shops.length > 0 ? "bg-sky-100 text-sky-700 border border-sky-200" : "bg-sky-600 hover:bg-sky-500 text-white hover:scale-105"}`}>
              {loading ? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Locating...</span></>) :
               shops.length > 0 ? (<><LocateFixed size={16} /><span>Location Found</span></>) :
               (<><Navigation size={16} /><span>Use My Location</span></>)}
            </button>
            <button onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all">
              <MapPin size={16} />{showMap ? "List View" : "Map View"}
            </button>
            <button onClick={onOpenNearbyShops}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-sky-600 hover:bg-sky-500 text-white hover:scale-105 transition-all">
              <Navigation size={16} />Nearby Shops
            </button>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {types.map(t => (
            <button key={t} onClick={() => setActiveType(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${activeType === t ? "bg-sky-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-2">
            <div className="text-red-600 text-sm"><strong>Error:</strong> {error}</div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-3 max-h-[560px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#d1fae5 transparent" }}>
            {isLocating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <span className="w-8 h-8 border-3 border-slate-200 border-t-sky-600 rounded-full animate-spin mb-3"></span>
                <p className="text-sky-700 font-medium text-sm">Fetching nearby shops...</p>
              </div>
            ) : filtered.length > 0 ? (
              filtered.map(shop => (
                <div key={shop.id} onClick={() => setSelectedShop(shop)}
                  className={`group relative cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${selectedShop?.id === shop.id ? "border-sky-400 bg-sky-50 shadow-lg shadow-sky-100" : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md hover:shadow-slate-100"}`}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                        {shop.imageUrl ? (
                          <img
                            src={shop.imageUrl}
                            alt={shop.shopName || shop.name || "Shop"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sky-700 text-base">🏪</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-slate-900 font-black text-sm truncate">{shop.name}</h3>
                        <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                          <span className="text-sky-700 text-sm font-bold">🏪</span>
                          <span className="truncate">{shop.shopName || 'Shop'}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${shop.shopStatus === 'open' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                      {shop.shopStatus === 'open' ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= Math.floor(shop.rating || 0) ? "#f59e0b" : "none"} stroke="#f59e0b" />)}
                    <span className="text-slate-700 font-bold text-xs ml-1">{shop.rating?.toFixed(1) || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1"><MapPin size={11} />{(shop.distance / 1000).toFixed(1)} km</span>
                    <span className="flex items-center gap-1"><Phone size={11} />{shop.phone}</span>
                  </div>
                  {shop.address && (
                    <div className="text-xs text-slate-500 mb-2 truncate">
                      📍 {shop.address}
                    </div>
                  )}
                  <div className={`absolute right-4 bottom-4 transition-all ${selectedShop?.id === shop.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                    <ChevronRight size={16} className="text-sky-600" />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MapPin size={40} className="text-sky-300 mb-3" />
                <p className="text-sky-700 font-medium text-sm">No shops found</p>
                <p className="text-slate-500 text-xs mt-1">Click "Use My Location" to find nearby shops</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-lg z-0" style={{ height: "380px", isolation: "isolate" }}>
              {showMap ? (
                <>
                  <div ref={mapRef} style={{ width: "100%", height: "100%", position: "relative", zIndex: 0, isolation: "isolate" }} />
                  <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-md border border-slate-200">
                    <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold">
                      <span className="text-blue-500 text-sm">📍</span>
                      <span>{shops.length > 0 ? `${shops.length} Shops Near You` : 'MotorMandi Shops'}</span>
                    </div>
                  </div>
                  <div className="absolute bottom-10 left-3 z-20 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-slate-200 space-y-1">
                    <div className="flex items-center gap-2 text-slate-700 text-xs font-medium">
                      <span className="text-blue-500 text-sm">📍</span>
                      <span>Your Location</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700 text-xs font-medium">
                      <span className="text-sky-600 text-sm">🏪</span>
                      <span>Shops</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                  <div className="text-center"><MapPin size={40} className="text-sky-300 mx-auto mb-3" /><p className="text-sky-700 font-bold text-sm">Switch to Map View</p></div>
                </div>
              )}
            </div>

            {selectedShop && (
              <div className="bg-slate-900 rounded-2xl p-5 text-white border border-slate-700/40">
                {selectedShop.imageUrl && (
                  <div className="mb-4 rounded-xl overflow-hidden border border-slate-700/60">
                    <img
                      src={selectedShop.imageUrl}
                      alt={selectedShop.shopName || selectedShop.name || "Shop"}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-black text-lg" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>{selectedShop.name}</h3>
                    <div className="flex items-center gap-2 text-sky-300 text-xs mt-0.5">
                      <span className="text-sky-400 text-sm">🏪</span>
                      <span>{selectedShop.status}</span><span>·</span>
                      <span className={selectedShop.shopStatus === 'open' ? "text-emerald-400" : "text-red-400"}>
                        {selectedShop.shopStatus === 'open' ? '✓ Open Now' : '✗ Closed'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <Star size={14} fill="#f59e0b" stroke="#f59e0b" />
                      <span className="font-black text-amber-400">{selectedShop.rating?.toFixed(1) || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
                  {selectedShop.address && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin size={14} className="text-sky-400 shrink-0" />
                      <span className="text-xs">{selectedShop.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone size={14} className="text-sky-400 shrink-0" />
                    <span className="text-xs">{selectedShop.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Navigation size={14} className="text-sky-400 shrink-0" />
                    <span className="text-xs">{(selectedShop.distance / 1000).toFixed(1)} km away</span>
                  </div>
                  {selectedShop.email && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail size={14} className="text-sky-400 shrink-0" />
                      <span className="text-xs">{selectedShop.email}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <a href={`tel:${selectedShop.phone}`} className="flex-1 bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105">
                    <Phone size={16} /> Call Now
                  </a>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedShop.lat},${selectedShop.lng}`} target="_blank" rel="noreferrer"
                    className="flex-1 bg-white/10 hover:bg-white/20 border border-slate-500/50 text-slate-200 text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all">
                    <Navigation size={16} /> Get Directions
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm mb-3">Are you a workshop owner?</p>
          <button className="inline-flex items-center gap-2 border border-sky-300 hover:bg-sky-50 text-sky-700 font-bold px-6 py-2.5 rounded-xl transition-all hover:scale-105 text-sm">
            <Wrench size={16} /> List Your Shop for FREE
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Why Choose Us ─────────────────────────────────────────────────────────────
function WhyChooseUs() {
  const features = [
    { LucideIcon: ShieldCheck, title: "Trusted Sellers",  desc: "Every seller is ID-verified and rated by our community. Zero scams, zero stress.",            color: "text-sky-400" },
    { LucideIcon: Tag,         title: "Best Prices",      desc: "Compare 8,000+ listings across India. Our price alert tells you when deals drop.",            color: "text-cyan-400"   },
    { LucideIcon: Truck,       title: "Fast Delivery",    desc: "Pan-India shipping on tyres and accessories. Track your order in real time.",                  color: "text-blue-400"    },
  ];
  return (
    <section className="bg-slate-950 py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg, #0ea5e9 0, #0ea5e9 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }} />
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <p className="text-sky-400 text-xs font-bold tracking-widest uppercase mb-2">Why MotorMandi</p>
          <h2 className="text-4xl font-black text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>THE SMARTER WAY TO BUY & SELL</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(({ LucideIcon, title, desc, color }) => (
            <div key={title} className="bg-white/5 border border-slate-800/60 rounded-2xl p-8 hover:border-sky-500/40 transition-all group">
              <div className={`${color} mb-5 group-hover:scale-110 transition-transform duration-300`}><LucideIcon size={32} /></div>
              <h3 className="text-white font-black text-xl mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  return (
    <section className="py-24 px-4" style={{ background: "linear-gradient(180deg, #f3f6fb 0%, #ecf5ff 100%)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sky-700 text-xs font-bold tracking-widest uppercase mb-2">Community Reviews</p>
          <h2 className="text-4xl font-black text-slate-900" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>WHAT OUR USERS SAY</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white border border-slate-200 rounded-2xl p-7 hover:border-sky-300 transition-all shadow-sm hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-1">
              <div className="flex mb-4 gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={16} fill={s <= t.rating ? "#F59E0B" : "none"} stroke="#F59E0B" />)}</div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-100 border border-sky-200 rounded-full flex items-center justify-center text-sky-700 font-black text-sm">{t.avatar}</div>
                <div>
                  <div className="text-slate-900 font-bold text-sm">{t.name}</div>
                  <div className="text-slate-500 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA Banner ───────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <section className="py-20 px-4" style={{ backgroundColor: PAGE_SURFACE }}>
      <div className="max-w-7xl mx-auto relative overflow-hidden rounded-[2rem] border border-white/70 shadow-2xl">
        <img src={HERO_IMAGE} alt="CTA" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-700/90 via-sky-700/80 to-slate-900/80" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="max-w-4xl mx-auto text-center relative px-6 py-16 sm:py-20">
          <h2 className="text-5xl font-black text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>READY TO SELL YOUR PARTS?</h2>
          <p className="text-sky-100 text-lg mb-8">Post your listing for FREE. Reach 12,000+ active buyers across India in minutes.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-sky-700 font-black px-8 py-4 rounded-xl text-lg hover:bg-sky-50 transition-all hover:scale-105 active:scale-95">POST FREE AD NOW</button>
            <button className="border-2 border-white text-white font-black px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-all">Browse Listings</button>
          </div>
        </div>
      </div>
    </section>
  );
}
const socialIcons = [
  // Instagram
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>,
  // Twitter / X
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  // Facebook
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
];
// ── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer id="footer" className="bg-gradient-to-b from-slate-900 to-slate-950 border-t border-sky-900/40 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-sky-500 rounded-lg flex items-center justify-center text-xl font-black text-slate-950">M</div>
              <span className="text-xl font-black text-slate-100" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>MOTOR<span className="text-sky-300">MANDI</span></span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-5">India's fastest growing marketplace for automotive parts, tyres, rims, cars & bikes.</p>
          <div className="flex gap-3">
  {socialIcons.map((icon, i) => (
    <a key={i} href="#" className="w-9 h-9 bg-slate-800/80 hover:bg-sky-500 rounded-lg flex items-center justify-center text-slate-200 hover:text-slate-950 transition-all">
      {icon}
    </a>
  ))}
</div>
          </div>
          <div>
            <h4 className="text-slate-100 font-black text-sm tracking-widest uppercase mb-4">Categories</h4>
            {["Tyres","Wheels & Rims","Cars","Bikes","Accessories","Spare Parts"].map(item => (
              <a key={item} href="#" className="block text-slate-300 hover:text-sky-300 text-sm mb-2 transition-colors">{item}</a>
            ))}
          </div>
          <div>
            <h4 className="text-slate-100 font-black text-sm tracking-widest uppercase mb-4">Company</h4>
            {["About Us","Blog","Careers","Press Kit","Privacy Policy","Terms of Use"].map(item => (
              <a key={item} href="#" className="block text-slate-300 hover:text-sky-300 text-sm mb-2 transition-colors">{item}</a>
            ))}
          </div>
          <div>
            <h4 className="text-slate-100 font-black text-sm tracking-widest uppercase mb-4">Contact</h4>
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-2 text-slate-300 hover:text-sky-300 text-sm transition-colors"><Phone size={14} /> +91 8708045979</a>
              <a href="#" className="flex items-center gap-2 text-slate-300 hover:text-sky-300 text-sm transition-colors"><Mail size={14} /> hello@motormandi.in</a>
              <a href="#" className="flex items-center gap-2 text-slate-300 hover:text-sky-300 text-sm transition-colors"><MapPin size={14} /> Haryan, India</a>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-400 text-xs">© 2024 MotorMandi. All rights reserved.</p>
          <p className="text-slate-400 text-xs">Built with ❤️ for auto enthusiasts across India</p>
        </div>
      </div>
    </footer>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAGE_SURFACE }}>
      <Navbar />
      <Hero />
      {/* Pass the opener down to Categories */}
      <Categories
        onTyresClick={() => navigate('/tyres')}
        onWheelsClick={() => navigate('/wheels')}
        onCarsClick={() => navigate('/cars')}
        onBikesClick={() => navigate('/bikes')}
        onAccessoriesClick={() => navigate('/accessories')}
      />
      <FeaturedListings 
        onViewMore={(category) => {
          if (category === "tyres") navigate('/tyres');
          else if (category === "wheels") navigate('/wheels');
          else if (category === "cars") navigate('/cars');
          else if (category === "bikes") navigate('/bikes');
          else if (category === "accessories") navigate('/accessories');
          else window.scrollTo(0, 0);
        }}
      />
      <NearestShops onOpenNearbyShops={() => navigate('/shops')} />
      <Testimonials />
      <CTABanner />
      <Footer />
    </div>
  );
}