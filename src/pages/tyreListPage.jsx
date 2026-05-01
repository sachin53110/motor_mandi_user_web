import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, RefreshCw, AlertCircle, ChevronLeft, ChevronRight,
  Star, Phone, Heart
} from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import useTyres from "../hooks/useTyres";
import useTyreCompanies from "../hooks/useTyreCompanies";
import AdSenseSlot from "../components/AdSenseSlot.jsx";

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

const PRICE_RANGE = {
  min: 0,
  max: 50000,
  step: 100,
};

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

function PriceRangePicker({ isDark, minValue, maxValue, onChangeMin, onChangeMax }) {
  const minVal = clamp(Number(minValue), PRICE_RANGE.min, PRICE_RANGE.max);
  const maxVal = clamp(Number(maxValue), PRICE_RANGE.min, PRICE_RANGE.max);
  const leftPct = ((Math.min(minVal, maxVal) - PRICE_RANGE.min) / (PRICE_RANGE.max - PRICE_RANGE.min)) * 100;
  const rightPct = ((Math.max(minVal, maxVal) - PRICE_RANGE.min) / (PRICE_RANGE.max - PRICE_RANGE.min)) * 100;

  return (
    <div className={`rounded-xl px-3 py-3 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-300"}`}>
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className={`text-sm font-bold ${isDark ? "text-gray-200" : "text-gray-900"}`}>
          Price range
        </div>
        <div className={`text-xs font-semibold ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          ₹{minVal.toLocaleString("en-IN")} - ₹{maxVal.toLocaleString("en-IN")}
        </div>
      </div>

      <div className="mt-1">
        <div className="relative h-8">
          <div className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 rounded-full ${isDark ? "bg-gray-800" : "bg-gray-200"}`} />
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

        <div className={`flex items-center justify-between text-[11px] mt-1 ${isDark ? "text-gray-500" : "text-gray-500"}`}>
          <span>₹{PRICE_RANGE.min.toLocaleString("en-IN")}</span>
          <span>₹{PRICE_RANGE.max.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className={`mt-2 text-[11px] ${isDark ? "text-gray-500" : "text-gray-500"}`}>
        Drag sliders to set price range
      </div>
    </div>
  );
}

// Skeleton Card
function SkeletonCard({ isDark }) {
  return (
    <div className={`${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} border rounded-2xl overflow-hidden animate-pulse shadow-sm`}>
      <div className={isDark ? "h-56 bg-gray-800" : "h-56 bg-gray-100"} />
      <div className="p-5 space-y-4">
        <div className={`h-3 rounded w-1/4 ${isDark ? "bg-gray-800" : "bg-gray-200"}`} />
        <div className={`h-5 rounded w-4/5 ${isDark ? "bg-gray-800" : "bg-gray-200"}`} />
        <div className={`h-4 rounded w-2/3 ${isDark ? "bg-gray-800" : "bg-gray-200"}`} />
        <div className={`h-10 rounded-xl w-full ${isDark ? "bg-gray-800" : "bg-gray-200"}`} />
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
      className={`group ${isDark ? "bg-gray-900 border-gray-800 hover:border-blue-500 hover:shadow-blue-500/20" : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-blue-100"} border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col h-full cursor-pointer`}
    >
      {/* Image */}
      <div className={`relative overflow-hidden flex items-center justify-center h-56 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
        {firstImage && !imgError ? (
          <img
            src={firstImage}
            alt={tyre.name || "Tyre"}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
          className={`absolute top-3 right-3 w-9 h-9 ${isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} rounded-full flex items-center justify-center shadow-md transition-all hover:scale-105`}
        >
          <Heart size={16} fill={liked ? "#ef4444" : "none"} stroke={liked ? "#ef4444" : isDark ? "#9ca3af" : "#999"} />
        </button>

        {tyre.medias?.length > 1 && (
          <div className="absolute bottom-3 left-3 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            +{tyre.medias.length - 1}
          </div>
        )}

        {(tyre.user?.shopName || tyre.user?.name) && (
          <div className="absolute bottom-3 right-3 max-w-[70%] bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-full truncate">
            {tyre.user.shopName || tyre.user.name}
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-5 flex flex-col flex-1 ${isDark ? "bg-gray-900" : "bg-white"}`}>
        {tyre.brandName && (
          <div className={`text-xs font-bold mb-1 uppercase tracking-wide ${isDark ? "text-blue-400" : "text-blue-600"}`}>
            {tyre.brandName}
          </div>
        )}

        <h3 className={`font-black text-lg leading-tight mb-2 line-clamp-2 group-hover:text-blue-500 ${isDark ? "text-white" : "text-gray-900"}`}>
          {tyre.name || "Premium Tyre"}
          {tyre.size && (
            <span className={`block text-sm font-semibold mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{tyre.size}</span>
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
          <p className={`${isDark ? "text-gray-400" : "text-gray-600"} text-sm mb-3`}>Fits: <span className="font-semibold">{tyre.carCompany}</span></p>
        )}

        {/* Price */}
        <div className={`mb-3 pt-3 border-t ${isDark ? "border-gray-800" : "border-gray-100"}`}>
          <div className="flex items-baseline gap-1.5">
            <span className={`${isDark ? "text-white" : "text-gray-900"} text-2xl font-black`}>{formatPrice(tyre.price)}</span>
            {tyre.customerPrice && (
              <span className={`${isDark ? "text-gray-500" : "text-gray-500"} text-sm line-through`}>{formatPrice(tyre.customerPrice)}</span>
            )}
          </div>
        </div>

        {savings > 0 && (
          <div className={`text-xs font-bold px-2 py-1 rounded mb-2 ${isDark ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-700"}`}>
            ✓ Save {formatPrice(savings)}
          </div>
        )}

        {/* Stock */}
        <div className={`text-sm font-bold mb-4 ${isDark ? "text-green-400" : "text-green-700"}`}>
          {tyre.quantity && tyre.quantity > 5 ? "✓ In Stock" : "Only few left"}
        </div>

        {/* Contact button */}
        <button
          onClick={(e) => e.stopPropagation()}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3.5 rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-2 text-base"
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
  const { companies, loading: companiesLoading, fetchCompanies } = useTyreCompanies();

  const defaultFilters = {
    search: "",
    condition: "all",
    company: "",
    type: "",
    customerPriceFrom: PRICE_RANGE.min,
    customerPriceTo: PRICE_RANGE.max,
  };

  const [draftFilters, setDraftFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const inlineListSlot = (
    import.meta.env.VITE_ADSENSE_INLINE_LIST_SLOT || "5182233001"
  ).trim();

  const buildApiParams = useCallback((filters) => {
    const params = {};
    const searchTerm = (filters.search || "").trim();
    const company = String(filters.company || "").trim();
    const type = (filters.type || "").trim();
    const customerPriceFromNum = Number(filters.customerPriceFrom);
    const customerPriceToNum = Number(filters.customerPriceTo);

    if (searchTerm) params.search = searchTerm;
    if (filters.condition && filters.condition !== "all") params.condition = filters.condition;
    if (company) params.company = company;
    if (type) params.type = type;
    if (Number.isFinite(customerPriceFromNum) && customerPriceFromNum > PRICE_RANGE.min) {
      params.customerPriceFrom = String(customerPriceFromNum);
    }
    if (Number.isFinite(customerPriceToNum) && customerPriceToNum < PRICE_RANGE.max) {
      params.customerPriceTo = String(customerPriceToNum);
    }
    return params;
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    fetchTyres({ page, limit: 20, ...buildApiParams(appliedFilters) });
  }, [page, appliedFilters, fetchTyres, buildApiParams]);

  const handleApplyFilters = () => {
    setPage(1);
    setAppliedFilters(draftFilters);
    window.scrollTo(0, 0);
  };

  const handleClearFilters = () => {
    setDraftFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setPage(1);
    window.scrollTo(0, 0);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const tyreCardsWithAds = tyres.flatMap((tyre, index) => {
    const card = (
      <TyreCard
        key={`tyre-${tyre?.id ?? "item"}-${index}`}
        tyre={tyre}
        onCardClick={() => navigate(`/tyre/${tyre.id}`)}
        isDark={isDark}
      />
    );

    const shouldInsertAd =
      inlineListSlot && (index + 1) % 8 === 0 && index < tyres.length - 1;

    if (!shouldInsertAd) {
      return [card];
    }

    return [
      card,
      <div
        key={`ad-tyre-${index}`}
        className="col-span-full overflow-hidden rounded-xl"
      >
        <AdSenseSlot slot={inlineListSlot} />
      </div>,
    ];
  });

  return (
    <div className={isDark ? "min-h-screen bg-gray-950" : "min-h-screen bg-gray-50"}>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)] gap-5">
          {/* Left Filters (desktop) */}
          <aside className={`hidden xl:block ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} border rounded-xl p-4 h-fit sticky top-6`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`font-black text-lg ${isDark ? "text-white" : "text-gray-900"}`}>Filters</div>
              <button
                type="button"
                onClick={handleClearFilters}
                className={`text-sm font-bold ${isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}
              >
                Clear All
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className={`text-sm font-bold mb-2 ${isDark ? "text-gray-200" : "text-gray-900"}`}>Search</div>
                <div className={`flex items-center gap-2 rounded-xl px-3 py-2.5 border ${isDark ? "bg-gray-950 border-gray-800" : "bg-white border-gray-300"}`}>
                  <Search size={16} className={isDark ? "text-gray-500" : "text-gray-400"} />
                  <input
                    type="text"
                    value={draftFilters.search}
                    onChange={(e) => setDraftFilters((prev) => ({ ...prev, search: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter") handleApplyFilters(); }}
                    placeholder="Search tyre..."
                    className={`bg-transparent text-sm w-full outline-none placeholder-gray-500 ${isDark ? "text-white" : "text-gray-900"}`}
                  />
                </div>
              </div>

              <div>
                <div className={`text-sm font-bold mb-2 ${isDark ? "text-gray-200" : "text-gray-900"}`}>Company</div>
                <select
                  value={draftFilters.company}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, company: e.target.value }))}
                  className={`w-full rounded-xl px-3 py-2.5 text-sm border outline-none ${isDark ? "bg-gray-950 border-gray-800 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                  disabled={companiesLoading}
                >
                  <option value="">All Companies</option>
                  {companies.map((c) => (
                    <option key={c.id} value={String(c.id)}>
                      {c.name}{c.country ? ` (${c.country})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className={`text-sm font-bold mb-2 ${isDark ? "text-gray-200" : "text-gray-900"}`}>Type</div>
                <select
                  value={draftFilters.type}
                  onChange={(e) => setDraftFilters((prev) => ({ ...prev, type: e.target.value }))}
                  className={`w-full rounded-xl px-3 py-2.5 text-sm border outline-none ${isDark ? "bg-gray-950 border-gray-800 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                >
                  <option value="">All Types</option>
                  <option value="tubeless">Tubeless</option>
                  <option value="tube">Tube</option>
                </select>
              </div>

              <div>
                <div className={`text-sm font-bold mb-2 ${isDark ? "text-gray-200" : "text-gray-900"}`}>Condition</div>
                <div className={`flex flex-wrap gap-2 rounded-xl px-2.5 py-2 border ${isDark ? "bg-gray-950 border-gray-800" : "bg-white border-gray-300"}`}>
                  {[{ value: "all", label: "All" }, { value: "new", label: "New" }, { value: "old", label: "Used" }].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setDraftFilters((prev) => ({ ...prev, condition: item.value }))}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                        draftFilters.condition === item.value
                          ? "bg-blue-600 text-white border-blue-600"
                          : (isDark ? "border-gray-700 text-gray-300 hover:bg-gray-900" : "border-gray-300 text-gray-700 hover:bg-gray-50")
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <PriceRangePicker
                isDark={isDark}
                minValue={draftFilters.customerPriceFrom}
                maxValue={draftFilters.customerPriceTo}
                onChangeMin={(nextMin) => {
                  setDraftFilters((prev) => {
                    const currentMax = Number(prev.customerPriceTo);
                    return {
                      ...prev,
                      customerPriceFrom: Math.min(nextMin, currentMax),
                      customerPriceTo: Math.max(nextMin, currentMax),
                    };
                  });
                }}
                onChangeMax={(nextMax) => {
                  setDraftFilters((prev) => {
                    const currentMin = Number(prev.customerPriceFrom);
                    return {
                      ...prev,
                      customerPriceFrom: Math.min(currentMin, nextMax),
                      customerPriceTo: Math.max(currentMin, nextMax),
                    };
                  });
                }}
              />

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold border ${isDark ? "bg-gray-950 border-gray-800 text-gray-200 hover:bg-gray-900" : "bg-white border-gray-300 text-gray-800 hover:bg-gray-50"}`}
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleApplyFilters}
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60"
                >
                  Apply
                </button>
              </div>
            </div>
          </aside>

          {/* Right list */}
          <section>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h1 className={`text-2xl font-black ${isDark ? "text-white" : "text-gray-900"}`}>Premium Tyres</h1>
                <p className={`text-sm mt-0.5 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{pagination?.totalRecords || 0} products</p>
              </div>

              <button
                onClick={() => fetchTyres({ page, limit: 20, ...buildApiParams(appliedFilters) })}
                disabled={loading}
                className={`w-10 h-10 flex items-center justify-center rounded-lg border ${isDark ? "bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-800" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"} transition-colors`}
                title="Refresh"
              >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              </button>
            </div>

            {/* Mobile filters (top) */}
            <div className={`xl:hidden ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} border rounded-xl p-4 mb-6`}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-6">
                  <div className={`flex items-center gap-2 rounded-xl px-3 py-2.5 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-300"}`}>
                    <Search size={16} className={isDark ? "text-gray-500" : "text-gray-400"} />
                    <input
                      type="text"
                      value={draftFilters.search}
                      onChange={(e) => setDraftFilters((prev) => ({ ...prev, search: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === "Enter") handleApplyFilters(); }}
                      placeholder="Search tyre (brand, size, shop...)"
                      className={`bg-transparent text-sm w-full outline-none placeholder-gray-500 ${isDark ? "text-white" : "text-gray-900"}`}
                    />
                  </div>
                </div>

                <div className="md:col-span-3">
                  <select
                    value={draftFilters.company}
                    onChange={(e) => setDraftFilters((prev) => ({ ...prev, company: e.target.value }))}
                    className={`w-full rounded-xl px-3 py-2.5 text-sm border outline-none ${isDark ? "bg-gray-900 border-gray-800 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                    disabled={companiesLoading}
                  >
                    <option value="">All Companies</option>
                    {companies.map((c) => (
                      <option key={c.id} value={String(c.id)}>
                        {c.name}{c.country ? ` (${c.country})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-3">
                  <select
                    value={draftFilters.type}
                    onChange={(e) => setDraftFilters((prev) => ({ ...prev, type: e.target.value }))}
                    className={`w-full rounded-xl px-3 py-2.5 text-sm border outline-none ${isDark ? "bg-gray-900 border-gray-800 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                  >
                    <option value="">All Types</option>
                    <option value="tubeless">Tubeless</option>
                    <option value="tube">Tube</option>
                  </select>
                </div>

                <div className="md:col-span-4">
                  <div className={`h-full flex items-center gap-2 rounded-xl px-2.5 py-2 border ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-300"}`}>
                    {[{ value: "all", label: "All" }, { value: "new", label: "New" }, { value: "old", label: "Used" }].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setDraftFilters((prev) => ({ ...prev, condition: item.value }))}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                          draftFilters.condition === item.value
                            ? "bg-blue-600 text-white border-blue-600"
                            : (isDark ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-300 text-gray-700 hover:bg-gray-50")
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-8">
                  <PriceRangePicker
                    isDark={isDark}
                    minValue={draftFilters.customerPriceFrom}
                    maxValue={draftFilters.customerPriceTo}
                    onChangeMin={(nextMin) => {
                      setDraftFilters((prev) => {
                        const currentMax = Number(prev.customerPriceTo);
                        return {
                          ...prev,
                          customerPriceFrom: Math.min(nextMin, currentMax),
                          customerPriceTo: Math.max(nextMin, currentMax),
                        };
                      });
                    }}
                    onChangeMax={(nextMax) => {
                      setDraftFilters((prev) => {
                        const currentMin = Number(prev.customerPriceFrom);
                        return {
                          ...prev,
                          customerPriceFrom: Math.min(currentMin, nextMax),
                          customerPriceTo: Math.max(currentMin, nextMax),
                        };
                      });
                    }}
                  />
                </div>

                <div className="md:col-span-12 flex flex-col sm:flex-row gap-2 sm:justify-end">
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold border ${isDark ? "bg-gray-900 border-gray-800 text-gray-200 hover:bg-gray-800" : "bg-white border-gray-300 text-gray-800 hover:bg-gray-50"}`}
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyFilters}
                    disabled={loading}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

        {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} isDark={isDark} />)}
          </div>
        )}

        {!loading && error && (
          <div className={`flex flex-col items-center justify-center py-20 text-center ${isDark ? "bg-gray-800 rounded-2xl" : "bg-gray-100 rounded-2xl"}`}>
            <AlertCircle size={40} className="text-red-400 mb-4" />
            <p className={`font-bold text-lg mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>Failed to load tyres</p>
            <p className={`text-sm mb-5 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{error}</p>
            <button
              onClick={() => {
                setPage(1);
                fetchTyres({ page: 1, limit: 20, ...buildApiParams(appliedFilters) });
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && tyres.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🛞</div>
            <p className="text-gray-900 font-bold text-lg mb-2">No tyres found</p>
            <p className="text-gray-600 text-sm">Try adjusting your search or filters</p>
          </div>
        )}

        {!loading && !error && tyres.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 mb-8">
              {tyreCardsWithAds}
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
          </section>
        </div>
      </main>
    </div>
  );
}
