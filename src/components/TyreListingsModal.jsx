// ── components/TyreListingsModal.jsx ─────────────────────────────────────────
// Full-screen modal that shows live tyre listings fetched from the API.
// Triggered when user clicks "Tyres" in the Categories section.
// ──────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import {
  X, Search, Filter, MapPin, Phone, Tag, RefreshCw,
  ChevronLeft, ChevronRight, AlertCircle, Package,
  Star, ShoppingBag, SlidersHorizontal, CheckCircle
} from "lucide-react";
import useTyres from "../hooks/useTyres";

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
function TyreCard({ tyre, onContact }) {
  const [imgError, setImgError] = useState(false);
  const [liked,    setLiked]    = useState(false);
  const firstImage = tyre.medias?.[0]?.media;
  const conditionKey = tyre.condition?.toLowerCase();
  const conditionClass = conditionColors[conditionKey] || conditionColors.old;

  const savings = tyre.price && tyre.customerPrice
    ? Math.max(0, parseFloat(tyre.customerPrice) - parseFloat(tyre.price))
    : 0;

  return (
    <div className="group bg-white border border-emerald-100 hover:border-emerald-400/60 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-100/80 flex flex-col">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-emerald-50 to-green-50 overflow-hidden flex items-center justify-center">
        {firstImage && !imgError ? (
          <img
            src={firstImage}
            alt={tyre.name || "Tyre"}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-7xl select-none">🛞</span>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border capitalize ${conditionClass}`}>
            {tyre.condition || "—"}
          </span>
          {savings > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
              Save {formatPrice(savings)}
            </span>
          )}
        </div>

        {/* Multiple images indicator */}
        {tyre.medias?.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            +{tyre.medias.length - 1} photos
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow transition-transform hover:scale-110"
        >
          <Star size={14} fill={liked ? "#f59e0b" : "none"} stroke={liked ? "#f59e0b" : "#9ca3af"} />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Meta */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
            {tyre.type || "Tyre"}
          </span>
          {tyre.brandName && (
            <>
              <span className="text-emerald-300">·</span>
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">{tyre.brandName}</span>
            </>
          )}
        </div>

        {/* Name / Size */}
        <h3 className="text-emerald-950 font-bold text-sm leading-snug group-hover:text-emerald-600 transition-colors mb-1">
          {tyre.name || tyre.brandName || "Tyre Listing"}
          {tyre.size && (
            <span className="ml-1 text-emerald-400 font-normal">({tyre.size})</span>
          )}
        </h3>

        {/* Car Company */}
        {tyre.carCompany && (
          <p className="text-emerald-600/60 text-xs mb-1">Fits: {tyre.carCompany}</p>
        )}

        {/* Quantity */}
        <div className="flex items-center gap-1.5 text-emerald-600/60 text-xs mb-1">
          <Package size={11} />
          <span>{tyre.quantity} in stock</span>
        </div>

        {/* Shop location */}
        {tyre.user && (
          <div className="flex items-center gap-1.5 text-emerald-600/60 text-xs mb-3">
            <MapPin size={11} />
            <span className="truncate">{tyre.user.shopName || tyre.user.name}</span>
            {tyre.user.city && <span>· {tyre.user.city}</span>}
          </div>
        )}

        {/* Description */}
        {tyre.description && (
          <p className="text-emerald-700/50 text-xs mb-3 line-clamp-2">{tyre.description}</p>
        )}

        {/* Price row */}
        <div className="flex items-end justify-between mt-auto pt-3 border-t border-emerald-50">
          <div>
            <div className="text-emerald-700 font-black text-xl">{formatPrice(tyre.price)}</div>
            {tyre.customerPrice && (
              <div className="text-emerald-400/60 text-xs line-through">{formatPrice(tyre.customerPrice)}</div>
            )}
          </div>
          <button
            onClick={() => onContact(tyre)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
          >
            <Phone size={12} /> Contact
          </button>
        </div>
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
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md modal-enter"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-0 z-[110] overflow-y-auto">
        <div className="min-h-full flex flex-col">
          <div
            className="flex-1 bg-white mt-16 rounded-t-3xl panel-enter flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Header ── */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-emerald-100 px-4 sm:px-6 py-4 rounded-t-3xl">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl">🛞</div>
                    <div>
                      <h2 className="text-emerald-950 font-black text-xl leading-none" style={{ fontFamily:"'Bebas Neue', sans-serif", letterSpacing:"0.04em" }}>
                        TYRE LISTINGS
                      </h2>
                      {pagination && (
                        <p className="text-emerald-500 text-xs">{pagination.totalRecords} tyres found</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRefresh}
                      disabled={loading}
                      className="w-9 h-9 flex items-center justify-center rounded-xl border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-all disabled:opacity-40"
                    >
                      <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button
                      onClick={onClose}
                      className="w-9 h-9 flex items-center justify-center rounded-xl border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition-all"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                {/* ── Filters ── */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search */}
                  <div className="flex-1 flex items-center gap-2 bg-emerald-50 rounded-xl px-4 py-2.5">
                    <Search size={16} className="text-emerald-400 shrink-0" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search brand, size, shop..."
                      className="bg-transparent text-emerald-900 placeholder-emerald-400 text-sm w-full outline-none"
                    />
                    {search && (
                      <button onClick={() => setSearch("")} className="text-emerald-400 hover:text-emerald-600">
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Condition */}
                  <div className="flex items-center gap-2 bg-emerald-50 rounded-xl px-3 py-2.5">
                    <SlidersHorizontal size={14} className="text-emerald-500" />
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="bg-transparent text-emerald-700 text-sm font-semibold outline-none cursor-pointer"
                    >
                      <option value="all">All Conditions</option>
                      <option value="new">New</option>
                      <option value="old">Used / Old</option>
                    </select>
                  </div>

                  {/* Type */}
                  <div className="flex items-center gap-2 bg-emerald-50 rounded-xl px-3 py-2.5">
                    <Filter size={14} className="text-emerald-500" />
                    <select
                      value={tyreType}
                      onChange={(e) => setTyreType(e.target.value)}
                      className="bg-transparent text-emerald-700 text-sm font-semibold outline-none cursor-pointer"
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
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                        🔍 "{search}"
                        <button onClick={() => setSearch("")}><X size={10} /></button>
                      </span>
                    )}
                    {condition !== "all" && (
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 capitalize">
                        {condition}
                        <button onClick={() => setCondition("all")}><X size={10} /></button>
                      </span>
                    )}
                    {tyreType !== "all" && (
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                        {tyreType}
                        <button onClick={() => setTyreType("all")}><X size={10} /></button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full">

              {/* Loading skeletons */}
              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              )}

              {/* Error */}
              {!loading && error && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle size={28} className="text-red-400" />
                  </div>
                  <p className="text-emerald-950 font-bold text-lg mb-1">Failed to load tyres</p>
                  <p className="text-emerald-600/60 text-sm mb-5">{error}</p>
                  <button
                    onClick={handleRefresh}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <RefreshCw size={16} /> Try Again
                  </button>
                </div>
              )}

              {/* Empty */}
              {!loading && !error && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-7xl mb-4">🛞</div>
                  <p className="text-emerald-950 font-bold text-lg mb-1">No tyres found</p>
                  <p className="text-emerald-600/60 text-sm mb-5">Try adjusting your search or filters</p>
                  <button
                    onClick={() => { setSearch(""); setCondition("all"); setTyreType("all"); }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all hover:scale-105"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Grid */}
              {!loading && !error && filtered.length > 0 && (
                <>
                  <p className="text-emerald-600/50 text-xs font-semibold mb-4">
                    Showing {filtered.length} listing{filtered.length !== 1 ? "s" : ""}
                    {search && ` for "${search}"`}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filtered.map((tyre) => (
                      <TyreCard key={tyre.id} tyre={tyre} onContact={setContactTyre} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-10">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft size={18} />
                      </button>

                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                            p === page
                              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                              : "border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          }`}
                        >
                          {p}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= pagination.totalPages}
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── Footer ── */}
            <div className="border-t border-emerald-100 px-6 py-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <p className="text-emerald-600/50 text-xs">
                  {pagination ? `${pagination.totalRecords} total listings` : "Live data"}
                </p>
                <button
                  onClick={onClose}
                  className="text-sm text-emerald-600 hover:text-emerald-500 font-semibold flex items-center gap-1 transition-colors"
                >
                  <X size={14} /> Close
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