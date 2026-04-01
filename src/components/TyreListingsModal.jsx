// ── components/TyreListingsModal.jsx ─────────────────────────────────────────
// Full-screen modal that shows live tyre listings fetched from the API.
// Triggered when user clicks "Tyres" in the Categories section.
// ──────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X, Search, Filter, MapPin, Phone, Tag, RefreshCw,
  ChevronLeft, ChevronRight, AlertCircle, Package,
  Star, ShoppingBag, SlidersHorizontal, CheckCircle, Heart
} from "lucide-react";
import useTyres from "../hooks/useTyres";
import LOGO_SRC from "../assets/motorMandiLogo.png";

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatPrice = (price) => {
  const n = parseFloat(price);
  if (isNaN(n)) return "N/A";
  return `₹${n.toLocaleString("en-IN")}`;
};

const conditionColors = {
  new:  "bg-emerald-100 text-emerald-700 border-emerald-200",
  old:  "bg-amber-50   text-amber-600   border-amber-200",
  used: "bg-amber-50   text-amber-600   border-amber-200",
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

// ── Tyre Card ─────────────────────────────────────────────────────────────────
function TyreCard({ tyre, onContact, onCardClick }) {
  const [imgError, setImgError] = useState(false);
  const [liked,    setLiked]    = useState(false);
  const firstImage = tyre.medias?.[0]?.media;
  const conditionKey = tyre.condition?.toLowerCase();
  const conditionClass = conditionColors[conditionKey] || conditionColors.old;

  const savings = tyre.price && tyre.customerPrice
    ? Math.max(0, parseFloat(tyre.customerPrice) - parseFloat(tyre.price))
    : 0;
  
  const discountPercent = tyre.price && tyre.customerPrice
    ? Math.round(((parseFloat(tyre.customerPrice) - parseFloat(tyre.price)) / parseFloat(tyre.customerPrice)) * 100)
    : 0;

  return (
    <div
      onClick={onCardClick}
      className="group bg-white border border-gray-200 hover:border-emerald-400 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-100/60 flex flex-col h-full cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative bg-gray-100 overflow-hidden flex items-center justify-center aspect-square">
        {firstImage && !imgError ? (
          <img
            src={firstImage}
            alt={tyre.name || "Tyre"}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <span className="text-6xl select-none">🛞</span>
        )}

        {/* Top Left Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discountPercent > 0 && (
            <div className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded">
              {discountPercent}% OFF
            </div>
          )}
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border capitalize bg-white ${conditionClass}`}>
            {tyre.condition || "—"}
          </span>
        </div>

        {/* Wishlist */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110"
        >
          <Heart size={16} fill={liked ? "#ef4444" : "none"} stroke={liked ? "#ef4444" : "#999"} />
        </button>

        {/* Multiple images indicator */}
        {tyre.medias?.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            +{tyre.medias.length - 1}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3.5 flex flex-col flex-1">
        {/* Brand Name */}
        {tyre.brandName && (
          <div className="text-teal-600 text-xs font-bold mb-1 uppercase tracking-wide">
            {tyre.brandName}
          </div>
        )}

        {/* Name / Size */}
        <h3 className="text-gray-800 font-semibold text-sm leading-tight mb-2 line-clamp-2 group-hover:text-emerald-600">
          {tyre.name || "Premium Tyre"}
          {tyre.size && (
            <span className="block text-xs text-gray-500 font-normal mt-0.5">{tyre.size}</span>
          )}
        </h3>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill="#fbbf24" stroke="#fbbf24" />
            ))}
          </div>
          <span className="text-xs text-gray-500">(200+)</span>
        </div>

        {/* Car Company */}
        {tyre.carCompany && (
          <p className="text-gray-600 text-xs mb-2">📍 Fits: <span className="font-medium">{tyre.carCompany}</span></p>
        )}

        {/* Price Section */}
        <div className="mb-2 pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-gray-900">{formatPrice(tyre.price)}</span>
            {tyre.customerPrice && (
              <span className="text-xs text-gray-500 line-through">{formatPrice(tyre.customerPrice)}</span>
            )}
          </div>
        </div>

        {/* Savings Badge */}
        {savings > 0 && (
          <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded mb-2">
            ✓ Save {formatPrice(savings)}
          </div>
        )}

        {/* Delivery Info */}
        <div className="text-emerald-600 text-xs font-semibold mb-3 flex items-center gap-1">
          🚚 FREE delivery by Thu
        </div>

        {/* Shop Info */}
        {tyre.user && (
          <div className="text-gray-600 text-xs mb-3 pb-2 border-b border-gray-100">
            <MapPin size={10} className="inline mr-1" />
            <span className="font-medium truncate">{tyre.user.shopName || tyre.user.name}</span>
          </div>
        )}

        {/* Stock Status */}
        <div className="text-emerald-700 text-xs font-semibold mb-3">
          {tyre.quantity && tyre.quantity > 5 ? "✓ In Stock" : "Only few left"}
        </div>

        {/* Contact Button */}
        <button
          onClick={() => onContact(tyre)}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 text-sm"
        >
          <Phone size={14} /> Contact Now
        </button>
      </div>
    </div>
  );
}

// ── Contact Popup ─────────────────────────────────────────────────────────────
function ContactPopup({ tyre, onClose }) {
  if (!tyre) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl p-7 max-w-sm w-full shadow-2xl border border-emerald-100"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideUp .25s cubic-bezier(.34,1.56,.64,1) both" }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors">
          <X size={16} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl">🛞</div>
          <div>
            <h3 className="text-emerald-950 font-black text-sm">{tyre.name || "Tyre Listing"}</h3>
            <p className="text-emerald-600/60 text-xs">Size: {tyre.size} · {tyre.type}</p>
          </div>
        </div>

        {tyre.user && (
          <div className="bg-emerald-50 rounded-2xl p-4 mb-4">
            <p className="text-emerald-800 font-bold text-sm mb-1">{tyre.user.shopName || tyre.user.name}</p>
            {tyre.user.address && <p className="text-emerald-600/60 text-xs mb-2 flex items-center gap-1"><MapPin size={11}/>{tyre.user.address}</p>}
            <a
              href={`tel:${tyre.user.phone}`}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-4 py-3 rounded-xl transition-all hover:scale-105 justify-center mt-2"
            >
              <Phone size={16} /> {tyre.user.phone}
            </a>
            {tyre.user.email && (
              <a
                href={`mailto:${tyre.user.email}`}
                className="flex items-center gap-2 bg-white border border-emerald-200 text-emerald-700 font-bold text-sm px-4 py-2.5 rounded-xl transition-all hover:bg-emerald-50 justify-center mt-2"
              >
                ✉️ {tyre.user.email}
              </a>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 text-emerald-500 text-xs">
          <CheckCircle size={14} />
          <span>Verified seller on MotorMandi</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Modal ────────────────────────────────────────────────────────────────
export default function TyreListingsModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { tyres, loading, error, pagination, fetchTyres } = useTyres();
  const [search,      setSearch]      = useState("");
  const [condition,   setCondition]   = useState("all");
  const [tyreType,    setTyreType]    = useState("all");
  const [page,        setPage]        = useState(1);
  const [contactTyre, setContactTyre] = useState(null);
  const [hasLoaded,   setHasLoaded]   = useState(false);

  // Fetch on open
  useEffect(() => {
    if (isOpen && !hasLoaded) {
      fetchTyres({ page: 1, limit: 10 });
      setHasLoaded(true);
    }
  }, [isOpen, hasLoaded, fetchTyres]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Filter locally (for search / condition / type)
  const filtered = tyres.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (t.name || "").toLowerCase().includes(q) ||
      (t.brandName || "").toLowerCase().includes(q) ||
      (t.size || "").toLowerCase().includes(q) ||
      (t.user?.shopName || "").toLowerCase().includes(q);

    const matchCondition = condition === "all" || (t.condition || "").toLowerCase() === condition;
    const matchType      = tyreType  === "all" || (t.type     || "").toLowerCase() === tyreType.toLowerCase();

    return matchSearch && matchCondition && matchType;
  });

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchTyres({ page: newPage, limit: 10 });
    window.scrollTo(0, 0);
  };

  const handleRefresh = () => {
    fetchTyres({ page, limit: 10 });
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes slideUp   { from { opacity:0; transform:translateY(30px) scale(.97) } to { opacity:1; transform:none } }
        @keyframes fadeIn    { from { opacity:0 } to { opacity:1 } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-20px) } to { opacity:1; transform:none } }
        .modal-enter { animation: fadeIn .2s ease both; }
        .panel-enter { animation: slideDown .3s cubic-bezier(.34,1.56,.64,1) both; }
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
            {/* ── Header ── */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 sm:px-8 py-4 shadow-sm">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={LOGO_SRC} alt="MotorMandi" className="h-12 w-auto object-contain" />
                    <div>
                      <h2 className="text-gray-900 font-black text-2xl">
                        Premium Tyres & Rims
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
                      placeholder="Search brand, size, shop..."
                      className="bg-transparent text-gray-900 placeholder-gray-500 text-sm w-full outline-none"
                    />
                    {search && (
                      <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {/* Condition */}
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

                  {/* Type */}
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2.5">
                    <Filter size={16} className="text-gray-600" />
                    <select
                      value={tyreType}
                      onChange={(e) => setTyreType(e.target.value)}
                      className="bg-transparent text-gray-900 text-sm font-semibold outline-none cursor-pointer"
                    >
                      <option value="all">All Types</option>
                      <option value="TubeLess">Tubeless</option>
                      <option value="Tube">Tube</option>
                      <option value="RunFlat">Run Flat</option>
                    </select>
                  </div>
                </div>

                {/* Active filter chips */}
                {(condition !== "all" || tyreType !== "all" || search) && (
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
                    {tyreType !== "all" && (
                      <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2">
                        {tyreType}
                        <button onClick={() => setTyreType("all")} className="hover:text-blue-900">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              )}

              {/* Error */}
              {!loading && error && (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle size={40} className="text-red-400" />
                  </div>
                  <p className="text-gray-900 font-bold text-2xl mb-2">Failed to load tyres</p>
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
                  <div className="text-9xl mb-6">🛞</div>
                  <p className="text-gray-900 font-bold text-2xl mb-2">No tyres found</p>
                  <p className="text-gray-600 text-base mb-8">Try adjusting your search or filters</p>
                  <button
                    onClick={() => { setSearch(""); setCondition("all"); setTyreType("all"); }}
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
                    {filtered.map((tyre) => (
                      <TyreCard
                        key={tyre.id}
                        tyre={tyre}
                        onContact={setContactTyre}
                        onCardClick={() => navigate(`/tyre/${tyre.id}`)}
                      />
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
      {contactTyre && (
        <ContactPopup tyre={contactTyre} onClose={() => setContactTyre(null)} />
      )}
    </>
  );
}