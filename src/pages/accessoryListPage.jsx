import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, RefreshCw, AlertCircle, ChevronLeft, ChevronRight,
  Star, Phone, MapPin, Heart, Filter, X
} from "lucide-react";
import useAccessories from "../hooks/useAccessories";
import LOGO_SRC from "../assets/motorMandiLogo.png";

const formatPrice = (price) => {
  const n = parseFloat(price);
  if (isNaN(n)) return "N/A";
  return `₹${n.toLocaleString("en-IN")}`;
};

function SkeletonCard() {
  return (
    <div className="bg-white border border-emerald-100 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-emerald-50" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-emerald-100 rounded w-1/3" />
        <div className="h-4 bg-emerald-100 rounded w-3/4" />
        <div className="h-3 bg-emerald-100 rounded w-1/2" />
      </div>
    </div>
  );
}

function AccessoryCard({ accessory, onCardClick }) {
  const [imgError, setImgError] = useState(false);
  const [liked, setLiked] = useState(false);
  const firstImage = accessory.medias?.[0]?.media;

  const savings = accessory.price && accessory.customerPrice
    ? Math.max(0, parseFloat(accessory.customerPrice) - parseFloat(accessory.price))
    : 0;

  const discountPercent = accessory.price && accessory.customerPrice
    ? Math.round(((parseFloat(accessory.customerPrice) - parseFloat(accessory.price)) / parseFloat(accessory.customerPrice)) * 100)
    : 0;

  return (
    <div
      onClick={onCardClick}
      className="bg-white border border-emerald-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative h-48 bg-gradient-to-br from-emerald-50 to-emerald-100 overflow-hidden">
        {!imgError && firstImage ? (
          <img
            src={firstImage}
            alt={accessory.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-emerald-300 text-3xl">
            🔧
          </div>
        )}

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            -{discountPercent}%
          </div>
        )}

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-emerald-50 transition"
        >
          <Heart size={18} fill={liked ? "#ef4444" : "none"} color={liked ? "#ef4444" : "#666"} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Title */}
        <h3 className="font-bold text-gray-900 text-sm line-clamp-2 hover:text-emerald-600 transition">
          {accessory.title}
        </h3>

        {/* Brand */}
        {accessory.brand && (
          <p className="text-xs text-gray-500">{accessory.brand}</p>
        )}

        {/* Price Section */}
        <div className="space-y-1 pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-emerald-600">{formatPrice(accessory.price)}</span>
            {accessory.customerPrice && parseFloat(accessory.customerPrice) > parseFloat(accessory.price) && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(accessory.customerPrice)}</span>
            )}
          </div>
          {savings > 0 && (
            <p className="text-xs text-emerald-600 font-semibold">Save ₹{savings.toLocaleString("en-IN")}</p>
          )}
        </div>

        {/* Location & Rating */}
        <div className="flex items-center justify-between text-xs text-gray-600 pt-2">
          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-emerald-600" />
            {accessory.user?.city || "Location"}
          </div>
          {accessory.rating && (
            <div className="flex items-center gap-1">
              <Star size={12} fill="#fbbf24" color="#fbbf24" />
              {accessory.rating}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AccessoryListPage() {
  const navigate = useNavigate();
  const { accessories, loading, error, pagination, fetchAccessories } = useAccessories();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    const params = {
      page: currentPage,
      limit,
      ...(searchTerm && { search: searchTerm }),
    };
    fetchAccessories(params);
  }, [currentPage, searchTerm, fetchAccessories]);

  const filteredAccessories = accessories;
  const totalPages = pagination?.totalPages || 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <img src={LOGO_SRC} alt="MotorMandi" className="h-12 w-auto object-contain" />
              <div>
                <h1 className="text-xl font-black text-gray-900">Premium Accessories</h1>
                <p className="text-sm text-gray-500">{pagination?.totalRecords || 0} products</p>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="pb-4 flex gap-3 items-center flex-wrap">
            <div className="flex-1 min-w-[200px] flex items-center bg-gray-100 rounded-full px-4 py-2">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search by brand, name, shop..."
                className="flex-1 bg-transparent ml-2 outline-none text-sm"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setCurrentPage(1);
                fetchAccessories({ page: 1, limit });
              }}
              className="w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
            <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900">Error Loading Accessories</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={() => fetchAccessories({ page: currentPage, limit })}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredAccessories.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔧</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No accessories found</h2>
            <p className="text-gray-600 mb-6">Try adjusting your search terms</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
              }}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Accessories Grid */}
        {!loading && filteredAccessories.length > 0 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredAccessories.map((accessory) => (
                <AccessoryCard
                  key={accessory.id}
                  accessory={accessory}
                  onCardClick={() => navigate(`/accessory/${accessory.id}`)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 py-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  <ChevronLeft size={18} />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition ${
                        currentPage === pageNum
                          ? "bg-emerald-600 text-white"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
