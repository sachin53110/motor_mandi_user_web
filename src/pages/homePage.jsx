
import { useState, useEffect, useRef } from "react";
import {
  Search, ChevronDown, Star, ArrowRight, ShieldCheck, Truck, Tag,
  MapPin, Phone, Mail, Instagram, Twitter, Facebook, Heart, Menu, X,
  Navigation, Clock, Wrench, Car, Bike, Filter, LocateFixed, ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import LOGO_SRC from "../assets/motorMandiLogo.png";
import TyreListingsModal from "../components/TyreListingsModal";   // ← NEW
import WheelListingsModal from "../components/WheelListingsModal";

// ── Data ────────────────────────────────────────────────────────────────────
const categories = [
  { icon: "🛞", label: "Tyres",        sub: "New & Used",    count: "2,400+", color: "from-emerald-500/20 to-emerald-600/5",  key: "tyres"       },
  { icon: "⚙️", label: "Wheels & Rims", sub: "Alloy, Steel",  count: "1,800+", color: "from-green-500/20 to-green-600/5",     key: "rims"        },
  { icon: "🚗", label: "Cars",          sub: "All Brands",    count: "950+",   color: "from-teal-500/20 to-teal-600/5",       key: "cars"        },
  { icon: "🏍️", label: "Bikes",         sub: "Street, Sport", count: "640+",   color: "from-lime-500/20 to-lime-600/5",       key: "bikes"       },
  { icon: "🔧", label: "Accessories",   sub: "Parts & More",  count: "3,100+", color: "from-emerald-400/20 to-emerald-500/5", key: "accessories" },
];

const listings = [
  { id: 1, type: "Tyre",        name: "Michelin Pilot Sport 5",       condition: "New",  price: "₹8,400",     oldPrice: "₹10,200", image: "🛞",  brand: "Michelin",      location: "Delhi",     badge: "Hot Deal",  badgeColor: "bg-emerald-600" },
  { id: 2, type: "Rim",         name: "BBS CH-R Alloy Wheels",         condition: "Used", price: "₹32,000",    oldPrice: null,      image: "⚙️",  brand: "BBS",           location: "Mumbai",    badge: "Verified",  badgeColor: "bg-green-600"   },
  { id: 3, type: "Car",         name: "Honda City 2022 ZX",            condition: "Used", price: "₹9,20,000",  oldPrice: null,      image: "🚗",  brand: "Honda",         location: "Pune",      badge: "Featured",  badgeColor: "bg-teal-600"    },
  { id: 4, type: "Bike",        name: "Royal Enfield Meteor 350",      condition: "Used", price: "₹1,48,000",  oldPrice: "₹1,65,000", image: "🏍️", brand: "Royal Enfield", location: "Bangalore", badge: "Hot Deal",  badgeColor: "bg-emerald-600" },
  { id: 5, type: "Tyre",        name: "Apollo Apterra H/T",            condition: "New",  price: "₹5,200",     oldPrice: "₹6,000",  image: "🛞",  brand: "Apollo",        location: "Hyderabad", badge: null,        badgeColor: ""               },
  { id: 6, type: "Accessories", name: "K&N Performance Air Filter",    condition: "New",  price: "₹3,800",     oldPrice: null,      image: "🔧",  brand: "K&N",           location: "Chennai",   badge: "Top Rated", badgeColor: "bg-green-700"   },
];

const testimonials = [
  { name: "Rahul Sharma", role: "Car Enthusiast", rating: 5, text: "Found exactly the BBS rims I was hunting for months. Smooth transaction, seller was super professional.", avatar: "RS" },
  { name: "Priya Nair",   role: "Bike Rider",     rating: 5, text: "Sold my old Michelin tyres within 2 days. The platform is incredibly well-designed and easy to use.",     avatar: "PN" },
  { name: "Arjun Singh",  role: "Fleet Manager",  rating: 4, text: "Bulk tyre purchases at the best rates. The brand filter and condition toggle saved me so much time.",     avatar: "AS" },
];

const navLinks = ["Home", "Listings", "Shops", "Blog", "Contact"];

const allShops = [
  { id: 1, name: "SpeedZone Auto Works", type: "Car Repair",  rating: 4.8, reviews: 312, distance: "0.8 km", address: "Plot 14, Sector 7, Delhi",        phone: "+91 98100 11234", open: true,  hours: "8AM–8PM", tags: ["AC Repair","Engine","Painting"],    lat: 28.6562, lng: 77.2410, color: "#059669" },
  { id: 2, name: "Moto Fix Garage",      type: "Bike Repair", rating: 4.6, reviews: 198, distance: "1.2 km", address: "Shop 3, MG Road, Delhi",          phone: "+91 98200 55678", open: true,  hours: "9AM–7PM", tags: ["Engine","Tyres","Brakes"],          lat: 28.6480, lng: 77.2350, color: "#10b981" },
  { id: 3, name: "AutoCare 360",         type: "Car & Bike",  rating: 4.5, reviews: 540, distance: "1.9 km", address: "23 Ring Road, Delhi",             phone: "+91 91234 77890", open: false, hours: "10AM–6PM",tags: ["Detailing","Denting","Tyres"],      lat: 28.6610, lng: 77.2300, color: "#047857" },
  { id: 4, name: "Wheel Masters",        type: "Tyre & Rim",  rating: 4.9, reviews: 421, distance: "2.3 km", address: "GT Road, Karol Bagh, Delhi",      phone: "+91 99887 11223", open: true,  hours: "8AM–9PM", tags: ["Alloy Wheels","Tyres","Balancing"], lat: 28.6530, lng: 77.2180, color: "#065f46" },
  { id: 5, name: "RoadRunner Motors",    type: "Car Repair",  rating: 4.3, reviews: 156, distance: "3.1 km", address: "Basement, Connaught Pl, Delhi",   phone: "+91 90011 34567", open: true,  hours: "9AM–8PM", tags: ["Transmission","AC","Electrics"],    lat: 28.6330, lng: 77.2180, color: "#059669" },
  { id: 6, name: "Bike Doctor",          type: "Bike Repair", rating: 4.7, reviews: 287, distance: "3.5 km", address: "Near Metro, Lajpat Nagar",        phone: "+91 88001 22334", open: false, hours: "8AM–7PM", tags: ["Servicing","Brakes","Chain"],       lat: 28.5700, lng: 77.2430, color: "#10b981" },
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-xl shadow-emerald-100/60" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img src={LOGO_SRC} alt="MotorMandi Logo" className="h-20 w-auto object-contain drop-shadow-lg" style={{ filter: "drop-shadow(0 0 8px rgba(245,197,24,0.4))" }} />
            <span className="text-xl font-black text-emerald-950" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
              MOTOR<span className="text-emerald-600">MANDI</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map(link => (
              <a key={link} href="#" className={`text-sm font-semibold tracking-wide transition-colors ${link === "Home" ? "text-emerald-600" : "text-emerald-900/60 hover:text-emerald-800"}`}>{link}</a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm text-emerald-800 hover:text-emerald-600 font-semibold transition-colors">Sign In</Link>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all hover:scale-105 active:scale-95">Post Ad FREE</button>
          </div>
          <button className="md:hidden text-emerald-900" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-emerald-100 pb-4">
            {navLinks.map(link => (
              <a key={link} href="#" className="block px-4 py-3 text-sm text-emerald-800 hover:text-emerald-600 font-semibold">{link}</a>
            ))}
            <div className="px-4 pt-3 flex gap-3">
              <button className="flex-1 text-sm text-emerald-800 border border-emerald-200 py-2 rounded-lg">Sign In</button>
              <button className="flex-1 bg-emerald-600 text-white text-sm font-bold py-2 rounded-lg">Post Ad FREE</button>
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
  const filters = ["All", "Tyres", "Rims", "Cars", "Bikes", "Accessories"];
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
      <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(16,185,129,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.06) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="absolute top-0 right-0 w-2/3 h-full" style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(16,185,129,0.10) 0%, transparent 65%)" }} />
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block pointer-events-none select-none">
        <div className="relative w-80 h-80">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20" />
          <div className="absolute inset-6 rounded-full border-2 border-emerald-400/15" />
          <div className="absolute inset-12 rounded-full border-[20px] border-emerald-200/60" style={{ boxShadow: "inset 0 0 40px rgba(0,0,0,0.05)" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <img src={LOGO_SRC} alt="MotorMandi Logo" className="h-30 w-auto object-contain drop-shadow-lg" style={{ filter: "drop-shadow(0 0 8px rgba(245,197,24,0.4))" }} />
          </div>
        </div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-300/50 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-emerald-700 text-sm font-bold tracking-widest uppercase">India's #1 Auto Marketplace</span>
          </div>
          <h1 className="text-6xl sm:text-7xl font-black leading-none mb-6 text-emerald-950" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.02em" }}>
            OLD & NEW<br />
            <span className="text-transparent" style={{ WebkitTextStroke: "2px #059669" }}>TYRES,</span><br />
            <span className="text-emerald-600">WHEELS</span> &<br />MORE
          </h1>
          <p className="text-emerald-800/60 text-lg mb-10 leading-relaxed max-w-lg">The smartest way to trade automotive parts, vehicles & accessories. 8,000+ verified listings. Real prices. Zero middlemen.</p>
          <div className="bg-white border border-emerald-200 rounded-2xl p-4 shadow-xl shadow-emerald-100/60">
            <div className="flex gap-2 flex-wrap mb-4">
              {filters.map(f => (
                <button key={f} onClick={() => setActiveFilter(f)} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${activeFilter === f ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}>{f}</button>
              ))}
            </div>
            <div className="flex gap-3 flex-col sm:flex-row">
              <div className="flex-1 flex items-center gap-3 bg-emerald-50 rounded-xl px-4 py-3">
                <Search size={18} className="text-emerald-500" />
                <input type="text" placeholder="Search tyres, rims, cars, bikes..." className="bg-transparent text-emerald-900 placeholder-emerald-400 text-sm w-full outline-none" />
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 rounded-xl px-4 py-3 sm:w-36 cursor-pointer">
                <span className="text-emerald-600 text-sm">Brand</span>
                <ChevronDown size={16} className="text-emerald-500" />
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 rounded-xl px-4 py-3 sm:w-32 cursor-pointer">
                <span className="text-emerald-600 text-sm">Condition</span>
                <ChevronDown size={16} className="text-emerald-500" />
              </div>
              <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap">
                <Search size={18} />Search
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-6 mt-8">
            {[["8,000+", "Active Listings"], ["12K+", "Happy Buyers"], ["99%", "Verified Sellers"]].map(([n, l]) => (
              <div key={l} className="flex items-center gap-2">
                <span className="text-emerald-600 font-black text-lg">{n}</span>
                <span className="text-emerald-700/50 text-sm">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}

// ── Categories (UPDATED – opens TyreListingsModal on Tyres click) ─────────────
function Categories({ onTyresClick,onWheelsClick }) {
  return (
    <section className="bg-white px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-emerald-600 text-xs font-bold tracking-widest uppercase mb-2">Browse By Category</p>
            <h2 className="text-4xl font-black text-emerald-950" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>WHAT ARE YOU LOOKING FOR?</h2>
          </div>
          <a href="#" className="hidden sm:flex items-center gap-2 text-emerald-600 text-sm font-bold hover:text-emerald-500 transition-colors">All Categories <ArrowRight size={18} /></a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <div
              key={cat.label}
              onClick={() => {
                if (cat.key === "tyres") onTyresClick();
                if (cat.key === "rims")  onWheelsClick();
              }}
              // onClick={() => cat.key === "tyres" && onTyresClick()}
              className={`group relative bg-gradient-to-br ${cat.color} border border-emerald-100 hover:border-emerald-400/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100 ${cat.key === "tyres" ? "cursor-pointer ring-0 hover:ring-2 hover:ring-emerald-400/50" : "cursor-default"}`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">{cat.icon}</div>
              <div className="text-emerald-900 font-black text-lg leading-tight" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>{cat.label}</div>
              <div className="text-emerald-600/60 text-xs mt-1">{cat.sub}</div>
              <div className="mt-3 text-emerald-600 text-xs font-bold">{cat.count} listings</div>

              {/* "Live" badge for Tyres */}
              {cat.key === "tyres" && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  LIVE
                </div>
              )}

              <div className={`absolute bottom-4 right-4 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center transition-opacity ${cat.key === "tyres" ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                <ArrowRight size={12} className="text-emerald-600" />
              </div>
            </div>
          ))}
        </div>

        {/* Hint text under categories */}
        <p className="text-center text-emerald-500/60 text-xs mt-4 font-medium">
          💡 Click on <span className="text-emerald-600 font-bold">Tyres</span> to browse live listings
        </p>
      </div>
    </section>
  );
}

// ── Listing Card ─────────────────────────────────────────────────────────────
function ListingCard({ item }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="group bg-white border border-emerald-100 hover:border-emerald-400/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100">
      <div className="relative bg-emerald-50 h-44 flex items-center justify-center text-8xl">
        {item.image}
        {item.badge && <span className={`absolute top-3 left-3 ${item.badgeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide`}>{item.badge}</span>}
        <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${item.condition === "New" ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-600 border border-amber-200"}`}>{item.condition}</span>
        <button onClick={() => setLiked(!liked)} className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors hover:bg-red-50 shadow-sm">
          <Heart size={14} fill={liked ? "#ef4444" : "none"} stroke={liked ? "#ef4444" : "#9ca3af"} />
        </button>
      </div>
      <div className="p-4">
        <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mb-1">{item.type} · {item.brand}</div>
        <h3 className="text-emerald-950 font-bold text-sm leading-snug mb-2 group-hover:text-emerald-600 transition-colors">{item.name}</h3>
        <div className="flex items-center gap-1.5 text-emerald-600/60 text-xs mb-3"><MapPin size={12} />{item.location}</div>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-emerald-700 font-black text-xl">{item.price}</span>
            {item.oldPrice && <span className="text-emerald-400/60 text-xs line-through ml-2">{item.oldPrice}</span>}
          </div>
          <button className="bg-emerald-50 hover:bg-emerald-600 border border-emerald-200 hover:border-emerald-600 text-emerald-700 hover:text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all">View</button>
        </div>
      </div>
    </div>
  );
}

// ── Featured Listings ─────────────────────────────────────────────────────────
function FeaturedListings() {
  const [activeTab, setActiveTab] = useState("All");
  const tabs = ["All", "Tyres", "Rims", "Cars", "Bikes", "Accessories"];
  const filtered = activeTab === "All" ? listings : listings.filter(l => l.type.toLowerCase().includes(activeTab.toLowerCase().replace("s", "")) || l.type === activeTab);
  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-emerald-600 text-xs font-bold tracking-widest uppercase mb-2">Hot Right Now</p>
          <h2 className="text-4xl font-black text-emerald-950 mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>FEATURED LISTINGS</h2>
          <div className="flex gap-2 flex-wrap">
            {tabs.map(t => (
              <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === t ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}>{t}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(filtered.length ? filtered : listings).map(item => <ListingCard key={item.id} item={item} />)}
        </div>
        <div className="text-center mt-10">
          <button className="border border-emerald-300 hover:bg-emerald-50 text-emerald-700 font-bold px-8 py-3 rounded-xl transition-all hover:scale-105 inline-flex items-center gap-2">View All Listings <ArrowRight size={18} /></button>
        </div>
      </div>
    </section>
  );
}

// ── NEAREST SHOPS ─────────────────────────────────────────────────────────────
function NearestShops() {
  const [activeType, setActiveType] = useState("All");
  const [selectedShop, setSelectedShop] = useState(allShops[0]);
  const [locationGranted, setLocationGranted] = useState(false);
  const [locating, setLocating] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  const types = ["All", "Car Repair", "Bike Repair", "Car & Bike", "Tyre & Rim"];
  const filtered = activeType === "All" ? allShops : allShops.filter(s => s.type === activeType);

  const handleLocate = () => {
    setLocating(true);
    setTimeout(() => { setLocationGranted(true); setLocating(false); }, 1800);
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
      const map = L.map(mapRef.current, { zoomControl: false }).setView([28.6480, 77.2350], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap contributors" }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      mapInstanceRef.current = map;
      updateMarkers();
    };
    document.body.appendChild(script);

    return () => {
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
    };
  }, [showMap]);

  const updateMarkers = () => {
    const L = window.L;
    if (!L || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    allShops.forEach(shop => {
      const icon = L.divIcon({
        className: "",
        html: `<div style="background:${shop.open ? shop.color : "#9ca3af"};color:white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);font-size:16px"><span style="transform:rotate(45deg)">${shop.type.includes("Bike") ? "🏍️" : shop.type.includes("Tyre") ? "🛞" : "🚗"}</span></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });
      const marker = L.marker([shop.lat, shop.lng], { icon }).addTo(map)
        .bindPopup(`<div style="font-family:sans-serif;min-width:180px"><strong style="color:#065f46;font-size:14px">${shop.name}</strong><br/><span style="color:#6b7280;font-size:12px">${shop.type}</span><br/><div style="margin-top:6px;display:flex;align-items:center;gap:4px"><span style="color:#f59e0b">★</span><span style="font-size:12px;font-weight:bold">${shop.rating}</span><span style="color:#9ca3af;font-size:11px">(${shop.reviews} reviews)</span></div><div style="margin-top:4px;font-size:12px;color:#374151">📍 ${shop.address}</div><div style="margin-top:4px;font-size:12px;color:${shop.open ? "#059669" : "#ef4444"};font-weight:bold">${shop.open ? "✓ Open Now" : "✗ Closed"} · ${shop.hours}</div></div>`);
      marker.on("click", () => setSelectedShop(shop));
      markersRef.current.push(marker);
    });
  };

  useEffect(() => { if (mapInstanceRef.current && window.L) updateMarkers(); }, [filtered]);
  useEffect(() => { if (mapInstanceRef.current && selectedShop) mapInstanceRef.current.flyTo([selectedShop.lat, selectedShop.lng], 15, { duration: 0.8 }); }, [selectedShop]);

  const typeIcon = (type) => {
    if (type.includes("Bike")) return <Bike size={14} />;
    if (type.includes("Tyre")) return <span className="text-xs">🛞</span>;
    return <Car size={14} />;
  };

  return (
    <section className="bg-white py-2 px-4" id="shops">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-emerald-600 text-xs font-bold tracking-widest uppercase mb-2">Find Nearby</p>
            <h2 className="text-4xl font-black text-emerald-950" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>NEAREST REPAIR SHOPS</h2>
            <p className="text-emerald-700/50 text-sm mt-2">Locate trusted car & bike workshops near you on the map</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleLocate} disabled={locating || locationGranted}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${locationGranted ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-105"}`}>
              {locating ? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Locating...</span></>) :
               locationGranted ? (<><LocateFixed size={16} /><span>Location Found</span></>) :
               (<><Navigation size={16} /><span>Use My Location</span></>)}
            </button>
            <button onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-all">
              <MapPin size={16} />{showMap ? "List View" : "Map View"}
            </button>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {types.map(t => (
            <button key={t} onClick={() => setActiveType(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${activeType === t ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}>
              {t !== "All" && typeIcon(t)}{t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-2 space-y-3 max-h-[560px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#d1fae5 transparent" }}>
            {filtered.map(shop => (
              <div key={shop.id} onClick={() => setSelectedShop(shop)}
                className={`group relative cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${selectedShop?.id === shop.id ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100" : "border-emerald-100 bg-white hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-50"}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-emerald-950 font-black text-sm">{shop.name}</h3>
                    <div className="flex items-center gap-1 text-emerald-600/70 text-xs mt-0.5">{typeIcon(shop.type)}<span>{shop.type}</span></div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${shop.open ? "bg-emerald-100 text-emerald-700" : "bg-red-50 text-red-500"}`}>{shop.open ? "Open" : "Closed"}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1,2,3,4,5].map(s => <Star key={s} size={11} fill={s <= Math.floor(shop.rating) ? "#f59e0b" : "none"} stroke="#f59e0b" />)}
                  <span className="text-emerald-800 font-bold text-xs ml-1">{shop.rating}</span>
                  <span className="text-emerald-600/50 text-xs">({shop.reviews})</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-emerald-700/60 mb-3">
                  <span className="flex items-center gap-1"><MapPin size={11} />{shop.distance}</span>
                  <span className="flex items-center gap-1"><Clock size={11} />{shop.hours}</span>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {shop.tags.map(tag => <span key={tag} className="bg-emerald-100/70 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">{tag}</span>)}
                </div>
                <div className={`absolute right-4 bottom-4 transition-all ${selectedShop?.id === shop.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                  <ChevronRight size={16} className="text-emerald-500" />
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="relative rounded-2xl overflow-hidden border border-emerald-200 shadow-lg" style={{ height: "380px" }}>
              {showMap ? (
                <>
                  <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
                  <div className="absolute top-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-md border border-emerald-100">
                    <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold"><MapPin size={12} className="text-emerald-600" />MotorMandi Shops Near You</div>
                  </div>
                  <div className="absolute bottom-10 left-3 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-emerald-100 space-y-1">
                    {[["🚗","Car Repair"],["🏍️","Bike Repair"],["🛞","Tyre & Rim"]].map(([icon,label]) => (
                      <div key={label} className="flex items-center gap-2 text-emerald-800 text-xs font-medium"><span>{icon}</span><span>{label}</span></div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                  <div className="text-center"><MapPin size={40} className="text-emerald-300 mx-auto mb-3" /><p className="text-emerald-600 font-bold text-sm">Switch to Map View</p></div>
                </div>
              )}
            </div>

            {selectedShop && (
              <div className="bg-emerald-950 rounded-2xl p-5 text-white border border-emerald-800/40">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-black text-lg" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>{selectedShop.name}</h3>
                    <div className="flex items-center gap-2 text-emerald-400 text-xs mt-0.5">
                      {typeIcon(selectedShop.type)}<span>{selectedShop.type}</span><span>·</span>
                      <span className={selectedShop.open ? "text-emerald-400" : "text-red-400"}>{selectedShop.open ? "✓ Open Now" : "✗ Closed"}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end"><Star size={14} fill="#f59e0b" stroke="#f59e0b" /><span className="font-black text-amber-400">{selectedShop.rating}</span></div>
                    <p className="text-emerald-500 text-xs">{selectedShop.reviews} reviews</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-emerald-300/80"><MapPin size={14} className="text-emerald-500 shrink-0" /><span className="text-xs">{selectedShop.address}</span></div>
                  <div className="flex items-center gap-2 text-emerald-300/80"><Phone size={14} className="text-emerald-500 shrink-0" /><span className="text-xs">{selectedShop.phone}</span></div>
                  <div className="flex items-center gap-2 text-emerald-300/80"><Clock size={14} className="text-emerald-500 shrink-0" /><span className="text-xs">{selectedShop.hours}</span></div>
                  <div className="flex items-center gap-2 text-emerald-300/80"><Navigation size={14} className="text-emerald-500 shrink-0" /><span className="text-xs">{selectedShop.distance} away</span></div>
                </div>
                <div className="flex gap-2 flex-wrap mb-4">
                  {selectedShop.tags.map(tag => <span key={tag} className="bg-emerald-800/50 border border-emerald-700/50 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">{tag}</span>)}
                </div>
                <div className="flex gap-3">
                  <a href={`tel:${selectedShop.phone}`} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105"><Phone size={16} /> Call Now</a>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedShop.lat},${selectedShop.lng}`} target="_blank" rel="noreferrer"
                    className="flex-1 bg-white/10 hover:bg-white/20 border border-emerald-700/50 text-emerald-300 text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all"><Navigation size={16} /> Get Directions</a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-emerald-700/50 text-sm mb-3">Are you a workshop owner?</p>
          <button className="inline-flex items-center gap-2 border border-emerald-300 hover:bg-emerald-50 text-emerald-700 font-bold px-6 py-2.5 rounded-xl transition-all hover:scale-105 text-sm">
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
    { LucideIcon: ShieldCheck, title: "Trusted Sellers",  desc: "Every seller is ID-verified and rated by our community. Zero scams, zero stress.",            color: "text-emerald-600" },
    { LucideIcon: Tag,         title: "Best Prices",      desc: "Compare 8,000+ listings across India. Our price alert tells you when deals drop.",            color: "text-green-600"   },
    { LucideIcon: Truck,       title: "Fast Delivery",    desc: "Pan-India shipping on tyres and accessories. Track your order in real time.",                  color: "text-teal-600"    },
  ];
  return (
    <section className="bg-emerald-950 py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "repeating-linear-gradient(45deg, #10b981 0, #10b981 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }} />
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <p className="text-emerald-400 text-xs font-bold tracking-widest uppercase mb-2">Why MotorMandi</p>
          <h2 className="text-4xl font-black text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>THE SMARTER WAY TO BUY & SELL</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(({ LucideIcon, title, desc, color }) => (
            <div key={title} className="bg-white/5 border border-emerald-800/40 rounded-2xl p-8 hover:border-emerald-500/40 transition-all group">
              <div className={`${color} mb-5 group-hover:scale-110 transition-transform duration-300`}><LucideIcon size={32} /></div>
              <h3 className="text-white font-black text-xl mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>{title}</h3>
              <p className="text-emerald-300/60 text-sm leading-relaxed">{desc}</p>
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
    <section className="bg-white py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-emerald-600 text-xs font-bold tracking-widest uppercase mb-2">Community Reviews</p>
          <h2 className="text-4xl font-black text-emerald-950" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>WHAT OUR USERS SAY</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-emerald-50 border border-emerald-100 rounded-2xl p-7 hover:border-emerald-300 transition-all">
              <div className="flex mb-4 gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={16} fill={s <= t.rating ? "#F59E0B" : "none"} stroke="#F59E0B" />)}</div>
              <p className="text-emerald-800/70 text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600/20 border border-emerald-200 rounded-full flex items-center justify-center text-emerald-700 font-black text-sm">{t.avatar}</div>
                <div>
                  <div className="text-emerald-950 font-bold text-sm">{t.name}</div>
                  <div className="text-emerald-600/60 text-xs">{t.role}</div>
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
    <section className="bg-emerald-600 py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="max-w-4xl mx-auto text-center relative">
        <h2 className="text-5xl font-black text-white mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>READY TO SELL YOUR PARTS?</h2>
        <p className="text-emerald-100 text-lg mb-8">Post your listing for FREE. Reach 12,000+ active buyers across India in minutes.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-emerald-700 font-black px-8 py-4 rounded-xl text-lg hover:bg-emerald-50 transition-all hover:scale-105 active:scale-95">POST FREE AD NOW</button>
          <button className="border-2 border-white text-white font-black px-8 py-4 rounded-xl text-lg hover:bg-white/10 transition-all">Browse Listings</button>
        </div>
      </div>
    </section>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-emerald-950 border-t border-emerald-800/40 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center text-xl font-black text-white">M</div>
              <span className="text-xl font-black text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>MOTOR<span className="text-emerald-400">MANDI</span></span>
            </div>
            <p className="text-emerald-400/60 text-sm leading-relaxed mb-5">India's fastest growing marketplace for automotive parts, tyres, rims, cars & bikes.</p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook].map((SocialIcon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-emerald-800/50 hover:bg-emerald-600 rounded-lg flex items-center justify-center text-emerald-400 hover:text-white transition-all"><SocialIcon size={18} /></a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-black text-sm tracking-widest uppercase mb-4">Categories</h4>
            {["Tyres","Wheels & Rims","Cars","Bikes","Accessories","Spare Parts"].map(item => (
              <a key={item} href="#" className="block text-emerald-400/60 hover:text-emerald-400 text-sm mb-2 transition-colors">{item}</a>
            ))}
          </div>
          <div>
            <h4 className="text-white font-black text-sm tracking-widest uppercase mb-4">Company</h4>
            {["About Us","Blog","Careers","Press Kit","Privacy Policy","Terms of Use"].map(item => (
              <a key={item} href="#" className="block text-emerald-400/60 hover:text-emerald-400 text-sm mb-2 transition-colors">{item}</a>
            ))}
          </div>
          <div>
            <h4 className="text-white font-black text-sm tracking-widest uppercase mb-4">Contact</h4>
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-2 text-emerald-400/60 hover:text-emerald-400 text-sm transition-colors"><Phone size={14} /> +91 98765 43210</a>
              <a href="#" className="flex items-center gap-2 text-emerald-400/60 hover:text-emerald-400 text-sm transition-colors"><Mail size={14} /> hello@motormandi.in</a>
              <a href="#" className="flex items-center gap-2 text-emerald-400/60 hover:text-emerald-400 text-sm transition-colors"><MapPin size={14} /> Mumbai, India</a>
            </div>
          </div>
        </div>
        <div className="border-t border-emerald-800/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-emerald-600/60 text-xs">© 2024 MotorMandi. All rights reserved.</p>
          <p className="text-emerald-600/60 text-xs">Built with ❤️ for auto enthusiasts across India</p>
        </div>
      </div>
    </footer>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [tyreModalOpen, setTyreModalOpen] = useState(false);   // ← NEW
  const [wheelModalOpen, setWheelModalOpen] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      {/* Pass the opener down to Categories */}
      <Categories onTyresClick={() => setTyreModalOpen(true)} onWheelsClick={() => setWheelModalOpen(true)}  />
      <FeaturedListings />
      <NearestShops />
      <WhyChooseUs />
      <Testimonials />
      <CTABanner />
      <Footer />

      {/* Live Tyre Listings Modal */}
      <TyreListingsModal
        isOpen={tyreModalOpen}
        onClose={() => setTyreModalOpen(false)}
      />
      <WheelListingsModal
        isOpen={wheelModalOpen}
        onClose={() => setWheelModalOpen(false)}
      />
    </div>
  );
}