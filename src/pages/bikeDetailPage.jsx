import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Phone,
  Share2,
} from "lucide-react";
import ApiProvider from "../api/ApiProvider";

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatPrice = (price) => {
  const value = toNumber(price);
  if (!value || value <= 0) return "Price on request";
  return `Rs. ${value.toLocaleString("en-IN")}`;
};

const formatCompactPrice = (price) => {
  const value = toNumber(price);
  if (!value || value <= 0) return "Price on request";

  if (value >= 10000000) {
    const crore = (value / 10000000)
      .toFixed(2)
      .replace(/\.00$/, "")
      .replace(/(\.\d)0$/, "$1");
    return `Rs. ${crore} Cr`;
  }

  if (value >= 100000) {
    const lakh = (value / 100000)
      .toFixed(2)
      .replace(/\.00$/, "")
      .replace(/(\.\d)0$/, "$1");
    return `Rs. ${lakh} Lakh`;
  }

  return `Rs. ${value.toLocaleString("en-IN")}`;
};

const formatKm = (km) => {
  const value = toNumber(km);
  if (value === null) return "N/A";
  return `${value.toLocaleString("en-IN")} km`;
};

const formatDate = (date) => {
  if (!date) return "N/A";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "N/A";
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const toTitleCase = (value) => {
  if (!value || typeof value !== "string") return "N/A";
  return value
    .toLowerCase()
    .split(" ")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ");
};

const normalizeImages = (medias = []) =>
  medias
    .map((item) => (typeof item === "string" ? item : item?.media))
    .filter(Boolean);

const tabButtonClass = (isActive) =>
  `-mb-px border-b-2 pb-3 text-[15px] font-semibold transition ${
    isActive
      ? "border-teal-600 text-teal-700"
      : "border-transparent text-gray-500 hover:text-gray-800"
  }`;

export default function BikeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [imageIndex, setImageIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBike = async () => {
      try {
        setLoading(true);
        const data = await ApiProvider.bikes.getDetail(id);

        if (data?.status === false) {
          throw new Error(data.message || "Failed to load bike details");
        }

        const payload = data?.result || data?.data || data?.bike || data;
        if (!payload || typeof payload !== "object") {
          throw new Error("Invalid bike detail response");
        }

        setBike(payload);
        setImageIndex(0);
        setImgError(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load bike details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBike();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center px-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-gray-700 font-semibold">Loading bike details...</p>
        </div>
      </div>
    );
  }

  if (error || !bike) {
    return (
      <div className="min-h-screen bg-[#f5f6f8] flex items-center justify-center px-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm max-w-md w-full">
          <p className="text-gray-700 font-semibold mb-5">{error || "Bike not found"}</p>
          <button
            onClick={() => navigate("/bikes")}
            className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
          >
            Back to Bikes
          </button>
        </div>
      </div>
    );
  }

  const images = normalizeImages(bike.medias);
  const currentImage = images[imageIndex] || "";
  const brand = bike.brandName || bike.brand || "";
  const title =
    bike.name ||
    bike.title ||
    [brand, bike.model].filter(Boolean).join(" ") ||
    "Used Bike";
  const odometer = bike.km ?? bike.kilometer ?? bike.kms;
  const odometerNumber = toNumber(odometer);
  const fuelType = bike.fuelType || bike.fuel || "N/A";
  const engineValue = bike.cc || bike.engineCapacity || bike.engine || "N/A";
  const year = bike.year || bike.manufactureYear || "N/A";
  const listedOn = formatDate(bike.createdAt);
  const location =
    [bike.location, bike.user?.city, bike.user?.state, bike.user?.country]
      .filter(Boolean)
      .join(", ") || "Location not shared";
  const sellerName = bike.user?.name || bike.user?.shopName || "Seller";
  const sellerPhone = bike.user?.phone || bike.phone || "";
  const askingPrice = toNumber(bike.price);
  const referencePrice = toNumber(bike.customerPrice);
  const savings =
    askingPrice && referencePrice && referencePrice > askingPrice
      ? referencePrice - askingPrice
      : null;

  const overviewItems = [
    { label: "Price", value: formatCompactPrice(askingPrice) },
    { label: "Kilometer", value: formatKm(odometer) },
    { label: "Fuel Type", value: fuelType },
    { label: "Engine", value: engineValue === "N/A" ? "N/A" : `${engineValue} cc` },
    { label: "Year", value: year },
    { label: "Owner", value: toTitleCase(bike.owner) },
  ];

  const specRows = [
    { label: "Brand", value: brand || "N/A" },
    { label: "Model", value: bike.model || "N/A" },
    { label: "Type", value: bike.bikeType || bike.type || "N/A" },
    { label: "Condition", value: toTitleCase(bike.condition) },
    { label: "Status", value: toTitleCase(bike.status) },
    { label: "Listed On", value: listedOn },
    { label: "Location", value: location },
  ];

  const sellerRows = [
    { label: "Seller", value: sellerName },
    { label: "Shop", value: bike.user?.shopName || "N/A" },
    { label: "Email", value: bike.user?.email || "N/A" },
    { label: "Address", value: bike.user?.address || "N/A" },
  ];

  const descriptionPoints = (bike.description || "")
    .split(/\n|\./)
    .map((item) => item.trim())
    .filter(Boolean);

  const reasonList = [
    bike.condition ? `${toTitleCase(bike.condition)} condition bike` : null,
    bike.owner ? `${toTitleCase(bike.owner)} owner history` : null,
    odometerNumber !== null ? `${formatKm(odometer)} driven` : null,
    bike.status ? `Current status: ${toTitleCase(bike.status)}` : null,
    ...descriptionPoints,
  ]
    .filter(Boolean)
    .filter((value, index, arr) => arr.indexOf(value) === index)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500">
          <button onClick={() => navigate("/")} className="hover:text-gray-700 transition">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate("/bikes")} className="hover:text-gray-700 transition">
            Used Bikes
          </button>
          <span>/</span>
          <span className="text-gray-700 line-clamp-1">{title}</span>
        </nav>

        <section className="rounded-3xl border border-gray-200 bg-white p-3 sm:p-5">
          <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
            <div>
              <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                <div className="aspect-[16/10] flex items-center justify-center">
                  {currentImage && !imgError ? (
                    <img
                      src={currentImage}
                      alt={title}
                      className="h-full w-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <span className="text-lg font-semibold text-gray-400">No image available</span>
                  )}
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-2 shadow hover:bg-white"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageIndex((prev) => (prev + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/95 p-2 shadow hover:bg-white"
                      aria-label="Next image"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>

              {images.length > 0 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {images.map((image, idx) => (
                    <button
                      key={`${image}-${idx}`}
                      type="button"
                      onClick={() => {
                        setImageIndex(idx);
                        setImgError(false);
                      }}
                      className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border transition ${
                        idx === imageIndex
                          ? "border-teal-600 ring-2 ring-teal-100"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img src={image} alt={`${title} view ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-[#fafafa] p-4 sm:p-5">
              <h1 className="text-2xl font-bold leading-snug text-gray-900">{title}</h1>

              <p className="mt-2 text-sm text-gray-600">
                {[formatKm(odometer), fuelType, location].filter(Boolean).join(" | ")}
              </p>

              <div className="mt-5 flex flex-wrap items-end gap-3">
                <p className="text-4xl font-bold leading-none text-gray-900">{formatCompactPrice(askingPrice)}</p>
                <button type="button" className="pb-1 text-sm font-semibold text-sky-600 hover:text-sky-700">
                  Make Offer
                </button>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                {referencePrice
                  ? `New Bike Price ${formatCompactPrice(referencePrice)}`
                  : "New bike price data unavailable"}
                <button type="button" className="ml-2 font-semibold text-sky-600 hover:text-sky-700">
                  Price Insights
                </button>
              </p>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-600">
                <span>Test Ride Available</span>
                <button type="button" className="font-semibold text-sky-600 hover:text-sky-700">
                  Book Now
                </button>
              </div>

              <a
                href={sellerPhone ? `tel:${sellerPhone}` : undefined}
                className={`mt-4 flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-white transition ${
                  sellerPhone ? "bg-[#ef3b24] hover:bg-[#d93621]" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {sellerPhone ? "Get Seller Details" : "Seller details unavailable"}
              </a>

              <div className="mt-4 rounded-xl border border-gray-200 bg-white p-3.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Seller</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">{sellerName}</p>
                {sellerPhone && (
                  <a href={`tel:${sellerPhone}`} className="mt-1 flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900">
                    <Phone size={14} />
                    {sellerPhone}
                  </a>
                )}
                <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
                  <MapPin size={14} className="shrink-0" />
                  <span className="line-clamp-1">{location}</span>
                </p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:border-gray-400"
                >
                  <Share2 size={15} />
                  Share
                </button>
                <button
                  type="button"
                  onClick={() => setLiked((prev) => !prev)}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:border-gray-400"
                >
                  <Heart size={15} fill={liked ? "#ef4444" : "none"} color={liked ? "#ef4444" : "currentColor"} />
                  {liked ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button type="button" className="text-xs font-semibold text-sky-600 hover:text-sky-700">
              Report Problem
            </button>
          </div>
        </section>

        <section className="mt-5">
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-6">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={tabButtonClass(activeTab === "overview")}
              >
                Bike Overview
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("specs")}
                className={tabButtonClass(activeTab === "specs")}
              >
                Specs & Features
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("price")}
                className={tabButtonClass(activeTab === "price")}
              >
                Price Guide
              </button>
            </div>
          </div>

          {activeTab === "overview" && (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <article className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="text-2xl font-bold text-gray-900">Bike Overview</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {overviewItems.map((item) => (
                    <div key={item.label} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{item.label}</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="text-2xl font-bold text-gray-900">Reasons to Buy</h2>
                <ul className="mt-4 space-y-2.5">
                  {(reasonList.length ? reasonList : ["Fresh listing with complete details"]).map((reason) => (
                    <li key={reason} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-600" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <article className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="text-xl font-bold text-gray-900">Specifications</h2>
                <div className="mt-3 space-y-3">
                  {specRows.map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-3 border-b border-gray-100 pb-2.5 text-sm last:border-b-0 last:pb-0">
                      <span className="text-gray-500">{row.label}</span>
                      <span className="text-right font-semibold text-gray-900">{row.value}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="text-xl font-bold text-gray-900">Seller Details</h2>
                <div className="mt-3 space-y-3">
                  {sellerRows.map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-3 border-b border-gray-100 pb-2.5 text-sm last:border-b-0 last:pb-0">
                      <span className="text-gray-500">{row.label}</span>
                      <span className="text-right font-semibold text-gray-900">{row.value}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          )}

          {activeTab === "price" && (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <article className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="text-xl font-bold text-gray-900">Price Snapshot</h2>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3.5">
                    <p className="text-gray-500">Asking Price</p>
                    <p className="mt-1 text-xl font-bold text-gray-900">{formatPrice(askingPrice)}</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3.5">
                    <p className="text-gray-500">Market Reference</p>
                    <p className="mt-1 text-xl font-bold text-gray-900">
                      {referencePrice ? formatPrice(referencePrice) : "N/A"}
                    </p>
                  </div>
                  {savings && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-emerald-800">
                      Potential upside against market: {formatPrice(savings)}
                    </div>
                  )}
                </div>
              </article>

              <article className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="text-xl font-bold text-gray-900">Buying Tips</h2>
                <ul className="mt-4 space-y-2.5 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-600" />
                    Compare this asking price with same model and year listings nearby.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-600" />
                    Check service records, tyres and chain condition before finalizing.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-600" />
                    Confirm insurance and registration transfer details with the seller.
                  </li>
                </ul>
              </article>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
