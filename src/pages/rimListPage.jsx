import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Heart,
  Star,
  X,
} from "lucide-react";
import useRims from "../hooks/useRims";
import AdSenseSlot from "../components/AdSenseSlot.jsx";

const formatPrice = (price) => {
  const n = parseFloat(price);
  if (Number.isNaN(n)) return "N/A";
  return `₹${n.toLocaleString("en-IN")}`;
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
        <div className="text-sm font-bold text-gray-900">Price range</div>
        <div className="text-xs font-semibold text-gray-600">
          ₹{minVal.toLocaleString("en-IN")} - ₹{maxVal.toLocaleString("en-IN")}
        </div>
      </div>

      <div className="mt-1">
        <div className="relative h-8">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-gray-200" />
          <div
            className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full bg-green-600"
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
    <div className="bg-white border border-green-100 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-green-50" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-green-100 rounded w-1/3" />
        <div className="h-4 bg-green-100 rounded w-3/4" />
        <div className="h-3 bg-green-100 rounded w-1/2" />
      </div>
    </div>
  );
}

const conditionColors = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  old: "bg-amber-50 text-amber-600 border-amber-200",
  used: "bg-amber-50 text-amber-600 border-amber-200",
};

function RimCard({ rim, onCardClick }) {
  const [imgError, setImgError] = useState(false);
  const [liked, setLiked] = useState(false);

  const firstImage = rim.medias?.[0]?.media;
  const conditionKey = rim.condition?.toLowerCase();
  const conditionClass = conditionColors[conditionKey] || conditionColors.old;

  const title = rim.name || rim.code || (rim.size ? `Rim • ${rim.size}` : "Rim Listing");

  const savings = rim.ownerPrice && rim.customerPrice
    ? Math.max(0, parseFloat(rim.customerPrice) - parseFloat(rim.ownerPrice))
    : 0;

  const discountPercent = rim.ownerPrice && rim.customerPrice
    ? Math.round(((parseFloat(rim.customerPrice) - parseFloat(rim.ownerPrice)) / parseFloat(rim.customerPrice)) * 100)
    : 0;

  return (
    <div
      onClick={onCardClick}
      className="bg-white border border-green-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-1"
    >
      <div className="relative h-48 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
        {!imgError && firstImage ? (
          <img
            src={firstImage}
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-green-300 text-3xl">⚙️</div>
        )}

        {discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            -{discountPercent}%
          </div>
        )}

        <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-lg text-xs font-semibold border ${conditionClass}`}>
          {rim.condition || "Used"}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-green-50 transition"
        >
          <Heart size={18} fill={liked ? "#ef4444" : "none"} color={liked ? "#ef4444" : "#666"} />
        </button>
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-bold text-gray-900 text-sm line-clamp-2 hover:text-green-600 transition">
          {title}
        </h3>

        {rim.size || rim.color ? (
          <p className="text-xs text-gray-500">{[rim.size, rim.color].filter(Boolean).join(" • ")}</p>
        ) : null}

        <div className="space-y-1 pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-green-600">{formatPrice(rim.ownerPrice)}</span>
            {rim.customerPrice && parseFloat(rim.customerPrice) > parseFloat(rim.ownerPrice || 0) && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(rim.customerPrice)}</span>
            )}
          </div>
          {savings > 0 && (
            <p className="text-xs text-green-600 font-semibold">Save ₹{savings.toLocaleString("en-IN")}</p>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-600 pt-2">
          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-green-600" />
            {rim.user?.city || "Location"}
          </div>
          {rim.rating && (
            <div className="flex items-center gap-1">
              <Star size={12} fill="#fbbf24" color="#fbbf24" />
              {rim.rating}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RimListPage() {
  const navigate = useNavigate();
  const { rims, loading, error, pagination, fetchRims } = useRims();

  const [searchTerm, setSearchTerm] = useState("");
  const [condition, setCondition] = useState("all");
  const [color, setColor] = useState("");
  const [company, setCompany] = useState("");
  const [brand, setBrand] = useState("");
  const [priceFrom, setPriceFrom] = useState(PRICE_RANGE.min);
  const [priceTo, setPriceTo] = useState(PRICE_RANGE.max);
  const [currentPage, setCurrentPage] = useState(1);

  const limit = 20;
  const inlineListSlot = (import.meta.env.VITE_ADSENSE_INLINE_LIST_SLOT || "6158096309").trim();

  const derivedBrandOptions = useMemo(() => {
    const map = new Map();
    for (const item of rims || []) {
      const id = item.brandData?.id ?? item.brand;
      const name = item.brandData?.name;
      if (id) map.set(String(id), name || `Brand #${id}`);
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [rims]);

  const derivedCompanyOptions = useMemo(() => {
    const map = new Map();
    for (const item of rims || []) {
      const id = item.company;
      if (id) map.set(String(id), `Company #${id}`);
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [rims]);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit,
      ...(company && { company }),
      ...(brand && { brand }),
      ...(condition !== "all" && { condition }),
      ...(color && { color }),
      ...(searchTerm && { search: searchTerm }),
    };

    if (Number.isFinite(Number(priceFrom)) && Number(priceFrom) > PRICE_RANGE.min) {
      params.customerPriceFrom = String(priceFrom);
    }
    if (Number.isFinite(Number(priceTo)) && Number(priceTo) < PRICE_RANGE.max) {
      params.customerPriceTo = String(priceTo);
    }

    fetchRims(params);
  }, [currentPage, company, brand, condition, color, searchTerm, priceFrom, priceTo, fetchRims]);

  const totalPages = pagination?.totalPages || 1;

  const rimCardsWithAds = (rims || []).flatMap((rim, index) => {
    const card = (
      <RimCard
        key={`rim-${rim?.id ?? "item"}-${index}`}
        rim={rim}
        onCardClick={() => navigate(`/rim/${rim.id}`)}
      />
    );

    const shouldInsertAd = inlineListSlot && (index + 1) % 8 === 0 && index < (rims || []).length - 1;
    if (!shouldInsertAd) return [card];

    return [
      card,
      <div
        key={`ad-rim-${index}`}
        className="sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5 overflow-hidden rounded-xl"
      >
        <AdSenseSlot slot={inlineListSlot} />
      </div>,
    ];
  });

  const clearFilters = () => {
    setSearchTerm("");
    setCondition("all");
    setColor("");
    setCompany("");
    setBrand("");
    setPriceFrom(PRICE_RANGE.min);
    setPriceTo(PRICE_RANGE.max);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <section className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Premium Rims</h1>
              <p className="text-sm text-gray-600 mt-0.5">{pagination?.totalRecords || 0} products</p>
            </div>

            <button
              onClick={() => {
                setCurrentPage(1);
                fetchRims({ page: 1, limit });
              }}
              className="w-10 h-10 rounded-xl border border-gray-300 hover:bg-gray-100 flex items-center justify-center transition"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search by size, shop..."
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

            <select
              value={condition}
              onChange={(e) => {
                setCondition(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-green-500"
            >
              <option value="all">All Conditions</option>
              <option value="new">New</option>
              <option value="old">Old</option>
            </select>

            <input
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-green-500"
              placeholder="Color"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:col-span-2">
              <div>
                <input
                  list="rim-company-options"
                  value={company}
                  onChange={(e) => {
                    setCompany(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-green-500"
                  placeholder="Company (ID)"
                />
                <datalist id="rim-company-options">
                  {derivedCompanyOptions.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </datalist>
              </div>

              <div>
                <input
                  list="rim-brand-options"
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-green-500"
                  placeholder="Brand (ID)"
                />
                <datalist id="rim-brand-options">
                  {derivedBrandOptions.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </datalist>
              </div>
            </div>

            <div className="lg:col-span-3">
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
          </div>
        </section>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
            <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-red-900">Error Loading Rims</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={() => fetchRims({ page: currentPage, limit })}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {!loading && (rims || []).length === 0 && !error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚙️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No rims found</h2>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Clear Filters
            </button>
          </div>
        )}

        {!loading && (rims || []).length > 0 && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {rimCardsWithAds}
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
                          ? "bg-green-600 text-white"
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
