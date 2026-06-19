import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search, RefreshCw, AlertCircle, ChevronLeft, ChevronRight,
  Star, Phone, MapPin, Heart, Filter, X
} from "lucide-react";
import useAccessories from "../hooks/useAccessories";
import useAccessoryCategories from "../hooks/useAccessoryCategories";
import useAccessoryBrandsByCategory from "../hooks/useAccessoryBrandsByCategory";
import AdSenseSlot from "../components/AdSenseSlot.jsx";

const formatPrice = (price) => {
  const n = parseFloat(price);
  if (isNaN(n)) return "N/A";
  return `₹${n.toLocaleString("en-IN")}`;
};

const toFiniteNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const PRICE_RANGE = {
  min: 0,
  max: 1000000,
  step: 500,
};

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

function PriceRangePicker({ minValue, maxValue, onChangeMin, onChangeMax }) {
  const minVal = clamp(Number(minValue), PRICE_RANGE.min, PRICE_RANGE.max);
  const maxVal = clamp(Number(maxValue), PRICE_RANGE.min, PRICE_RANGE.max);
  const leftPct =
    ((Math.min(minVal, maxVal) - PRICE_RANGE.min) / (PRICE_RANGE.max - PRICE_RANGE.min)) * 100;
  const rightPct =
    ((Math.max(minVal, maxVal) - PRICE_RANGE.min) / (PRICE_RANGE.max - PRICE_RANGE.min)) * 100;

  return (
    <div className="rounded-xl px-3 py-3 border bg-white border-gray-300">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="text-sm font-bold text-gray-900">Customer price range</div>
        <div className="text-xs font-semibold text-gray-600">
          ₹{minVal.toLocaleString("en-IN")} - ₹{maxVal.toLocaleString("en-IN")}
        </div>
      </div>

      <div className="mt-1">
        <div className="relative h-8">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-gray-200" />
          <div
            className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full bg-blue-600"
            style={{ left: `${leftPct}%`, width: `${Math.max(0, rightPct - leftPct)}%` }}
          />

          <input
            type="range"
            min={PRICE_RANGE.min}
            max={PRICE_RANGE.max}
            step={PRICE_RANGE.step}
            value={minVal}
            onChange={(e) => onChangeMin(Number(e.target.value))}
            className="absolute inset-0 w-full bg-transparent"
            style={{ WebkitAppearance: "none", appearance: "none" }}
          />

          <input
            type="range"
            min={PRICE_RANGE.min}
            max={PRICE_RANGE.max}
            step={PRICE_RANGE.step}
            value={maxVal}
            onChange={(e) => onChangeMax(Number(e.target.value))}
            className="absolute inset-0 w-full bg-transparent"
            style={{ WebkitAppearance: "none", appearance: "none" }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] mt-1 text-gray-500">
          <span>₹{PRICE_RANGE.min.toLocaleString("en-IN")}</span>
          <span>₹{PRICE_RANGE.max.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="mt-2 text-[11px] text-gray-500">Drag sliders to set price range</div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-blue-50" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-blue-100 rounded w-1/3" />
        <div className="h-4 bg-blue-100 rounded w-3/4" />
        <div className="h-3 bg-blue-100 rounded w-1/2" />
      </div>
    </div>
  );
}

function AccessoryCard({ accessory, onCardClick }) {
  const [imgError, setImgError] = useState(false);
  const [liked, setLiked] = useState(false);
  const firstImage = accessory.medias?.[0]?.media;

  const displayPrice =
    toFiniteNumber(accessory.customerPrice) ??
    toFiniteNumber(accessory.price) ??
    toFiniteNumber(accessory.ownerPrice);

  const compareAt = (() => {
    const candidates = [
      toFiniteNumber(accessory.ownerPrice),
      toFiniteNumber(accessory.price),
      toFiniteNumber(accessory.customerPrice),
    ].filter((n) => n !== null);
    if (!candidates.length || displayPrice === null) return null;
    const maxVal = Math.max(...candidates);
    return maxVal > displayPrice ? maxVal : null;
  })();

  const savings = compareAt !== null && displayPrice !== null ? Math.max(0, compareAt - displayPrice) : 0;
  const discountPercent = compareAt !== null && displayPrice !== null && compareAt > 0
    ? Math.round((savings / compareAt) * 100)
    : 0;

  return (
    <div
      onClick={onCardClick}
      className="bg-white border border-blue-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
        {!imgError && firstImage ? (
          <img
            src={firstImage}
            alt={accessory.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-blue-300 text-3xl">
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
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-blue-50 transition"
        >
          <Heart size={18} fill={liked ? "#ef4444" : "none"} color={liked ? "#ef4444" : "#666"} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Title */}
        <h3 className="font-bold text-gray-900 text-sm line-clamp-2 hover:text-blue-600 transition">
          {accessory.title}
        </h3>

        {/* Brand */}
        {accessory.brand && (
          <p className="text-xs text-gray-500">{accessory.brand}</p>
        )}

        {/* Price Section */}
        <div className="space-y-1 pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-blue-600">{formatPrice(displayPrice)}</span>
            {compareAt !== null ? (
              <span className="text-xs text-gray-400 line-through">{formatPrice(compareAt)}</span>
            ) : null}
          </div>
          {savings > 0 && (
            <p className="text-xs text-blue-600 font-semibold">Save ₹{savings.toLocaleString("en-IN")}</p>
          )}
        </div>

        {/* Location & Rating */}
        <div className="flex items-center justify-between text-xs text-gray-600 pt-2">
          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-blue-600" />
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
  const [searchParams] = useSearchParams();
  const { accessories, loading, error, pagination, fetchAccessories } = useAccessories();
  const { categories, loading: categoriesLoading, error: categoriesError } = useAccessoryCategories();
  const {
    brands,
    loading: brandsLoading,
    error: brandsError,
    fetchBrands,
    reset: resetBrands,
  } = useAccessoryBrandsByCategory();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [priceFrom, setPriceFrom] = useState(PRICE_RANGE.min);
  const [priceTo, setPriceTo] = useState(PRICE_RANGE.max);
  const searchFromUrl = (searchParams.get("search") || "").trim();
  const limit = 20;
  const inlineListSlot = (
    import.meta.env.VITE_ADSENSE_INLINE_LIST_SLOT || "5182233001"
  ).trim();

  useEffect(() => {
    setSearchTerm((prev) => (prev === searchFromUrl ? prev : searchFromUrl));
    setCurrentPage((prev) => (prev === 1 ? prev : 1));
  }, [searchFromUrl]);

  useEffect(() => {
    if (!categoryId) {
      resetBrands();
      return;
    }
    fetchBrands(categoryId);
  }, [categoryId, fetchBrands, resetBrands]);

  const categoryOptions = useMemo(() => {
    return (categories || [])
      .map((c) => ({ id: String(c.id), name: c.name }))
      .filter((c) => c.id && c.name)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  const brandOptions = useMemo(() => {
    return (brands || [])
      .map((b) => ({ id: String(b.id), name: b.name }))
      .filter((b) => b.id && b.name)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [brands]);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit,
      ...(searchTerm && { search: searchTerm }),
    };

    if (categoryId) params.categoryId = categoryId;
    if (brandId) params.brandId = brandId;
    if (Number.isFinite(Number(priceFrom)) && Number(priceFrom) > PRICE_RANGE.min) {
      params.customerPriceFrom = String(priceFrom);
    }
    if (Number.isFinite(Number(priceTo)) && Number(priceTo) < PRICE_RANGE.max) {
      params.customerPriceTo = String(priceTo);
    }

    fetchAccessories(params);
  }, [currentPage, searchTerm, categoryId, brandId, priceFrom, priceTo, fetchAccessories]);

  const filteredAccessories = accessories;
  const totalPages = pagination?.totalPages || 1;
  const accessoryCardsWithAds = filteredAccessories.flatMap((accessory, index) => {
    const card = (
      <AccessoryCard
        key={`accessory-${accessory?.id ?? "item"}-${index}`}
        accessory={accessory}
        onCardClick={() => navigate(`/accessory/${accessory.id}`)}
      />
    );

    const shouldInsertAd =
      inlineListSlot && (index + 1) % 8 === 0 && index < filteredAccessories.length - 1;

    if (!shouldInsertAd) {
      return [card];
    }

    return [
      card,
      <div
        key={`ad-accessory-${index}`}
        className="sm:col-span-2 lg:col-span-3 overflow-hidden rounded-xl"
      >
        <AdSenseSlot slot={inlineListSlot} />
      </div>,
    ];
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <section className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <h1 className="text-2xl font-black text-gray-900">Premium Accessories</h1>
          <p className="text-sm text-gray-600 mt-0.5">{pagination?.totalRecords || 0} products</p>

          <div className="mt-3 flex gap-3 items-center flex-wrap">
            <div className="flex-1 min-w-[200px] flex items-center bg-gray-100 rounded-xl px-4 py-2">
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
                fetchAccessories({
                  page: 1,
                  limit,
                  ...(searchTerm && { search: searchTerm }),
                  ...(categoryId && { categoryId }),
                  ...(brandId && { brandId }),
                  ...(Number.isFinite(Number(priceFrom)) && Number(priceFrom) > PRICE_RANGE.min
                    ? { customerPriceFrom: String(priceFrom) }
                    : {}),
                  ...(Number.isFinite(Number(priceTo)) && Number(priceTo) < PRICE_RANGE.max
                    ? { customerPriceTo: String(priceTo) }
                    : {}),
                });
              }}
              className="w-10 h-10 rounded-xl border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Filters */}
          <aside className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2">
                  <Filter size={16} className="text-gray-700" />
                  <h2 className="text-sm font-black text-gray-900">Filters</h2>
                </div>

                {(categoryId || brandId || priceFrom !== PRICE_RANGE.min || priceTo !== PRICE_RANGE.max) && (
                  <button
                    onClick={() => {
                      setCategoryId("");
                      setBrandId("");
                      setPriceFrom(PRICE_RANGE.min);
                      setPriceTo(PRICE_RANGE.max);
                      setCurrentPage(1);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900"
                    title="Clear filters"
                  >
                    <X size={14} />
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => {
                    const next = e.target.value;
                    setCategoryId(next);
                    setBrandId("");
                    setCurrentPage(1);
                  }}
                  disabled={categoriesLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">All Categories</option>
                  {categoryOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {categoriesError && <div className="text-xs text-red-600">{categoriesError}</div>}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Brand</label>
                <select
                  value={brandId}
                  onChange={(e) => {
                    setBrandId(e.target.value);
                    setCurrentPage(1);
                  }}
                  disabled={!categoryId || brandsLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">All Brands</option>
                  {brandOptions.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
                {brandsError && <div className="text-xs text-red-600">{brandsError}</div>}
              </div>

              <PriceRangePicker
                minValue={priceFrom}
                maxValue={priceTo}
                onChangeMin={(nextMin) => {
                  setPriceFrom(Math.min(nextMin, priceTo));
                  setCurrentPage(1);
                }}
                onChangeMax={(nextMax) => {
                  setPriceTo(Math.max(nextMax, priceFrom));
                  setCurrentPage(1);
                }}
              />
            </div>
          </aside>

          {/* Results */}
          <section className="lg:col-span-9">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <p className="text-gray-600 mb-6">Try adjusting your filters</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setCurrentPage(1);
                setCategoryId("");
                setBrandId("");
                setPriceFrom(PRICE_RANGE.min);
                setPriceTo(PRICE_RANGE.max);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Accessories Grid */}
        {!loading && filteredAccessories.length > 0 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {accessoryCardsWithAds}
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
                          ? "bg-blue-600 text-white"
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
          </section>
        </div>
      </main>
    </div>
  );
}
