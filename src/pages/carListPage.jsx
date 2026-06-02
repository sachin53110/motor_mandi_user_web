import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search, AlertCircle, ChevronLeft, ChevronRight,
  Heart, Filter, BadgeCheck
} from "lucide-react";
import useCars from "../hooks/useCars";
import useCarCompanies from "../hooks/useCarCompanies";
import useCarModelsByCompany from "../hooks/useCarModelsByCompany";
import AdSenseSlot from "../components/AdSenseSlot.jsx";
import { VEHICLE_COLOR_OPTIONS } from "../utils/vehicleOptions";

const formatPrice = (price) => {
  const n = parseFloat(price);
  if (isNaN(n)) return "N/A";
  return `₹${n.toLocaleString("en-IN")}`;
};

const formatPriceCompact = (price) => {
  const n = Number(price);
  if (!Number.isFinite(n)) return "Price on request";
  if (n >= 100000) return `Rs. ${(n / 100000).toFixed(2).replace(/\.00$/, "")} Lakh`;
  return `₹${n.toLocaleString("en-IN")}`;
};

const formatEmi = (price) => {
  const n = Number(price);
  if (!Number.isFinite(n)) return "N/A";
  const emi = Math.round(n * 0.018);
  return `Rs.${emi.toLocaleString("en-IN")}`;
};

const PRICE_RANGE = {
  min: 0,
  max: 10000000,
  step: 10000,
};

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

function PriceRangePicker({ minValue, maxValue, onChangeMin, onChangeMax }) {
  const minVal = clamp(Number(minValue), PRICE_RANGE.min, PRICE_RANGE.max);
  const maxVal = clamp(Number(maxValue), PRICE_RANGE.min, PRICE_RANGE.max);
  const leftPct = ((Math.min(minVal, maxVal) - PRICE_RANGE.min) / (PRICE_RANGE.max - PRICE_RANGE.min)) * 100;
  const rightPct = ((Math.max(minVal, maxVal) - PRICE_RANGE.min) / (PRICE_RANGE.max - PRICE_RANGE.min)) * 100;

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
            className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full bg-red-500"
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
    <div className="bg-white border border-gray-300 rounded-xl overflow-hidden animate-pulse shadow-sm">
      <div className="h-44 bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-9 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

function FilterSidebar({
  searchTerm,
  onSearchChange,
  condition,
  onConditionChange,
  company,
  onCompanyChange,
  companies,
  companiesLoading,
  companiesError,
  brand,
  onBrandChange,
  models,
  modelsLoading,
  modelsError,
  fuelType,
  onFuelTypeChange,
  transmission,
  onTransmissionChange,
  color,
  onColorChange,
  priceFrom,
  onPriceFromChange,
  priceTo,
  onPriceToChange,
  onClearFilters,
}) {
  return (
    <aside className="hidden xl:block bg-white border border-gray-300 rounded-xl p-3.5 h-fit sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
          <Filter size={18} />
          Filters
        </div>
        <button
          type="button"
          onClick={onClearFilters}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-4">
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-gray-900 font-semibold text-base mb-3">Condition</h3>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: "all", label: "All" },
              { value: "new", label: "New" },
              { value: "used", label: "Used" },
            ].map((item) => (
              <button
                type="button"
                key={item.value}
                onClick={() => onConditionChange(item.value)}
                className={`px-3 py-1.5 rounded-full text-xs border ${
                  condition === item.value
                    ? "bg-red-500 text-white border-red-500"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-gray-900 font-semibold text-base mb-3">Make / Model</h3>
          <div className="flex items-center gap-2 border border-gray-400 rounded-xl px-3 py-2">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Make / Model"
              className="w-full outline-none text-sm text-gray-700"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div>
            <h3 className="text-gray-900 font-semibold text-base mb-2">Company</h3>
            <select
              value={company}
              onChange={(e) => onCompanyChange(e.target.value)}
              className="w-full border border-gray-400 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white outline-none disabled:bg-gray-100"
              disabled={companiesLoading}
            >
              <option value="">All Companies</option>
              {(companies || []).map((c) => (
                <option key={String(c.id)} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>
            {companiesError ? (
              <div className="text-xs text-red-600 mt-1">{companiesError}</div>
            ) : null}
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold text-base mb-2">Model</h3>
            <select
              value={brand}
              onChange={(e) => onBrandChange(e.target.value)}
              className="w-full border border-gray-400 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white outline-none disabled:bg-gray-100"
              disabled={!company || modelsLoading}
            >
              <option value="">All Models</option>
              {(models || []).map((m) => (
                <option key={String(m.id)} value={String(m.id)}>
                  {m.name}
                </option>
              ))}
            </select>
            {modelsError ? (
              <div className="text-xs text-red-600 mt-1">{modelsError}</div>
            ) : null}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-3">
          <div>
            <h3 className="text-gray-900 font-semibold text-base mb-2">Fuel Type</h3>
            <select
              value={fuelType}
              onChange={(e) => onFuelTypeChange(e.target.value)}
              className="w-full border border-gray-400 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white outline-none"
            >
              <option value="">All Fuel Types</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="cng">CNG</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold text-base mb-2">Transmission</h3>
            <select
              value={transmission}
              onChange={(e) => onTransmissionChange(e.target.value)}
              className="w-full border border-gray-400 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white outline-none"
            >
              <option value="">All Transmissions</option>
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
            </select>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold text-base mb-2">Color</h3>
            <select
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-full border border-gray-400 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white outline-none"
            >
              <option value="">All Colors</option>
              {VEHICLE_COLOR_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <PriceRangePicker
            minValue={priceFrom}
            maxValue={priceTo}
            onChangeMin={onPriceFromChange}
            onChangeMax={onPriceToChange}
          />
        </div>
      </div>
    </aside>
  );
}

function CarCard({ car, onCardClick }) {
  const [imgError, setImgError] = useState(false);
  const [liked, setLiked] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const images = Array.isArray(car.medias) ? car.medias : [];
  const currentImage = images[imageIndex]?.media;
  const title = car.name || car.title || [car.brandName, car.model].filter(Boolean).join(" ") || "Car Listing";
  const km = Number.parseInt(car.km, 10);
  const kmText = Number.isFinite(km) ? `${km.toLocaleString("en-IN")} km` : "N/A km";
  const fuelText = car.fuelType || "Petrol";
  const locationText = [car.user?.city, car.user?.state].filter(Boolean).join(", ") || car.user?.shopName || "Location unavailable";
  const conditionText = car.condition || "Good";
  const tagText = conditionText.toLowerCase() === "excellent" ? "Great Price" : "Home Test Drive";

  return (
    <article
      onClick={onCardClick}
      className="bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        {!imgError && currentImage ? (
          <img
            src={currentImage}
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-5xl">
            🚗
          </div>
        )}

        <span className="absolute left-3 bottom-3 inline-flex items-center gap-1.5 bg-teal-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
          <BadgeCheck size={16} /> Certified
        </span>

        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setImageIndex((prev) => (prev + 1) % images.length);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/25 text-white rounded-full flex items-center justify-center hover:bg-black/40"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      <div className="p-3.5">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-1">
            {title}
          </h3>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            className="text-gray-700 hover:text-red-500 transition-colors"
            aria-label="Add to favourites"
          >
            <Heart size={22} fill={liked ? "#ef4444" : "none"} color={liked ? "#ef4444" : "currentColor"} />
          </button>
        </div>

        <p className="text-xs text-gray-600 line-clamp-1">{kmText} | {fuelText} | {locationText}</p>

        <div className="flex items-end justify-between mt-2.5">
          <div className="text-2xl leading-none font-black text-gray-800">{formatPriceCompact(car.price)}</div>
          <div className="text-gray-600 text-xs">
            EMI at <span className="font-bold text-gray-800">{formatEmi(car.price)}</span>
          </div>
        </div>

        <div className="mt-1.5 flex items-center justify-between">
          <button type="button" className="text-blue-700 text-xs font-medium">Make Offer</button>
          <span className="bg-gray-100 text-gray-700 text-[11px] px-2.5 py-0.5 rounded-md">{tagText}</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCardClick();
          }}
          className="mt-2.5 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg text-base"
        >
          Get Seller Details
        </button>

        {car.customerPrice && parseFloat(car.customerPrice) > parseFloat(car.price) && (
          <div className="mt-2 text-[11px] text-gray-500">
            MRP <span className="line-through">{formatPrice(car.customerPrice)}</span>
          </div>
        )}
      </div>

      <div className="border-t border-dashed border-gray-300 px-3.5 py-2 flex items-center gap-2 text-xs text-gray-700">
        <BadgeCheck size={14} className="text-gray-500" />
        <span>{conditionText} Condition</span>
      </div>
    </article>
  );
}

export default function CarListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cars, loading, error, pagination, fetchCars } = useCars();
  const { companies, loading: companiesLoading, error: companiesError } = useCarCompanies();
  const { models, loading: modelsLoading, error: modelsError, fetchModels, reset: resetModels } = useCarModelsByCompany();
  const [searchTerm, setSearchTerm] = useState("");
  const [condition, setCondition] = useState("all");
  const [company, setCompany] = useState("");
  const [brand, setBrand] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [transmission, setTransmission] = useState("");
  const [color, setColor] = useState("");
  const [priceFrom, setPriceFrom] = useState(PRICE_RANGE.min);
  const [priceTo, setPriceTo] = useState(PRICE_RANGE.max);
  const [currentPage, setCurrentPage] = useState(1);
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
    if (!company) {
      resetModels();
      return;
    }
    fetchModels(company);
  }, [company, fetchModels, resetModels]);

  useEffect(() => {
    const params = {
      page: currentPage,
      limit,
      ...(condition !== "all" && { condition: condition === "used" ? "old" : condition }),
      ...(searchTerm && { search: searchTerm }),
      ...(company && { company }),
      ...(brand && { brand }),
      ...(fuelType && { fuelType: fuelType.trim() }),
      ...(transmission && { transmission: transmission.trim() }),
      ...(color && { color: color.trim() }),
    };

    if (Number.isFinite(Number(priceFrom)) && Number(priceFrom) > PRICE_RANGE.min) {
      params.priceFrom = String(priceFrom);
    }
    if (Number.isFinite(Number(priceTo)) && Number(priceTo) < PRICE_RANGE.max) {
      params.priceTo = String(priceTo);
    }

    fetchCars(params);
  }, [
    currentPage,
    condition,
    searchTerm,
    company,
    brand,
    fuelType,
    transmission,
    color,
    priceFrom,
    priceTo,
    fetchCars,
  ]);

  const totalPages = pagination?.totalPages || 1;

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleConditionChange = (value) => {
    setCondition(value);
    setCurrentPage(1);
  };

  const handleCompanyChange = (value) => {
    setCompany(value);
    setBrand("");
    setCurrentPage(1);
  };

  const handleBrandChange = (value) => {
    setBrand(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCondition("all");
    setCompany("");
    setBrand("");
    setFuelType("");
    setTransmission("");
    setColor("");
    setPriceFrom(PRICE_RANGE.min);
    setPriceTo(PRICE_RANGE.max);
    setCurrentPage(1);
  };

  const carCardsWithAds = cars.flatMap((car, index) => {
    const card = (
      <CarCard
        key={`car-${car?.id ?? "item"}-${index}`}
        car={car}
        onCardClick={() => navigate(`/car/${car.id}`)}
      />
    );

    const shouldInsertAd =
      inlineListSlot && (index + 1) % 8 === 0 && index < cars.length - 1;

    if (!shouldInsertAd) {
      return [card];
    }

    return [
      card,
      <div key={`ad-car-${index}`} className="md:col-span-2 xl:col-span-3 overflow-hidden rounded-xl">
        <AdSenseSlot slot={inlineListSlot} />
      </div>,
    ];
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <section className="mb-5">
          <h1 className="text-2xl font-black text-gray-900">Premium Cars</h1>
          <p className="text-sm text-gray-600 mt-0.5">{pagination?.totalRecords || 0} results</p>

          <div className="xl:hidden mt-3 flex flex-wrap gap-2">
            {[
              { value: "all", label: "All" },
              { value: "new", label: "New" },
              { value: "used", label: "Used" },
            ].map((item) => (
              <button
                type="button"
                key={item.value}
                onClick={() => handleConditionChange(item.value)}
                className={`px-3 py-1.5 rounded-full text-xs border ${
                  condition === item.value
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="xl:hidden mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select
              value={company}
              onChange={(e) => handleCompanyChange(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm"
              disabled={companiesLoading}
            >
              <option value="">All Companies</option>
              {(companies || []).map((c) => (
                <option key={String(c.id)} value={String(c.id)}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              value={brand}
              onChange={(e) => handleBrandChange(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm disabled:bg-gray-100"
              disabled={!company || modelsLoading}
            >
              <option value="">All Models</option>
              {(models || []).map((m) => (
                <option key={String(m.id)} value={String(m.id)}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)] gap-5">
          <FilterSidebar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            condition={condition}
            onConditionChange={handleConditionChange}
            company={company}
            onCompanyChange={handleCompanyChange}
            companies={companies}
            companiesLoading={companiesLoading}
            companiesError={companiesError}
            brand={brand}
            onBrandChange={handleBrandChange}
            models={models}
            modelsLoading={modelsLoading}
            modelsError={modelsError}
            fuelType={fuelType}
            onFuelTypeChange={(v) => {
              setFuelType(v);
              setCurrentPage(1);
            }}
            transmission={transmission}
            onTransmissionChange={(v) => {
              setTransmission(v);
              setCurrentPage(1);
            }}
            color={color}
            onColorChange={(v) => {
              setColor(v);
              setCurrentPage(1);
            }}
            priceFrom={priceFrom}
            onPriceFromChange={(nextMin) => {
              setPriceFrom(Math.min(nextMin, priceTo));
              setCurrentPage(1);
            }}
            priceTo={priceTo}
            onPriceToChange={(nextMax) => {
              setPriceTo(Math.max(nextMax, priceFrom));
              setCurrentPage(1);
            }}
            onClearFilters={handleClearFilters}
          />

          <section>
            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-3">
                <AlertCircle size={22} className="text-red-600 mt-0.5" />
                <div>
                  <h3 className="text-red-900 font-bold text-xl">Error Loading Cars</h3>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            {!loading && !error && cars.length === 0 && (
              <div className="bg-white border border-gray-300 rounded-2xl p-10 text-center">
                <div className="text-6xl mb-3">🚗</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No cars found</h2>
                <p className="text-sm text-gray-600">Try adjusting your filters.</p>
              </div>
            )}

            {!loading && !error && cars.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {carCardsWithAds}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-8">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40"
                    >
                      <ChevronLeft size={18} className="mx-auto" />
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          type="button"
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg text-xs font-semibold ${
                            currentPage === pageNum
                              ? "bg-red-600 text-white"
                              : "border border-gray-300 bg-white hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40"
                    >
                      <ChevronRight size={18} className="mx-auto" />
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
