import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Heart,
  Filter,
  X,
} from "lucide-react";

import useParts from "../hooks/useParts";
import AdSenseSlot from "../components/AdSenseSlot.jsx";
import PartDetailModal from "../components/PartDetailModal.jsx";

const formatPrice = (price) => {
  const n = parseFloat(price);
  if (Number.isNaN(n)) return "N/A";
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

function PartCard({ part, onCardClick }) {
  const [imgError, setImgError] = useState(false);
  const [liked, setLiked] = useState(false);
  const firstImage = part.medias?.[0]?.media;

  const displayPrice =
    toFiniteNumber(part.ownerPrice) ??
    toFiniteNumber(part.price) ??
    toFiniteNumber(part.customerPrice);

  const compareAt = (() => {
    const candidates = [
      toFiniteNumber(part.customerPrice),
      toFiniteNumber(part.price),
      toFiniteNumber(part.ownerPrice),
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
      <div className="relative h-48 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
        {!imgError && firstImage ? (
          <img
            src={firstImage}
            alt={part.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-blue-300 text-4xl">
            {part.type === "bike" ? "🏍️" : part.type === "car" ? "🚗" : "🔧"}
          </div>
        )}

        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            -{discountPercent}%
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-blue-50 transition"
        >
          <Heart
            size={18}
            fill={liked ? "#ef4444" : "none"}
            color={liked ? "#ef4444" : "#666"}
          />
        </button>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-bold text-gray-900 text-sm line-clamp-2 hover:text-blue-600 transition">
          {part.title}
        </h3>

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

        <div className="flex items-center justify-between text-xs text-gray-600 pt-2">
          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-blue-600" />
            {part.user?.city || "Location"}
          </div>
          <div className="text-[11px] font-semibold text-gray-500 capitalize">
            {part.type || "part"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PartListPage() {
  const { parts, loading, error, pagination, fetchParts } = useParts();
  const [searchParams] = useSearchParams();

  const typeParam = (searchParams.get("type") || "car").toLowerCase();
  const type = typeParam === "bike" ? "bike" : "car";
  const shopId = (searchParams.get("shopId") || "").trim();

  const title = type === "bike" ? "Bike Parts" : "Car Parts";

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceFrom, setPriceFrom] = useState(PRICE_RANGE.min);
  const [priceTo, setPriceTo] = useState(PRICE_RANGE.max);

  const [selectedPart, setSelectedPart] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const limit = 10;

  const inlineListSlot = (
    import.meta.env.VITE_ADSENSE_INLINE_LIST_SLOT || "5182233001"
  ).trim();

  useEffect(() => {
    setCurrentPage(1);
    setSelectedPart(null);
    setDetailOpen(false);
  }, [type, shopId]);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit,
      type,
      ...(shopId && { shopId }),
      ...(searchTerm && { search: searchTerm }),
    };

    if (Number.isFinite(Number(priceFrom)) && Number(priceFrom) > PRICE_RANGE.min) {
      params.customerPriceFrom = String(priceFrom);
    }
    if (Number.isFinite(Number(priceTo)) && Number(priceTo) < PRICE_RANGE.max) {
      params.customerPriceTo = String(priceTo);
    }

    fetchParts(params);
  }, [currentPage, searchTerm, priceFrom, priceTo, type, shopId, fetchParts]);

  const totalPages = pagination?.totalPages || 1;

  const partCardsWithAds = useMemo(() => {
    return (parts || []).flatMap((part, index) => {
      const card = (
        <PartCard
          key={`part-${part?.id ?? "item"}-${index}`}
          part={part}
          onCardClick={() => {
            setSelectedPart(part);
            setDetailOpen(true);
          }}
        />
      );

      const shouldInsertAd =
        inlineListSlot && (index + 1) % 8 === 0 && index < (parts || []).length - 1;

      if (!shouldInsertAd) return [card];

      return [
        card,
        <div
          key={`ad-part-${index}`}
          className="sm:col-span-2 lg:col-span-3 overflow-hidden rounded-xl"
        >
          <AdSenseSlot slot={inlineListSlot} />
        </div>,
      ];
    });
  }, [parts, inlineListSlot]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <section className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <h1 className="text-2xl font-black text-gray-900">{title}</h1>
          <p className="text-sm text-gray-600 mt-0.5">{pagination?.totalRecords || 0} products</p>

          <div className="mt-3 flex gap-3 items-center flex-wrap">
            <div className="flex-1 min-w-[200px] flex items-center bg-gray-100 rounded-xl px-4 py-2">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search parts by title, shop..."
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
                fetchParts({
                  page: 1,
                  limit,
                  type,
                  ...(shopId && { shopId }),
                  ...(searchTerm && { search: searchTerm }),
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
          <aside className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2">
                  <Filter size={16} className="text-gray-700" />
                  <h2 className="text-sm font-black text-gray-900">Filters</h2>
                </div>

                {(priceFrom !== PRICE_RANGE.min || priceTo !== PRICE_RANGE.max) && (
                  <button
                    onClick={() => {
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

              {shopId ? (
                <div className="rounded-xl px-3 py-3 border bg-white border-gray-300">
                  <div className="text-xs font-bold text-gray-700">Shop</div>
                  <div className="text-sm font-semibold text-gray-900 mt-0.5">Shop ID: {shopId}</div>
                  <div className="text-[11px] text-gray-500 mt-1">(Filtered from URL)</div>
                </div>
              ) : null}

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

          <section className="lg:col-span-9">
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
                <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-bold text-red-900">Error Loading Parts</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                  <button
                    onClick={() => fetchParts({ page: currentPage, limit, type, ...(shopId && { shopId }) })}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {!loading && (parts || []).length === 0 && !error && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">{type === "bike" ? "🏍️" : "🚗"}</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No parts found</h2>
                <p className="text-gray-600 mb-6">Try adjusting your filters</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setCurrentPage(1);
                    setPriceFrom(PRICE_RANGE.min);
                    setPriceTo(PRICE_RANGE.max);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {!loading && (parts || []).length > 0 && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {partCardsWithAds}
                </div>

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

      <PartDetailModal
        isOpen={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedPart(null);
        }}
        item={selectedPart}
      />
    </div>
  );
}
