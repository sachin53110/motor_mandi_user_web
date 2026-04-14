import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, RefreshCw, AlertCircle, ChevronLeft, ChevronRight,
  Star, Phone, MapPin, Heart
} from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import useTyres from "../hooks/useTyres";

const formatPrice = (price) => {
  const n = parseFloat(price);
  if (isNaN(n)) return "N/A";
  return `₹${n.toLocaleString("en-IN")}`;
};

const getConditionColors = (isDark) => ({
  new: isDark ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-green-100 text-green-700 border-green-300",
  old: isDark ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-amber-100 text-amber-700 border-amber-300",
  used: isDark ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-amber-100 text-amber-700 border-amber-300",
});

// Skeleton Card
function SkeletonCard({ isDark }) {
  return (
    <div className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border rounded-2xl overflow-hidden animate-pulse`}>
      <div className={isDark ? "h-48 bg-gray-700" : "h-48 bg-gray-100"} />
      <div className="p-4 space-y-3">
        <div className={`h-3 rounded w-1/3 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
        <div className={`h-4 rounded w-3/4 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
        <div className={`h-3 rounded w-1/2 ${isDark ? "bg-gray-700" : "bg-gray-200"}`} />
      </div>
    </div>
  );
}

// Tyre Card
function TyreCard({ tyre, onCardClick, isDark }) {
  const [imgError, setImgError] = useState(false);
  const [liked, setLiked] = useState(false);
  const firstImage = tyre.medias?.[0]?.media;
  const conditionKey = tyre.condition?.toLowerCase();
  const conditionClass = getConditionColors(isDark)[conditionKey] || getConditionColors(isDark).old;

  const savings = tyre.price && tyre.customerPrice
    ? Math.max(0, parseFloat(tyre.customerPrice) - parseFloat(tyre.price))
    : 0;

  const discountPercent = tyre.price && tyre.customerPrice
    ? Math.round(((parseFloat(tyre.customerPrice) - parseFloat(tyre.price)) / parseFloat(tyre.customerPrice)) * 100)
    : 0;

  return (
    <div
      onClick={onCardClick}
      className={`group ${isDark ? "bg-gray-900 border-gray-700 hover:border-blue-500 hover:shadow-blue-500/20" : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-blue-100"} border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col h-full cursor-pointer`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden flex items-center justify-center aspect-square ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
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

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discountPercent > 0 && (
            <div className="bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded">
              {discountPercent}% OFF
            </div>
          )}
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded border capitalize ${isDark ? "bg-gray-900" : "bg-white"} ${conditionClass}`}>
            {tyre.condition || "—"}
          </span>
        </div>

        {/* Like button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className={`absolute top-2 right-2 w-8 h-8 ${isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110`}
        >
          <Heart size={16} fill={liked ? "#ef4444" : "none"} stroke={liked ? "#ef4444" : isDark ? "#9ca3af" : "#999"} />
        </button>

        {tyre.medias?.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            +{tyre.medias.length - 1}
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-3.5 flex flex-col flex-1 ${isDark ? "bg-gray-800" : "bg-white"}`}>
        {tyre.brandName && (
          <div className={`text-xs font-bold mb-1 uppercase tracking-wide ${isDark ? "text-blue-400" : "text-blue-600"}`}>
            {tyre.brandName}
          </div>
        )}

        <h3 className={`font-semibold text-sm leading-tight mb-2 line-clamp-2 group-hover:text-blue-500 ${isDark ? "text-gray-300" : "text-gray-800"}`}>
          {tyre.name || "Premium Tyre"}
          {tyre.size && (
            <span className={`block text-xs font-normal mt-0.5 ${isDark ? "text-gray-500" : "text-gray-600"}`}>{tyre.size}</span>
          )}
        </h3>

        {/* Rating */}
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

        {/* Price */}
        <div className="mb-2 pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-gray-900">{formatPrice(tyre.price)}</span>
            {tyre.customerPrice && (
              <span className="text-xs text-gray-500 line-through">{formatPrice(tyre.customerPrice)}</span>
            )}
          </div>
        </div>

        {savings > 0 && (
          <div className={`text-xs font-bold px-2 py-1 rounded mb-2 ${isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"}`}>
            ✓ Save {formatPrice(savings)}
          </div>
        )}

        {/* Seller */}
        {tyre.user && (
          <div className={`text-xs mb-3 pb-2 border-b ${isDark ? "border-gray-700 text-gray-400" : "border-gray-200 text-gray-600"}`}>
            <MapPin size={10} className="inline mr-1" />
            <span className="font-medium truncate">{tyre.user.shopName || tyre.user.name}</span>
          </div>
        )}

        {/* Stock */}
        <div className={`text-xs font-semibold mb-3 ${isDark ? "text-green-400" : "text-green-700"}`}>
          {tyre.quantity && tyre.quantity > 5 ? "✓ In Stock" : "Only few left"}
        </div>

        {/* Contact button */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-1.5 text-sm"
        >
          <Phone size={14} /> View Details
        </button>
      </div>
    </div>
  );
}

export default function TyreListPage() {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { tyres, loading, error, pagination, fetchTyres } = useTyres();
  const [search, setSearch] = useState("");
  const [condition, setCondition] = useState("all");
  const [page, setPage] = useState(1);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!hasLoaded) {
      fetchTyres({ page: 1, limit: 20 });
      setHasLoaded(true);
    }
  }, [hasLoaded, fetchTyres]);

  const filtered = tyres.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      (t.name || "").toLowerCase().includes(q) ||
      (t.brandName || "").toLowerCase().includes(q) ||
      (t.size || "").toLowerCase().includes(q) ||
      (t.user?.shopName || "").toLowerCase().includes(q);

    const matchCondition = condition === "all" || (t.condition || "").toLowerCase() === condition;
    return matchSearch && matchCondition;
  });

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchTyres({ page: newPage, limit: 20 });
    window.scrollTo(0, 0);
  };

  return (
    <div className={isDark ? "min-h-screen bg-gray-950" : "min-h-screen bg-gray-50"}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <section className={`${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} border rounded-xl p-4 mb-6`}>
          <h1 className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"}`}>Premium Tyres</h1>
          <p className={`text-sm mt-0.5 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{pagination?.totalRecords || 0} products</p>

          <div className="mt-3 flex gap-3 items-center">
            <div className={`flex-1 flex items-center gap-2 rounded-lg px-3 py-2 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
              <Search size={16} className={isDark ? "text-gray-500" : "text-gray-400"} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search brand, model, size..."
                className={`bg-transparent text-sm w-full outline-none placeholder-gray-500 ${isDark ? "text-white" : "text-gray-900"}`}
              />
            </div>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className={`px-3 py-2 border rounded-lg text-sm ${isDark ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"}`}
            >
              <option value="all">All Conditions</option>
              <option value="new">New</option>
              <option value="old">Used</option>
            </select>
            <button
              onClick={() => fetchTyres({ page: 1, limit: 20 })}
              disabled={loading}
              className={`w-10 h-10 flex items-center justify-center rounded-lg border ${isDark ? "bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"} transition-colors`}
              title="Refresh"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </section>
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} isDark={isDark} />)}
          </div>
        )}

        {!loading && error && (
          <div className={`flex flex-col items-center justify-center py-20 text-center ${isDark ? "bg-gray-800 rounded-2xl" : "bg-gray-100 rounded-2xl"}`}>
            <AlertCircle size={40} className="text-red-400 mb-4" />
            <p className={`font-bold text-lg mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Failed to load tyres</p>
            <p className={`text-sm mb-5 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{error}</p>
            <button
              onClick={() => fetchTyres({ page: 1, limit: 20 })}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🛞</div>
            <p className="text-gray-900 font-bold text-lg mb-2">No tyres found</p>
            <p className="text-gray-600 text-sm">Try adjusting your search or filters</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
              {filtered.map((tyre) => (
                <TyreCard
                  key={tyre.id}
                  tyre={tyre}
                  onCardClick={() => navigate(`/tyre/${tyre.id}`)}
                  isDark={isDark}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${isDark ? "border-gray-700 text-gray-400 hover:bg-gray-800 disabled:opacity-30" : "border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-30"}`}
                >
                  <ChevronLeft size={18} />
                </button>

                {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-10 h-10 rounded-lg font-semibold text-sm transition-colors ${
                      p === page
                        ? "bg-blue-600 text-white"
                        : isDark ? "border border-gray-700 text-gray-400 hover:bg-gray-800" : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= pagination.totalPages}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${isDark ? "border-gray-700 text-gray-400 hover:bg-gray-800 disabled:opacity-30" : "border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-30"}`}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
