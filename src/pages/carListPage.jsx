import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, RefreshCw, AlertCircle, ChevronLeft, ChevronRight,
  Heart, X, Filter, BadgeCheck
} from "lucide-react";
import useCars from "../hooks/useCars";

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

function FilterSidebar({ searchTerm, onSearchChange, condition, onConditionChange, onClearFilters }) {
  const quickFilters = [
    { label: "CarWale abSure", count: 26 },
    { label: "Certified Cars", count: 11 },
    { label: "Quality Report Available", count: 17 },
    { label: "Luxury Cars", count: 152 },
  ];

  const budgetRanges = [
    "Below ₹ 3 Lakh",
    "₹ 3-5 Lakh",
    "₹ 5-8 Lakh",
    "₹ 8-12 Lakh",
    "₹ 12-20 Lakh",
    "₹ 20 Lakh +",
  ];

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
        <div className="bg-gray-50 rounded-xl p-3 space-y-2.5">
          {quickFilters.map((item) => (
            <label key={item.label} className="flex items-center gap-2 text-gray-700 text-xs">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
              <span>{item.label}</span>
              <span className="text-gray-500">({item.count})</span>
            </label>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-gray-900 font-semibold text-base mb-3">Budget (Lakh)</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {budgetRanges.map((range) => (
              <button
                type="button"
                key={range}
                className="px-3 py-1.5 rounded-full border border-gray-400 text-gray-700 text-xs hover:bg-gray-100"
              >
                {range}
              </button>
            ))}
          </div>
          <button type="button" className="text-blue-600 text-sm font-medium">Customize Your Budget</button>
        </div>

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
  const { cars, loading, error, pagination, fetchCars } = useCars();
  const [searchTerm, setSearchTerm] = useState("");
  const [condition, setCondition] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  useEffect(() => {
    const params = {
      page: currentPage,
      limit,
      ...(condition !== "all" && { condition }),
      ...(searchTerm && { search: searchTerm }),
    };
    fetchCars(params);
  }, [currentPage, condition, searchTerm, fetchCars]);

  const totalPages = pagination?.totalPages || 1;

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleConditionChange = (value) => {
    setCondition(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCondition("all");
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    fetchCars({
      page: currentPage,
      limit,
      ...(condition !== "all" && { condition }),
      ...(searchTerm && { search: searchTerm }),
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <section className="mb-5">
          <h1 className="text-2xl font-black text-gray-900">Premium Cars</h1>
          <p className="text-sm text-gray-600 mt-0.5">{pagination?.totalRecords || 0} results</p>

          <div className="mt-3 flex gap-3 items-center">
            <div className="flex-1 flex items-center bg-white border border-gray-400 rounded-xl px-4 py-2.5">
              <Search size={20} className="text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by brand, model, city..."
                className="flex-1 ml-2 bg-transparent text-sm outline-none"
              />
              {searchTerm && (
                <button type="button" onClick={() => handleSearchChange("")} className="text-gray-500 hover:text-gray-700">
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className="w-11 h-11 rounded-xl border border-gray-400 bg-white hover:bg-gray-100 flex items-center justify-center"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>
          </div>

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
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)] gap-5">
          <FilterSidebar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            condition={condition}
            onConditionChange={handleConditionChange}
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
                  {cars.map((car) => (
                    <CarCard key={car.id} car={car} onCardClick={() => navigate(`/car/${car.id}`)} />
                  ))}
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
