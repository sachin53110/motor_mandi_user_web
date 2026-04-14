import { useEffect, useState } from "react";
import {
  X, Search, MapPin, Phone, RefreshCw, ChevronLeft, ChevronRight,
  AlertCircle, Star, SlidersHorizontal, CheckCircle, Heart
} from "lucide-react";
import useBikes from "../hooks/useBikes";
import ItemDetailModal from "./ItemDetailModal";
import LOGO_SRC from "../assets/motorMandiLogo.png";

const formatPrice = (price) => {
  const value = parseFloat(price);
  if (Number.isNaN(value)) return "N/A";
  return `₹${value.toLocaleString("en-IN")}`;
};

const conditionStyles = {
  excellent: "bg-blue-100 text-blue-700 border-blue-200",
  good: "bg-lime-50 text-lime-700 border-lime-200",
  fair: "bg-amber-50 text-amber-700 border-amber-200",
  old: "bg-amber-50 text-amber-700 border-amber-200",
  used: "bg-amber-50 text-amber-700 border-amber-200",
};

function SkeletonCard() {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-blue-50" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-blue-100 rounded w-1/3" />
        <div className="h-4 bg-blue-100 rounded w-3/4" />
        <div className="h-3 bg-blue-100 rounded w-1/2" />
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="h-7 bg-blue-100 rounded-xl" />
          <div className="h-7 bg-blue-100 rounded-xl" />
          <div className="h-7 bg-blue-100 rounded-xl" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-blue-100 rounded w-24" />
          <div className="h-8 bg-blue-100 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

function BikeCard({ bike, onContact, onItemClick }) {
  const [imgError, setImgError] = useState(false);
  const [liked, setLiked] = useState(false);
  const firstImage = bike.medias?.[0]?.media;
  const conditionKey = bike.condition?.toLowerCase();
  const conditionClass = conditionStyles[conditionKey] || conditionStyles.old;

  const discount = bike.price && bike.customerPrice
    ? Math.round(((parseFloat(bike.customerPrice) - parseFloat(bike.price)) / parseFloat(bike.customerPrice)) * 100)
    : 0;

  return (
    <div
      onClick={() => onItemClick && onItemClick(bike)}
      className="group bg-white border border-gray-200 hover:border-blue-400 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-100/60 flex flex-col cursor-pointer h-full"
    >
      {/* Image Section */}
      <div className="relative bg-gray-100 overflow-hidden flex items-center justify-center aspect-square">
        {firstImage && !imgError ? (
          <img
            src={firstImage}
            alt={bike.name || "Bike"}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <span className="text-6xl select-none">🏍️</span>
        )}

        {/* Top Left Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discount > 0 && (
            <div className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded">
              {discount}% OFF
            </div>
          )}
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border capitalize bg-white ${conditionClass}`}>
            {bike.condition || "—"}
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
        {bike.medias?.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            +{bike.medias.length - 1}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3.5 flex flex-col flex-1">
        {/* Brand */}
        {bike.brandName && (
          <div className="text-teal-600 text-xs font-bold mb-1 uppercase tracking-wide">
            {bike.brandName}
          </div>
        )}

        {/* Name */}
        <h3 className="text-gray-800 font-semibold text-sm leading-tight mb-2 line-clamp-2 group-hover:text-blue-600">
          {bike.name || bike.brandName || "Premium Bike"}
          {bike.model && (
            <span className="block text-xs text-gray-500 font-normal mt-0.5">{bike.model}</span>
          )}
        </h3>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill="#fbbf24" stroke="#fbbf24" />
            ))}
          </div>
          <span className="text-xs text-gray-500">(180+)</span>
        </div>

        {/* Key Details */}
        <div className="mb-2 pb-2 border-b border-gray-100">
          {bike.year && <p className="text-xs text-gray-600">📅 <span className="font-medium">{bike.year}</span></p>}
          {bike.cc && <p className="text-xs text-gray-600">⚡ <span className="font-medium">{bike.cc}</span></p>}
        </div>

        {/* Price Section */}
        <div className="mb-2 py-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-gray-900">{formatPrice(bike.price)}</span>
            {bike.customerPrice && (
              <span className="text-xs text-gray-500 line-through">{formatPrice(bike.customerPrice)}</span>
            )}
          </div>
        </div>

        {/* Location Info */}
        {bike.user && (
          <div className="text-gray-600 text-xs mb-3 pb-2 border-b border-gray-100">
            <MapPin size={10} className="inline mr-1" />
            <span className="font-medium truncate">{bike.user.shopName || bike.user.name}</span>
            {bike.user.city && <span> · {bike.user.city}</span>}
          </div>
        )}

        {/* Stock Status */}
        <div className="text-blue-700 text-xs font-semibold mb-3">
          ✓ Verified Listing
        </div>

        {/* Contact Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onContact(bike); }}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 text-sm"
        >
          <Phone size={14} /> Contact Now
        </button>
      </div>
    </div>
  );
}

function ContactPopup({ bike, onClose }) {
  if (!bike) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl p-7 max-w-sm w-full shadow-2xl border border-blue-100"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideUp .25s cubic-bezier(.34,1.56,.64,1) both" }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors">
          <X size={16} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl">🏍️</div>
          <div>
            <h3 className="text-blue-950 font-black text-sm">{bike.name || "Bike Listing"}</h3>
            <p className="text-blue-600/60 text-xs">{bike.brandName || "Brand"} · {bike.model || "Model"}</p>
          </div>
        </div>

        {bike.user && (
          <div className="bg-blue-50 rounded-2xl p-4 mb-4">
            <p className="text-blue-800 font-bold text-sm mb-1">{bike.user.shopName || bike.user.name}</p>
            {bike.user.address && <p className="text-blue-600/60 text-xs mb-2 flex items-center gap-1"><MapPin size={11} />{bike.user.address}</p>}
            <a
              href={`tel:${bike.user.phone}`}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-4 py-3 rounded-xl transition-all hover:scale-105 justify-center mt-2"
            >
              <Phone size={16} /> {bike.user.phone}
            </a>
            {bike.user.email && (
              <a
                href={`mailto:${bike.user.email}`}
                className="flex items-center gap-2 bg-white border border-blue-200 text-blue-700 font-bold text-sm px-4 py-2.5 rounded-xl transition-all hover:bg-blue-50 justify-center mt-2"
              >
                ✉️ {bike.user.email}
              </a>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-4 text-xs text-blue-700/80">
          <div className="bg-blue-50 rounded-2xl p-3">
            <div className="font-bold text-blue-900 mb-1">Vehicle Number</div>
            <div>{bike.vehicleNumber || "—"}</div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-3">
            <div className="font-bold text-blue-900 mb-1">Condition</div>
            <div>{bike.condition || "—"}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-blue-500 text-xs">
          <CheckCircle size={14} />
          <span>Verified seller on MotorMandi</span>
        </div>
      </div>
    </div>
  );
}

export default function BikeListingsModal({ isOpen, onClose }) {
  const { bikes, loading, error, pagination, fetchBikes } = useBikes();
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("all");
  const [page, setPage] = useState(1);
  const [contactBike, setContactBike] = useState(null);
  const [selectedBike, setSelectedBike] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && !hasLoaded) {
      fetchBikes({ page: 1, limit: 10 });
      setHasLoaded(true);
    }
  }, [isOpen, hasLoaded, fetchBikes]);

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

  const filtered = bikes.filter((bike) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (bike.name || "").toLowerCase().includes(q) ||
      (bike.brandName || "").toLowerCase().includes(q) ||
      (bike.model || "").toLowerCase().includes(q) ||
      (bike.vehicleNumber || "").toLowerCase().includes(q) ||
      (bike.user?.shopName || "").toLowerCase().includes(q) ||
      (bike.user?.name || "").toLowerCase().includes(q);

    const matchCondition = condition === "all" || (bike.condition || "").toLowerCase() === condition;
    return matchSearch && matchCondition;
  });

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchBikes({ page: newPage, limit: 10 });
    window.scrollTo(0, 0);
  };

  const handleRefresh = () => {
    fetchBikes({ page, limit: 10 });
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
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-blue-100 px-4 sm:px-6 py-4 rounded-t-3xl">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={LOGO_SRC} alt="MotorMandi" className="h-10 w-auto object-contain" />
                    <div>
                      <h2 className="text-blue-950 font-black text-xl leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>
                        OLD BIKE LISTINGS
                      </h2>
                      {pagination && (
                        <p className="text-blue-500 text-xs">{pagination.totalRecords} bikes found</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRefresh}
                      disabled={loading}
                      className="w-9 h-9 flex items-center justify-center rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all disabled:opacity-40"
                    >
                      <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button
                      onClick={onClose}
                      className="w-9 h-9 flex items-center justify-center rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 flex items-center gap-2 bg-blue-50 rounded-xl px-4 py-2.5">
                    <Search size={16} className="text-blue-400 shrink-0" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search brand, model, number, shop..."
                      className="bg-transparent text-blue-900 placeholder-blue-400 text-sm w-full outline-none"
                    />
                    {search && (
                      <button onClick={() => setSearch("")} className="text-blue-400 hover:text-blue-600">
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2.5">
                    <SlidersHorizontal size={14} className="text-blue-500" />
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      className="bg-transparent text-blue-700 text-sm font-semibold outline-none cursor-pointer"
                    >
                      <option value="all">All Conditions</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="old">Old</option>
                      <option value="used">Used</option>
                    </select>
                  </div>
                </div>

                {(condition !== "all" || search) && (
                  <div className="flex gap-2 flex-wrap mt-3">
                    {search && (
                      <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                        🔍 "{search}"
                        <button onClick={() => setSearch("")}><X size={10} /></button>
                      </span>
                    )}
                    {condition !== "all" && (
                      <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 capitalize">
                        {condition}
                        <button onClick={() => setCondition("all")}><X size={10} /></button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full">
              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
                  {Array.from({ length: 8 }).map((_, index) => <SkeletonCard key={index} />)}
                </div>
              )}

              {!loading && error && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle size={28} className="text-red-400" />
                  </div>
                  <p className="text-blue-950 font-bold text-lg mb-1">Failed to load bikes</p>
                  <p className="text-blue-600/60 text-sm mb-5">{error}</p>
                  <button
                    onClick={handleRefresh}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all hover:scale-105"
                  >
                    <RefreshCw size={16} /> Try Again
                  </button>
                </div>
              )}

              {!loading && !error && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-7xl mb-4">🏍️</div>
                  <p className="text-blue-950 font-bold text-lg mb-1">No bikes found</p>
                  <p className="text-blue-600/60 text-sm mb-5">Try adjusting your search or filters</p>
                  <button
                    onClick={() => { setSearch(""); setCondition("all"); }}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all hover:scale-105"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {!loading && !error && filtered.length > 0 && (
                <>
                  <p className="text-blue-600/50 text-xs font-semibold mb-4">
                    Showing {filtered.length} listing{filtered.length !== 1 ? "s" : ""}
                    {search && ` for "${search}"`}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
                    {filtered.map((bike) => (
                      <BikeCard key={bike.id} bike={bike} onContact={setContactBike} onItemClick={setSelectedBike} />
                    ))}
                  </div>

                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-10">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeft size={18} />
                      </button>

                      {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p)}
                          className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                            p === page
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                              : "border border-blue-200 text-blue-700 hover:bg-blue-50"
                          }`}
                        >
                          {p}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= pagination.totalPages}
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-blue-200 text-blue-700 hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="border-t border-blue-100 px-6 py-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <p className="text-blue-600/50 text-xs">
                  {pagination ? `${pagination.totalRecords} total listings` : "Live data"}
                </p>
                <button
                  onClick={onClose}
                  className="text-sm text-blue-600 hover:text-blue-500 font-semibold flex items-center gap-1 transition-colors"
                >
                  <X size={14} /> Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {contactBike && (
        <ContactPopup bike={contactBike} onClose={() => setContactBike(null)} />
      )}

      <ItemDetailModal
        isOpen={!!selectedBike}
        onClose={() => setSelectedBike(null)}
        item={selectedBike}
      />
    </>
  );
}
