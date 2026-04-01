// // ── model/WheelListingsModal.jsx ──────────────────────────────────────────────
// // Modal that fetches & displays live wheel listings from GET /wheel
// // Matches the MotorMandi emerald design system used in HomePage.jsx
// // ──────────────────────────────────────────────────────────────────────────────

// import { useEffect, useState, useCallback, useRef } from "react";
// import {
//   X, Search, Filter, ChevronDown, MapPin, Phone, Star,
//   RefreshCw, AlertCircle, ShoppingCart, Eye, ZoomIn,
//   Gauge, Layers, Tag, User, Package, Hash, ChevronLeft, ChevronRight,
//   SlidersHorizontal, CheckCircle, XCircle
// } from "lucide-react";

// // ── API base (mirrors ApiProvider.js) ────────────────────────────────────────
// const BASE_URL =
//   import.meta?.env?.VITE_API_BASE_URL ||
//   "https://scaredrealm.com/speedy_fix_node_backend/api/v1";

// async function fetchWheels(params = {}) {
//   const query = new URLSearchParams();
//   Object.entries(params).forEach(([k, v]) => { if (v !== "" && v != null) query.set(k, v); });
//   const qs = query.toString();
//   const res = await fetch(`${BASE_URL}/wheel${qs ? `?${qs}` : ""}`);
//   if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
//   return res.json();
// }

// // ── Skeleton Card ─────────────────────────────────────────────────────────────
// function SkeletonCard() {
//   return (
//     <div className="bg-white border border-emerald-100 rounded-2xl overflow-hidden animate-pulse">
//       <div className="h-48 bg-emerald-50" />
//       <div className="p-4 space-y-3">
//         <div className="h-3 bg-emerald-100 rounded-full w-1/3" />
//         <div className="h-4 bg-emerald-100 rounded-full w-3/4" />
//         <div className="h-3 bg-emerald-100 rounded-full w-1/2" />
//         <div className="flex justify-between items-center pt-1">
//           <div className="h-6 bg-emerald-100 rounded-full w-1/4" />
//           <div className="h-8 bg-emerald-100 rounded-xl w-20" />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Image Gallery (thumbnail strip) ──────────────────────────────────────────
// function ImageGallery({ medias, name }) {
//   const [active, setActive] = useState(0);
//   const [zoomed, setZoomed] = useState(false);

//   if (!medias?.length) {
//     return (
//       <div className="h-48 bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-7xl select-none">
//         ⚙️
//       </div>
//     );
//   }

//   return (
//     <div className="relative group">
//       {/* Main image */}
//       <div
//         className="h-48 bg-emerald-950 overflow-hidden cursor-zoom-in relative"
//         onClick={() => setZoomed(true)}
//       >
//         <img
//           src={medias[active]?.media}
//           alt={name || "Wheel"}
//           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//           onError={(e) => { e.target.src = ""; e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-6xl bg-emerald-50">⚙️</div>'; }}
//         />
//         <div className="absolute inset-0 bg-emerald-950/0 group-hover:bg-emerald-950/20 transition-all flex items-center justify-center">
//           <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
//         </div>
//         {medias.length > 1 && (
//           <div className="absolute bottom-2 right-2 bg-emerald-950/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
//             {active + 1}/{medias.length}
//           </div>
//         )}
//       </div>

//       {/* Thumbnails */}
//       {medias.length > 1 && (
//         <div className="flex gap-1 p-2 bg-emerald-950/5">
//           {medias.map((m, i) => (
//             <button
//               key={m.id}
//               onClick={() => setActive(i)}
//               className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${i === active ? "border-emerald-500 scale-105" : "border-transparent opacity-60 hover:opacity-100"}`}
//             >
//               <img src={m.media} alt="" className="w-full h-full object-cover" />
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Lightbox */}
//       {zoomed && (
//         <div
//           className="fixed inset-0 z-[200] bg-emerald-950/95 backdrop-blur-sm flex items-center justify-center p-4"
//           onClick={() => setZoomed(false)}
//         >
//           <button
//             className="absolute top-4 right-4 w-10 h-10 bg-emerald-800 hover:bg-emerald-700 rounded-full flex items-center justify-center text-white transition-colors"
//             onClick={() => setZoomed(false)}
//           >
//             <X size={20} />
//           </button>
//           <img
//             src={medias[active]?.media}
//             alt={name}
//             className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           />
//           {medias.length > 1 && (
//             <div className="absolute bottom-6 flex gap-2">
//               {medias.map((m, i) => (
//                 <button
//                   key={m.id}
//                   onClick={(e) => { e.stopPropagation(); setActive(i); }}
//                   className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === active ? "border-emerald-400" : "border-emerald-800 opacity-50"}`}
//                 >
//                   <img src={m.media} alt="" className="w-full h-full object-cover" />
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Wheel Card ────────────────────────────────────────────────────────────────
// function WheelCard({ wheel, onDetail }) {
//   const seller = wheel.user;
//   const isActive = wheel.status === "active";

//   return (
//     <div className="group bg-white border border-emerald-100 hover:border-emerald-400/60 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-100/60 flex flex-col">
//       {/* Image */}
//       <div className="relative">
//         <ImageGallery medias={wheel.medias} name={wheel.name || wheel.brandName} />

//         {/* Badges */}
//         <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
//           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm ${wheel.condition === "new" ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"}`}>
//             {wheel.condition}
//           </span>
//           {isActive
//             ? <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />Live</span>
//             : <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">Inactive</span>
//           }
//         </div>
//       </div>

//       {/* Body */}
//       <div className="p-4 flex flex-col flex-1">
//         {/* Brand / Company */}
//         <div className="flex items-center justify-between mb-1">
//           <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
//             ⚙️ {wheel.brandName || "Unknown Brand"} · {wheel.carCompany || "—"}
//           </span>
//           {wheel.stock != null && (
//             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${wheel.stock > 10 ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-orange-50 text-orange-600 border border-orange-200"}`}>
//               {wheel.stock} in stock
//             </span>
//           )}
//         </div>

//         {/* Name */}
//         <h3 className="text-emerald-950 font-black text-sm leading-snug mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2 min-h-[2.5rem]">
//           {wheel.name || `${wheel.brandName} ${wheel.carCompany} – Size ${wheel.size}`}
//         </h3>

//         {/* Specs strip */}
//         <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-3">
//           {wheel.size && (
//             <div className="flex items-center gap-1 text-emerald-700/60 text-xs">
//               <Gauge size={11} className="text-emerald-500" />
//               <span>Size: <span className="font-semibold text-emerald-800">{wheel.size}</span></span>
//             </div>
//           )}
//           {wheel.pcd && (
//             <div className="flex items-center gap-1 text-emerald-700/60 text-xs">
//               <Hash size={11} className="text-emerald-500" />
//               <span>PCD: <span className="font-semibold text-emerald-800">{wheel.pcd}</span></span>
//             </div>
//           )}
//           {wheel.code && (
//             <div className="flex items-center gap-1 text-emerald-700/60 text-xs">
//               <Layers size={11} className="text-emerald-500" />
//               <span>Code: <span className="font-semibold text-emerald-800">{wheel.code}</span></span>
//             </div>
//           )}
//         </div>

//         {/* Seller */}
//         {seller && (
//           <div className="flex items-center gap-2 mb-3 bg-emerald-50 rounded-xl px-3 py-2">
//             <div className="w-7 h-7 bg-emerald-200 rounded-full flex items-center justify-center text-emerald-700 font-black text-xs flex-shrink-0">
//               {(seller.name || "?")[0].toUpperCase()}
//             </div>
//             <div className="min-w-0">
//               <p className="text-emerald-900 font-bold text-xs truncate">{seller.shopName || seller.name}</p>
//               {seller.phone && (
//                 <div className="flex items-center gap-1 text-emerald-600/60 text-[10px]">
//                   <Phone size={9} />{seller.phone}
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Price row */}
//         <div className="flex items-end justify-between mt-auto pt-2 border-t border-emerald-50">
//           <div>
//             <div className="text-[10px] text-emerald-500 font-bold uppercase mb-0.5">Customer Price</div>
//             <span className="text-emerald-700 font-black text-xl">₹{Number(wheel.customerPrice).toLocaleString("en-IN")}</span>
//             {wheel.price && wheel.price !== wheel.customerPrice && (
//               <span className="text-emerald-400/60 text-xs line-through ml-2">₹{Number(wheel.price).toLocaleString("en-IN")}</span>
//             )}
//           </div>
//           <button
//             onClick={() => onDetail(wheel)}
//             className="bg-emerald-50 hover:bg-emerald-600 border border-emerald-200 hover:border-emerald-600 text-emerald-700 hover:text-white text-xs font-bold px-3 py-2 rounded-lg transition-all flex items-center gap-1.5"
//           >
//             <Eye size={13} /> View
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Detail Drawer ─────────────────────────────────────────────────────────────
// function DetailDrawer({ wheel, onClose }) {
//   if (!wheel) return null;
//   const seller = wheel.user;

//   return (
//     <div className="fixed inset-0 z-[150] flex justify-end" onClick={onClose}>
//       <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-sm" />
//       <div
//         className="relative w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl flex flex-col animate-[slideIn_0.3s_ease-out]"
//         onClick={(e) => e.stopPropagation()}
//         style={{ animation: "slideIn 0.3s cubic-bezier(0.16,1,0.3,1)" }}
//       >
//         <style>{`@keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }`}</style>

//         {/* Header */}
//         <div className="sticky top-0 z-10 bg-white border-b border-emerald-100 px-5 py-4 flex items-center justify-between">
//           <div>
//             <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest">Wheel Details</p>
//             <h3 className="text-emerald-950 font-black text-base leading-tight">
//               {wheel.name || `${wheel.brandName} – ${wheel.carCompany}`}
//             </h3>
//           </div>
//           <button
//             onClick={onClose}
//             className="w-9 h-9 bg-emerald-50 hover:bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 transition-colors"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* Gallery */}
//         <div className="flex-shrink-0">
//           <ImageGallery medias={wheel.medias} name={wheel.name} />
//         </div>

//         {/* Content */}
//         <div className="p-5 space-y-5 flex-1">
//           {/* Status badges */}
//           <div className="flex gap-2 flex-wrap">
//             <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${wheel.condition === "new" ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"}`}>
//               {wheel.condition}
//             </span>
//             <span className={`flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${wheel.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
//               {wheel.status === "active" ? <CheckCircle size={12} /> : <XCircle size={12} />}
//               {wheel.status}
//             </span>
//           </div>

//           {/* Price */}
//           <div className="bg-emerald-950 rounded-2xl p-5 text-white">
//             <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Customer Price</p>
//             <p className="text-4xl font-black text-emerald-400" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>
//               ₹{Number(wheel.customerPrice).toLocaleString("en-IN")}
//             </p>
//             {wheel.price && wheel.price !== wheel.customerPrice && (
//               <p className="text-emerald-600 text-sm mt-1">
//                 MRP: <span className="line-through">₹{Number(wheel.price).toLocaleString("en-IN")}</span>
//                 <span className="text-emerald-400 ml-2 font-bold">
//                   {Math.round((1 - wheel.customerPrice / wheel.price) * 100)}% off
//                 </span>
//               </p>
//             )}
//           </div>

//           {/* Specs */}
//           <div>
//             <p className="text-emerald-800 font-black text-sm uppercase tracking-widest mb-3">Specifications</p>
//             <div className="grid grid-cols-2 gap-3">
//               {[
//                 ["Brand", wheel.brandName, "⚙️"],
//                 ["Car Model", wheel.carCompany, "🚗"],
//                 ["Size", wheel.size, "📐"],
//                 ["PCD", wheel.pcd, "#"],
//                 ["Code", wheel.code || "—", "🏷"],
//                 ["Stock", `${wheel.stock} units`, "📦"],
//               ].map(([label, val, icon]) => (
//                 <div key={label} className="bg-emerald-50 rounded-xl p-3">
//                   <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-wide mb-0.5">{icon} {label}</p>
//                   <p className="text-emerald-950 font-black text-sm">{val || "—"}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Seller */}
//           {seller && (
//             <div>
//               <p className="text-emerald-800 font-black text-sm uppercase tracking-widest mb-3">Seller Info</p>
//               <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 space-y-2">
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black text-sm">
//                     {(seller.name || "?")[0].toUpperCase()}
//                   </div>
//                   <div>
//                     <p className="text-emerald-950 font-black text-sm">{seller.shopName || seller.name}</p>
//                     <p className="text-emerald-600/60 text-xs">{seller.email}</p>
//                   </div>
//                 </div>
//                 {seller.phone && (
//                   <a
//                     href={`tel:${seller.phone}`}
//                     className="flex items-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all hover:scale-105 justify-center mt-2"
//                   >
//                     <Phone size={15} /> Call Seller · {seller.phone}
//                   </a>
//                 )}
//                 {[seller.city, seller.state, seller.country].filter(Boolean).length > 0 && (
//                   <p className="flex items-center gap-1 text-emerald-700/60 text-xs">
//                     <MapPin size={12} />
//                     {[seller.city, seller.state, seller.country].filter(Boolean).join(", ")}
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* ID / timestamps */}
//           <div className="text-[10px] text-emerald-400/60 space-y-0.5 border-t border-emerald-50 pt-3">
//             <p>Listing ID: #{wheel.id}</p>
//             <p>Listed: {new Date(wheel.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ── Pagination ────────────────────────────────────────────────────────────────
// function Pagination({ pagination, onPage }) {
//   if (!pagination || pagination.totalPages <= 1) return null;
//   const { currentPage, totalPages, totalRecords } = pagination;

//   return (
//     <div className="flex items-center justify-between pt-4 border-t border-emerald-100">
//       <p className="text-emerald-600/60 text-xs">
//         {totalRecords} listings · Page {currentPage} of {totalPages}
//       </p>
//       <div className="flex gap-2">
//         <button
//           disabled={currentPage <= 1}
//           onClick={() => onPage(currentPage - 1)}
//           className="w-9 h-9 rounded-xl border border-emerald-200 flex items-center justify-center text-emerald-700 hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//         >
//           <ChevronLeft size={16} />
//         </button>
//         {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
//           <button
//             key={p}
//             onClick={() => onPage(p)}
//             className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${p === currentPage ? "bg-emerald-600 text-white" : "border border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`}
//           >
//             {p}
//           </button>
//         ))}
//         <button
//           disabled={currentPage >= totalPages}
//           onClick={() => onPage(currentPage + 1)}
//           className="w-9 h-9 rounded-xl border border-emerald-200 flex items-center justify-center text-emerald-700 hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
//         >
//           <ChevronRight size={16} />
//         </button>
//       </div>
//     </div>
//   );
// }

// // ── Main Modal ────────────────────────────────────────────────────────────────
// export default function WheelListingsModal({ isOpen, onClose }) {
//   const [wheels, setWheels]         = useState([]);
//   const [loading, setLoading]       = useState(false);
//   const [error, setError]           = useState(null);
//   const [pagination, setPagination] = useState(null);
//   const [detailWheel, setDetailWheel] = useState(null);
//   const [showFilters, setShowFilters] = useState(false);

//   // Filters
//   const [search,    setSearch]    = useState("");
//   const [condition, setCondition] = useState("");
//   const [page,      setPage]      = useState(1);

//   const searchRef = useRef(null);

//   const load = useCallback(async (params = {}) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetchWheels({ page: 1, limit: 9, ...params });
//       if (res.status) {
//         setWheels(res.data || []);
//         setPagination(res.pagination || null);
//       } else {
//         throw new Error(res.message || "Failed to load wheels");
//       }
//     } catch (e) {
//       setError(e.message || "Network error");
//       setWheels([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Fetch on open
//   useEffect(() => {
//     if (isOpen) {
//       setSearch(""); setCondition(""); setPage(1);
//       load({ page: 1, limit: 9 });
//       setTimeout(() => searchRef.current?.focus(), 300);
//     }
//   }, [isOpen, load]);

//   // Fetch on filter / page change
//   useEffect(() => {
//     if (!isOpen) return;
//     load({ page, limit: 9, search: search || undefined, condition: condition || undefined });
//   }, [page, condition]); // intentionally not including `search` (submitted on Enter)

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     setPage(1);
//     load({ page: 1, limit: 9, search: search || undefined, condition: condition || undefined });
//   };

//   // Lock body scroll
//   useEffect(() => {
//     document.body.style.overflow = isOpen ? "hidden" : "";
//     return () => { document.body.style.overflow = ""; };
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className="fixed inset-0 z-[100] bg-emerald-950/70 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       {/* Modal panel */}
//       <div
//         className="fixed inset-0 z-[110] flex items-center justify-center p-4"
//         onClick={onClose}
//       >
//         <div
//           className="relative bg-white rounded-3xl shadow-2xl shadow-emerald-950/30 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
//           onClick={(e) => e.stopPropagation()}
//           style={{ animation: "modalIn 0.35s cubic-bezier(0.16,1,0.3,1)" }}
//         >
//           <style>{`
//             @keyframes modalIn {
//               from { opacity: 0; transform: scale(0.94) translateY(20px); }
//               to   { opacity: 1; transform: scale(1) translateY(0); }
//             }
//           `}</style>

//           {/* ── Header ── */}
//           <div className="flex-shrink-0 bg-emerald-950 px-6 py-5">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <div className="flex items-center gap-2 mb-1">
//                   <span className="text-3xl">⚙️</span>
//                   <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
//                     WHEELS & RIMS
//                   </h2>
//                   <span className="flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
//                     <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />LIVE
//                   </span>
//                 </div>
//                 <p className="text-emerald-400/70 text-xs">
//                   {loading ? "Fetching listings…" : `${pagination?.totalRecords ?? wheels.length} wheels & rims available`}
//                 </p>
//               </div>
//               <button
//                 onClick={onClose}
//                 className="w-10 h-10 bg-emerald-800 hover:bg-emerald-700 rounded-full flex items-center justify-center text-white transition-colors"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Search + filter row */}
//             <form onSubmit={handleSearchSubmit} className="flex gap-3 flex-wrap">
//               <div className="flex-1 min-w-[180px] flex items-center gap-3 bg-white/10 border border-emerald-700/40 rounded-xl px-4 py-2.5">
//                 <Search size={16} className="text-emerald-400 flex-shrink-0" />
//                 <input
//                   ref={searchRef}
//                   type="text"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="Search brand, model, size…"
//                   className="bg-transparent text-white placeholder-emerald-500 text-sm w-full outline-none"
//                 />
//                 {search && (
//                   <button type="button" onClick={() => { setSearch(""); setPage(1); load({ page: 1, limit: 9, condition: condition || undefined }); }}>
//                     <X size={14} className="text-emerald-500 hover:text-white transition-colors" />
//                   </button>
//                 )}
//               </div>

//               {/* Condition filter */}
//               <div className="relative">
//                 <select
//                   value={condition}
//                   onChange={(e) => { setCondition(e.target.value); setPage(1); }}
//                   className="appearance-none bg-white/10 border border-emerald-700/40 rounded-xl px-4 py-2.5 text-sm text-white outline-none cursor-pointer pr-8 font-medium"
//                 >
//                   <option value="" className="bg-emerald-950">All Conditions</option>
//                   <option value="new" className="bg-emerald-950">New</option>
//                   <option value="old" className="bg-emerald-950">Used</option>
//                 </select>
//                 <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" />
//               </div>

//               <button
//                 type="submit"
//                 className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
//               >
//                 <Search size={15} /> Search
//               </button>

//               <button
//                 type="button"
//                 onClick={() => load({ page: 1, limit: 9 })}
//                 disabled={loading}
//                 className="w-10 h-10 bg-white/10 border border-emerald-700/40 hover:bg-white/20 rounded-xl flex items-center justify-center text-emerald-400 hover:text-white transition-all disabled:opacity-50"
//               >
//                 <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
//               </button>
//             </form>
//           </div>

//           {/* ── Body ── */}
//           <div className="flex-1 overflow-y-auto p-5 bg-gray-50/50" style={{ scrollbarWidth: "thin", scrollbarColor: "#d1fae5 transparent" }}>

//             {/* Error state */}
//             {error && !loading && (
//               <div className="flex flex-col items-center justify-center py-16 text-center">
//                 <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mb-4">
//                   <AlertCircle size={28} className="text-red-400" />
//                 </div>
//                 <p className="text-emerald-950 font-black text-lg mb-2">Couldn't Load Wheels</p>
//                 <p className="text-emerald-600/50 text-sm mb-5 max-w-xs">{error}</p>
//                 <button
//                   onClick={() => load({ page, limit: 9, search: search || undefined, condition: condition || undefined })}
//                   className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all hover:scale-105"
//                 >
//                   <RefreshCw size={16} /> Try Again
//                 </button>
//               </div>
//             )}

//             {/* Loading skeletons */}
//             {loading && (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
//               </div>
//             )}

//             {/* Empty state */}
//             {!loading && !error && wheels.length === 0 && (
//               <div className="flex flex-col items-center justify-center py-20 text-center">
//                 <div className="text-6xl mb-4">⚙️</div>
//                 <p className="text-emerald-950 font-black text-xl mb-2">No Wheels Found</p>
//                 <p className="text-emerald-600/50 text-sm max-w-xs">Try adjusting your search or filters to find more listings.</p>
//               </div>
//             )}

//             {/* Grid */}
//             {!loading && !error && wheels.length > 0 && (
//               <>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
//                   {wheels.map((w) => (
//                     <WheelCard key={w.id} wheel={w} onDetail={setDetailWheel} />
//                   ))}
//                 </div>
//                 <Pagination pagination={pagination} onPage={setPage} />
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Detail Drawer */}
//       {detailWheel && (
//         <DetailDrawer wheel={detailWheel} onClose={() => setDetailWheel(null)} />
//       )}
//     </>
//   );
// }

// ── model/WheelListingsModal.jsx ──────────────────────────────────────────────
// Full-screen modal showing live wheel listings fetched from GET /wheel.
// Mirrors TyreListingsModal structure & design system exactly.
// ──────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import {
  X, Search, Filter, MapPin, Phone, RefreshCw,
  ChevronLeft, ChevronRight, AlertCircle, Package,
  Star, SlidersHorizontal, CheckCircle, Gauge, Hash, Layers, Heart
} from "lucide-react";
import useWheels from "../hooks/userWheel";
import WheelDetailModal from "./WheelDetailModal";
import LOGO_SRC from "../assets/motorMandiLogo.png";
// ── Helpers ───────────────────────────────────────────────────────────────────
const formatPrice = (price) => {
  const n = parseFloat(price);
  if (isNaN(n)) return "N/A";
  return `₹${n.toLocaleString("en-IN")}`;
};

const conditionColors = {
  new: "bg-emerald-100 text-emerald-700 border-emerald-200",
  old: "bg-amber-50   text-amber-600   border-amber-200",
};

// ── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white border border-emerald-100 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-emerald-50" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-emerald-100 rounded w-1/3" />
        <div className="h-4 bg-emerald-100 rounded w-3/4" />
        <div className="h-3 bg-emerald-100 rounded w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-emerald-100 rounded w-20" />
          <div className="h-8 bg-emerald-100 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

// ── Wheel Card ────────────────────────────────────────────────────────────────
function WheelCard({ wheel, onContact, onItemClick }) {
  const [imgError, setImgError] = useState(false);
  const [liked,    setLiked]    = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const medias = wheel.medias || [];
  const firstImage = medias[activeImg]?.media;
  const conditionKey = wheel.condition?.toLowerCase();
  const conditionClass = conditionColors[conditionKey] || conditionColors.old;

  const savings = wheel.customerPrice && wheel.price
    ? Math.max(0, parseFloat(wheel.customerPrice) - parseFloat(wheel.price))
    : 0;

  const discountPercent = wheel.price && wheel.customerPrice
    ? Math.round(((parseFloat(wheel.customerPrice) - parseFloat(wheel.price)) / parseFloat(wheel.customerPrice)) * 100)
    : 0;

  return (
    <div onClick={() => onItemClick && onItemClick(wheel)} className="group bg-white border border-gray-200 hover:border-emerald-400 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-100/60 flex flex-col cursor-pointer h-full">

      {/* Image Section */}
      <div className="relative bg-gray-100 overflow-hidden flex items-center justify-center aspect-square">
        {firstImage && !imgError ? (
          <img
            src={firstImage}
            alt={wheel.name || wheel.brandName || "Wheel"}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <span className="text-6xl select-none">⚙️</span>
        )}

        {/* Top Left Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discountPercent > 0 && (
            <div className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded">
              {discountPercent}% OFF
            </div>
          )}
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border capitalize bg-white ${conditionClass}`}>
            {wheel.condition || "—"}
          </span>
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110"
        >
          <Heart size={16} fill={liked ? "#ef4444" : "none"} stroke={liked ? "#ef4444" : "#999"} />
        </button>

        {/* Multiple images indicator */}
        {medias.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            +{medias.length - 1}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3.5 flex flex-col flex-1">
        {/* Brand Name */}
        {wheel.brandName && (
          <div className="text-teal-600 text-xs font-bold mb-1 uppercase tracking-wide">
            {wheel.brandName}
          </div>
        )}

        {/* Name */}
        <h3 className="text-gray-800 font-semibold text-sm leading-tight mb-2 line-clamp-2 group-hover:text-emerald-600">
          {wheel.name || wheel.carCompany || "Premium Wheel"}
          {wheel.size && (
            <span className="block text-xs text-gray-500 font-normal mt-0.5">Size: {wheel.size}"</span>
          )}
        </h3>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill="#fbbf24" stroke="#fbbf24" />
            ))}
          </div>
          <span className="text-xs text-gray-500">(220+)</span>
        </div>

        {/* Specifications */}
        <div className="mb-2 pb-2 border-b border-gray-100 text-xs text-gray-600 space-y-0.5">
          {wheel.carCompany && <p>🚗 <span className="font-medium">{wheel.carCompany}</span></p>}
          {wheel.pcd && <p>⚙️ <span className="font-medium">PCD: {wheel.pcd}</span></p>}
        </div>

        {/* Price Section */}
        <div className="mb-2 py-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-gray-900">{formatPrice(wheel.customerPrice)}</span>
            {wheel.price && wheel.price !== wheel.customerPrice && (
              <span className="text-xs text-gray-500 line-through">{formatPrice(wheel.price)}</span>
            )}
          </div>
        </div>

        {/* Savings Badge */}
        {savings > 0 && (
          <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded mb-2">
            ✓ Save {formatPrice(savings)}
          </div>
        )}

        {/* Shop Info */}
        {wheel.user && (
          <div className="text-gray-600 text-xs mb-3 pb-2 border-b border-gray-100">
            <MapPin size={10} className="inline mr-1" />
            <span className="font-medium truncate">{wheel.user.shopName || wheel.user.name}</span>
          </div>
        )}

        {/* Stock Status */}
        {wheel.stock != null && (
          <div className="text-emerald-700 text-xs font-semibold mb-3">
            {wheel.stock > 5 ? "✓ In Stock" : `Only ${wheel.stock} left`}
          </div>
        )}

        {/* Contact Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onContact(wheel); }}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 text-sm"
        >
          <Phone size={14} /> Contact Now
        </button>
      </div>
    </div>
  );
}

// ── Contact Popup ─────────────────────────────────────────────────────────────
function ContactPopup({ wheel, onClose }) {
  if (!wheel) return null;
  const seller = wheel.user;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl p-7 max-w-sm w-full shadow-2xl border border-emerald-100"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideUp .25s cubic-bezier(.34,1.56,.64,1) both" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Wheel summary */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl">⚙️</div>
          <div>
            <h3 className="text-emerald-950 font-black text-sm">
              {wheel.name || `${wheel.brandName} – ${wheel.carCompany}`}
            </h3>
            <p className="text-emerald-600/60 text-xs">
              Size: {wheel.size}" · PCD: {wheel.pcd}
            </p>
          </div>
        </div>

        {/* Seller info */}
        {seller ? (
          <div className="bg-emerald-50 rounded-2xl p-4 mb-4">
            <p className="text-emerald-800 font-bold text-sm mb-1">{seller.shopName || seller.name}</p>
            {seller.address && (
              <p className="text-emerald-600/60 text-xs mb-2 flex items-center gap-1">
                <MapPin size={11} />{seller.address}
              </p>
            )}
            {seller.phone && (
              <a
                href={`tel:${seller.phone}`}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-4 py-3 rounded-xl transition-all hover:scale-105 justify-center mt-2"
              >
                <Phone size={16} /> {seller.phone}
              </a>
            )}
            {seller.email && (
              <a
                href={`mailto:${seller.email}`}
                className="flex items-center gap-2 bg-white border border-emerald-200 text-emerald-700 font-bold text-sm px-4 py-2.5 rounded-xl transition-all hover:bg-emerald-50 justify-center mt-2"
              >
                ✉️ {seller.email}
              </a>
            )}
          </div>
        ) : (
          <div className="bg-emerald-50 rounded-2xl p-4 mb-4 text-center text-emerald-400 text-sm">
            No seller contact available
          </div>
        )}

        <div className="flex items-center gap-2 text-emerald-500 text-xs">
          <CheckCircle size={14} />
          <span>Verified listing on MotorMandi</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function WheelListingsModal({ isOpen, onClose }) {
  const { wheels, loading, error, pagination, fetchWheels } = useWheels();
  const [search,       setSearch]       = useState("");
  const [condition,    setCondition]    = useState("all");
  const [page,         setPage]         = useState(1);
  const [contactWheel, setContactWheel] = useState(null);
  const [selectedWheel, setSelectedWheel] = useState(null);
  const [hasLoaded,    setHasLoaded]    = useState(false);

  // Fetch on open (once)
  useEffect(() => {
    if (isOpen && !hasLoaded) {
      fetchWheels({ page: 1, limit: 10 });
      setHasLoaded(true);
    }
  }, [isOpen, hasLoaded, fetchWheels]);

  // Reset hasLoaded when modal closes so next open re-fetches
  useEffect(() => {
    if (!isOpen) setHasLoaded(false);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Local filtering (search + condition)
  const filtered = wheels.filter((w) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (w.name        || "").toLowerCase().includes(q) ||
      (w.brandName   || "").toLowerCase().includes(q) ||
      (w.carCompany  || "").toLowerCase().includes(q) ||
      (w.size        || "").toLowerCase().includes(q) ||
      (w.pcd         || "").toLowerCase().includes(q) ||
      (w.code        || "").toLowerCase().includes(q) ||
      (w.user?.shopName || "").toLowerCase().includes(q);

    const matchCondition =
      condition === "all" || (w.condition || "").toLowerCase() === condition;

    return matchSearch && matchCondition;
  });

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchWheels({ page: newPage, limit: 10 });
  };

  const handleRefresh = () => {
    fetchWheels({ page, limit: 10 });
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes slideUp   { from { opacity:0; transform:translateY(30px) scale(.97) } to { opacity:1; transform:none } }
        @keyframes fadeIn    { from { opacity:0 } to { opacity:1 } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-20px) } to { opacity:1; transform:none } }
        .modal-enter  { animation: fadeIn .2s ease both; }
        .panel-enter  { animation: slideDown .3s cubic-bezier(.34,1.56,.64,1) both; }
        .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm modal-enter"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-0 z-[110] overflow-y-auto">
        <div className="min-h-full flex flex-col">
          <div
            className="flex-1 bg-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >

            {/* ── Sticky Header ── */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 sm:px-8 py-4 shadow-sm">
              <div>

                {/* Title row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={LOGO_SRC} alt="MotorMandi" className="h-12 w-auto object-contain" />
                    <div>
                      <h2
                        className="text-gray-900 font-black text-2xl"
                      >
                        Wheels & Rims
                      </h2>
                      {pagination && (
                        <p className="text-gray-500 text-sm">{pagination.totalRecords} products available</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRefresh}
                      disabled={loading}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all disabled:opacity-40"
                    >
                      <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button
                      onClick={onClose}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* ── Filters ── */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search */}
                  <div className="flex-1 flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-2.5">
                    <Search size={18} className="text-gray-500 shrink-0" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search brand, size, PCD, model..."
                      className="bg-transparent text-gray-900 placeholder-gray-500 text-sm w-full outline-none"
                    />
                    {search && (
                      <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {/* Condition filter */}
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2.5">
                    <SlidersHorizontal size={16} className="text-gray-600" />
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="bg-transparent text-gray-900 text-sm font-semibold outline-none cursor-pointer"
                    >
                      <option value="all">All Conditions</option>
                      <option value="new">New</option>
                      <option value="old">Used / Old</option>
                    </select>
                  </div>
                </div>

                {/* Active filter chips */}
                {(condition !== "all" || search) && (
                  <div className="flex gap-2 flex-wrap mt-3">
                    {search && (
                      <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2">
                        🔍 "{search}"
                        <button onClick={() => setSearch("")} className="hover:text-blue-900">
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {condition !== "all" && (
                      <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2 capitalize">
                        {condition}
                        <button onClick={() => setCondition("all")} className="hover:text-blue-900">
                          <X size={12} />
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 px-4 sm:px-8 py-8 max-w-full w-full bg-gray-50">

              {/* Loading skeletons */}
              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
                  {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              )}

              {/* Error */}
              {!loading && error && (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle size={40} className="text-red-400" />
                  </div>
                  <p className="text-gray-900 font-bold text-2xl mb-2">Failed to load wheels</p>
                  <p className="text-gray-600 text-base mb-8">{error}</p>
                  <button
                    onClick={handleRefresh}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <RefreshCw size={18} /> Try Again
                  </button>
                </div>
              )}

              {/* Empty */}
              {!loading && !error && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <div className="text-9xl mb-6">⚙️</div>
                  <p className="text-gray-900 font-bold text-2xl mb-2">No wheels found</p>
                  <p className="text-gray-600 text-base mb-8">Try adjusting your search or filters</p>
                  <button
                    onClick={() => { setSearch(""); setCondition("all"); }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3 rounded-lg transition-all hover:scale-105"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Grid */}
              {!loading && !error && filtered.length > 0 && (
                <>
                  <p className="text-gray-600 text-sm font-semibold mb-6">
                    📍 Showing <span className="font-bold text-emerald-600">{filtered.length}</span> listing{filtered.length !== 1 ? "s" : ""}
                    {search && ` for <span class="text-emerald-600">"${search}"</span>`}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
                    {filtered.map((wheel) => (
                      <WheelCard key={wheel.id} wheel={wheel} onContact={setContactWheel} onItemClick={setSelectedWheel} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-12">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                        className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft size={18} />
                      </button>

                      {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                            p === page
                              ? "bg-emerald-600 text-white shadow-lg"
                              : "border border-gray-300 text-gray-700 hover:bg-white"
                          }`}
                        >
                          {p}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= pagination.totalPages}
                        className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 text-gray-700 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="border-t border-gray-200 px-4 sm:px-8 py-4 bg-white">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">
                  {pagination ? `${pagination.totalRecords} total listings available` : "Live data"}
                </p>
                <button
                  onClick={onClose}
                  className="text-sm text-emerald-600 hover:text-emerald-500 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <X size={16} /> Close
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Contact popup */}
      {contactWheel && (
        <ContactPopup wheel={contactWheel} onClose={() => setContactWheel(null)} />
      )}

      <WheelDetailModal
        isOpen={!!selectedWheel}
        onClose={() => setSelectedWheel(null)}
        item={selectedWheel}
      />
    </>
  );
}