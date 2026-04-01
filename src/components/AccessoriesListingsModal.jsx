// ── components/AccessoriesListingsModal.jsx ──────────────────────────────────────
// Full-screen modal that shows live accessories listings fetched from the API.
// Triggered when user clicks "Accessories" in the Categories section.
// ──────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import {
  X, Search, Filter, MapPin, Phone, Tag, RefreshCw,
  ChevronLeft, ChevronRight, AlertCircle, Package,
  Star, ShoppingBag, SlidersHorizontal, CheckCircle, Heart
} from "lucide-react";
import useAccessories from "../hooks/useAccessories";
import AccessoryDetailModal from "./AccessoryDetailModal";
import LOGO_SRC from "../assets/motorMandiLogo.png";

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatPrice = (price) => {
  const n = parseFloat(price);
  if (isNaN(n)) return "N/A";
  return `₹${n.toLocaleString("en-IN")}`;
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

// ── Accessory Card ────────────────────────────────────────────────────────────
function AccessoryCard({ accessory, onContact, onClick }) {
  const [imgError, setImgError] = useState(false);
  const [liked, setLiked] = useState(false);
  const firstImage = accessory.medias?.[0]?.media;

  const discount = accessory.ownerPrice && accessory.customerPrice
    ? Math.round(((parseFloat(accessory.customerPrice) - parseFloat(accessory.ownerPrice)) / parseFloat(accessory.customerPrice)) * 100)
    : 0;

  const savings = accessory.ownerPrice && accessory.customerPrice
    ? Math.max(0, parseFloat(accessory.customerPrice) - parseFloat(accessory.ownerPrice))
    : 0;

  return (
    <div
      onClick={onClick}
      className="group bg-white border border-emerald-100 hover:border-emerald-400 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-100/60 flex flex-col h-full cursor-pointer"
    >
      {/* Image Section */}
      <div className="relative bg-gray-100 overflow-hidden flex items-center justify-center aspect-square">
        {firstImage && !imgError ? (
          <img
            src={firstImage}
            alt={accessory.title || "Accessory"}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <span className="text-6xl select-none">🔧</span>
        )}

        {/* Top Left Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <div className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded">
              {discount}% OFF
            </div>
          )}
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded border bg-white text-emerald-700 border-emerald-200">
            New
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
        {accessory.medias?.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            +{accessory.medias.length - 1}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3.5 flex flex-col flex-1">
        {/* Product Type */}
        <div className="text-teal-600 text-xs font-bold mb-1 uppercase tracking-wide">
          Auto Part
        </div>

        {/* Title */}
        <h3 className="text-gray-800 font-semibold text-sm leading-tight mb-2 line-clamp-2 group-hover:text-emerald-600">
          {accessory.title || "Accessory"}
        </h3>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill="#fbbf24" stroke="#fbbf24" />
            ))}
          </div>
          <span className="text-xs text-gray-500">(120+)</span>
        </div>

        {/* Description */}
        {accessory.description && (
          <p className="text-gray-600 text-xs mb-2 line-clamp-2">
            {accessory.description}
          </p>
        )}

        {/* Price Section */}
        <div className="mb-2 pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-gray-900">{formatPrice(accessory.ownerPrice)}</span>
            {accessory.customerPrice && (
              <span className="text-xs text-gray-500 line-through">{formatPrice(accessory.customerPrice)}</span>
            )}
          </div>
        </div>

        {/* Savings Badge */}
        {savings > 0 && (
          <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded mb-2">
            ✓ Save {formatPrice(savings)}
          </div>
        )}

        {/* Seller Location Info */}
        {accessory.user && (
          <div className="text-gray-600 text-xs mb-3 pb-2 border-b border-gray-100">
            <MapPin size={10} className="inline mr-1" />
            <span className="font-medium truncate">{accessory.user.shopName || accessory.user.name}</span>
            {accessory.user.city && <span> · {accessory.user.city}</span>}
          </div>
        )}

        {/* Verified Badge */}
        <div className="text-emerald-700 text-xs font-semibold mb-3">
          ✓ Verified Seller
        </div>

        {/* Contact Button */}
        <button
          onClick={() => onContact && onContact(accessory)}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 text-sm"
        >
          <Phone size={14} /> Contact Now
        </button>
      </div>
    </div>
  );
}

// ── Contact Popup ─────────────────────────────────────────────────────────────
function ContactPopup({ accessory, onClose }) {
  if (!accessory) return null;

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
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl">🔧</div>
          <div>
            <h3 className="text-emerald-950 font-black text-sm">{accessory.title || "Accessory"}</h3>
            <p className="text-emerald-600/60 text-xs">Auto Parts & Accessories</p>
          </div>
        </div>

        {accessory.user && (
          <div className="bg-emerald-50 rounded-2xl p-4 mb-4">
            <p className="text-emerald-800 font-bold text-sm mb-1">{accessory.user.shopName || accessory.user.name}</p>
            {accessory.user.address && <p className="text-emerald-600/60 text-xs mb-2 flex items-center gap-1"><MapPin size={11} />{accessory.user.address}</p>}
            <a
              href={`tel:${accessory.user.phone}`}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-4 py-3 rounded-xl transition-all hover:scale-105 justify-center mt-2"
            >
              <Phone size={16} /> {accessory.user.phone}
            </a>
            {accessory.user.email && (
              <a
                href={`mailto:${accessory.user.email}`}
                className="flex items-center gap-2 bg-white border border-emerald-200 text-emerald-700 font-bold text-sm px-4 py-2.5 rounded-xl transition-all hover:bg-emerald-50 justify-center mt-2"
              >
                ✉️ {accessory.user.email}
              </a>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4 text-xs text-emerald-700/80">
          <div className="bg-emerald-50 rounded-2xl p-3">
            <div className="font-bold text-emerald-900 mb-1">Price</div>
            <div>{formatPrice(accessory.ownerPrice)}</div>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-3">
            <div className="font-bold text-emerald-900 mb-1">Status</div>
            <div className="capitalize">{accessory.status || "Active"}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-emerald-500 text-xs">
          <CheckCircle size={14} />
          <span>Verified seller on MotorMandi</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Modal Component ──────────────────────────────────────────────────────
export default function AccessoriesListingsModal({ isOpen, onClose }) {
  const { accessories, loading, error, pagination, fetchAccessories } = useAccessories();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [contactAccessory, setContactAccessory] = useState(null);
  const [selectedAccessory, setSelectedAccessory] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && !hasLoaded) {
      fetchAccessories({ page: 1, limit: 20 });
      setHasLoaded(true);
    }
  }, [isOpen, hasLoaded, fetchAccessories]);

  useEffect(() => {
    if (!isOpen) setHasLoaded(false);
  }, [isOpen]);

  useEffect(() => {
    const handler = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const filtered = accessories.filter((acc) => {
    const q = search.toLowerCase();
    return !q ||
      (acc.title || "").toLowerCase().includes(q) ||
      (acc.description || "").toLowerCase().includes(q) ||
      (acc.user?.shopName || "").toLowerCase().includes(q);
  });

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchAccessories({ page: newPage, limit: 20 });
    window.scrollTo(0, 0);
  };

  const handleRefresh = () => {
    fetchAccessories({ page, limit: 20 });
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

      <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md modal-enter" onClick={onClose} />

      <div className="fixed inset-0 z-[110] overflow-y-auto">
        <div className="min-h-full flex flex-col">
          <div className="flex-1 bg-white mt-16 rounded-t-3xl panel-enter flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-emerald-100 px-4 sm:px-6 py-4 rounded-t-3xl">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={LOGO_SRC} alt="MotorMandi" className="h-10 w-auto object-contain" />
                    <div>
                      <h2 className="text-emerald-950 font-black text-xl leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>
                        ACCESSORIES & PARTS
                      </h2>
                      {pagination && (
                        <p className="text-emerald-500 text-xs">{pagination.totalRecords} accessories found</p>
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

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 flex items-center gap-2 bg-emerald-50 rounded-xl px-4 py-2.5">
                    <Search size={16} className="text-emerald-400 shrink-0" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search parts, accessories, category..."
                      className="bg-transparent text-emerald-900 placeholder-emerald-400 text-sm w-full outline-none"
                    />
                    {search && (
                      <button onClick={() => setSearch("")} className="text-emerald-400 hover:text-emerald-600">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {search && (
                  <div className="flex gap-2 flex-wrap mt-3">
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                      🔍 "{search}"
                      <button onClick={() => setSearch("")}><X size={10} /></button>
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full">
              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
                  {Array.from({ length: 10 }).map((_, index) => <SkeletonCard key={index} />)}
                </div>
              )}

              {!loading && error && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle size={28} className="text-red-400" />
                  </div>
                  <p className="text-emerald-950 font-bold text-lg mb-1">Failed to load accessories</p>
                  <p className="text-emerald-600/60 text-sm mb-5">{error}</p>
                  <button
                    onClick={handleRefresh}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <RefreshCw size={16} /> Try Again
                  </button>
                </div>
              )}

              {!loading && !error && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-7xl mb-4">🔧</div>
                  <p className="text-emerald-950 font-bold text-lg mb-1">No accessories found</p>
                  <p className="text-emerald-600/60 text-sm mb-5">Try adjusting your search</p>
                  <button
                    onClick={() => setSearch("")}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all hover:scale-105"
                  >
                    Clear Search
                  </button>
                </div>
              )}

              {!loading && !error && filtered.length > 0 && (
                <>
                  <p className="text-emerald-600/50 text-xs font-semibold mb-4">
                    Showing {filtered.length} item{filtered.length !== 1 ? "s" : ""}
                    {search && ` for "${search}"`}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
                    {filtered.map((accessory) => (
                      <AccessoryCard
                        key={accessory.id}
                        accessory={accessory}
                        onContact={setContactAccessory}
                        onClick={() => setSelectedAccessory(accessory)}
                      />
                    ))}
                  </div>

                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-10">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft size={18} />
                      </button>

                      {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${
                            p === page
                              ? "bg-emerald-600 text-white"
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
          </div>
        </div>
      </div>

      {contactAccessory && <ContactPopup accessory={contactAccessory} onClose={() => setContactAccessory(null)} />}
      {selectedAccessory && <AccessoryDetailModal accessory={selectedAccessory} onClose={() => setSelectedAccessory(null)} />}
    </>
  );
}
