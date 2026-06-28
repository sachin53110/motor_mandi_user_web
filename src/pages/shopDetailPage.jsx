import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, Clock, Mail, MapPin, Navigation, Phone, Star } from "lucide-react";
import ApiProvider from "../api/ApiProvider";

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const hasValidCoords = (lat, lng) => (
  lat !== null &&
  lng !== null &&
  lat >= -90 && lat <= 90 &&
  lng >= -180 && lng <= 180
);

const resolveShopImages = (shop = {}) => {
  const candidates = [
    ...(Array.isArray(shop?.imageUrls) ? shop.imageUrls : []),
    ...(Array.isArray(shop?.images) ? shop.images : []),
    shop?.image,
    shop?.media,
    shop?.imageUrl,
  ];

  return [...new Set(
    candidates
      .map((img) => {
        if (typeof img === "string") return img.trim();
        if (typeof img?.media === "string") return img.media.trim();
        if (typeof img?.url === "string") return img.url.trim();
        return "";
      })
      .filter(Boolean)
  )];
};

const normalizeShop = (shop = {}) => {
  const imageUrls = resolveShopImages(shop);
  const imageUrl = imageUrls[0] || null;

  return {
    ...shop,
    imageUrls,
    imageUrl,
    displayName: shop.displayName || shop.shopName || shop.name || "Shop",
    ownerName: shop.ownerName || shop.name || "Unknown",
    address: shop.address || shop.locationText || "Address not available",
    email: shop.email || "",
    phone: shop.phone || "",
  };
};

const getCurrentPosition = () => new Promise((resolve, reject) => {
  if (!navigator.geolocation) {
    reject(new Error("Geolocation is not supported"));
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
    reject,
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
});

export default function ShopDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [shop, setShop] = useState(() => normalizeShop(location.state?.shop || {}));
  const [loading, setLoading] = useState(!location.state?.shop);
  const [error, setError] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchShop = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await ApiProvider.shops.getDetail(id);
        const payload = response?.data?.result || response?.data || response?.result || response;

        if (!response?.status && response?.status !== undefined) {
          throw new Error(response?.message || "Failed to load shop details");
        }

        if (!cancelled) {
          setShop(normalizeShop(payload));
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || "Failed to load shop details");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (!location.state?.shop) {
      fetchShop();
    } else {
      setLoading(false);
      setError(null);
    }

    return () => {
      cancelled = true;
    };
  }, [id, location.state?.shop]);

  useEffect(() => {
    setImageIndex(0);
  }, [shop?.id, shop?.shopName, shop?.name]);

  const imageUrls = useMemo(() => resolveShopImages(shop), [shop]);
  const currentImage = imageUrls[imageIndex] || shop?.imageUrl || null;

  const lat = toNumber(shop?.lat);
  const lng = toNumber(shop?.lng);
  const hasCoords = hasValidCoords(lat, lng);

  const userLat = toNumber(shop?.userLat);
  const userLng = toNumber(shop?.userLng);

  const directionsUrl = hasCoords
    ? (hasValidCoords(userLat, userLng)
      ? `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${lat},${lng}`
      : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`)
    : null;

  const openDirections = async () => {
    if (!hasCoords) return;

    let origin = null;
    try {
      origin = await getCurrentPosition();
    } catch {
      origin = null;
    }

    const url = origin
      ? `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${lat},${lng}`
      : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const distanceKm = Number.isFinite(shop?.distanceKm)
    ? shop.distanceKm
    : Number.isFinite(shop?.distance)
      ? shop.distance / 1000
      : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-8 text-center shadow-lg">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600" />
          <p className="font-semibold text-slate-700">Loading shop details...</p>
        </div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-lg">
          <AlertCircle size={40} className="mx-auto mb-3 text-red-500" />
          <h1 className="text-xl font-black text-slate-900">Failed to load shop</h1>
          <p className="mt-2 text-sm text-slate-600">{error || "Shop data is not available"}</p>
          <div className="mt-5 flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Go Back
            </button>
            <Link
              to="/shops"
              className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
            >
              All Shops
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <Link
            to="/shops"
            className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
          >
            View All Shops
          </Link>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="lg:col-span-3 border-b border-slate-200 lg:border-b-0 lg:border-r">
              <div className="relative h-80 bg-slate-100 sm:h-[420px]">
                {currentImage ? (
                  <img src={currentImage} alt={shop.displayName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-500">No image available</div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />

                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-700 shadow">
                  {imageUrls.length > 0 ? `${imageIndex + 1} / ${imageUrls.length}` : "Shop Image"}
                </div>

                <span className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold ${shop.shopStatus === "open" ? "bg-emerald-400 text-emerald-950" : "bg-rose-400 text-rose-950"}`}>
                  {shop.shopStatus === "open" ? "Open" : "Closed"}
                </span>
              </div>

              {imageUrls.length > 1 && (
                <div className="border-t border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">Shop Photos</div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {imageUrls.map((url, index) => (
                      <button
                        key={`${url}-${index}`}
                        type="button"
                        onClick={() => setImageIndex(index)}
                        className={`h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${index === imageIndex ? "border-sky-500" : "border-transparent"}`}
                        aria-label={`Show shop photo ${index + 1}`}
                      >
                        <img src={url} alt={`${shop.displayName} photo ${index + 1}`} className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-5 p-5 sm:p-6 lg:col-span-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-sky-700">Shop Details</p>
                <h1 className="mt-1 text-3xl font-black text-slate-900">{shop.displayName}</h1>
                <p className="mt-1 text-sm text-slate-500">Owner: {shop.ownerName}</p>
              </div>

              <div className="space-y-3 text-sm text-slate-700">
                <div className="flex items-start gap-2">
                  <Star size={16} className="mt-0.5 shrink-0 text-amber-500" />
                  <span className="font-semibold">{shop.rating?.toFixed(1) || "N/A"}</span>
                  {shop.reviews ? <span className="text-slate-500">({shop.reviews} reviews)</span> : null}
                </div>

                <div className="flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-sky-700" />
                  <span>{shop.address}</span>
                </div>

                {shop.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="shrink-0 text-sky-700" />
                    <a href={`tel:${shop.phone}`} className="hover:text-sky-700">{shop.phone}</a>
                  </div>
                )}

                {shop.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="shrink-0 text-sky-700" />
                    <span className="break-all">{shop.email}</span>
                  </div>
                )}

                {shop.hours && (
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="shrink-0 text-sky-700" />
                    <span>{shop.hours}</span>
                  </div>
                )}

                {distanceKm !== null && (
                  <div className="text-xs font-semibold text-slate-500">Distance: {distanceKm.toFixed(1)} km</div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${shop.shopStatus === "open" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                  {shop.shopStatus === "open" ? "Open" : "Closed"}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {(shop.status || "inactive").toString()}
                </span>
              </div>

              <div className="flex gap-3 pt-1">
                {shop.phone && (
                  <a
                    href={`tel:${shop.phone}`}
                    className="flex-1 rounded-xl bg-sky-600 px-4 py-3 text-center text-sm font-bold text-white hover:bg-sky-500"
                  >
                    Call
                  </a>
                )}

                {directionsUrl ? (
                  <button
                    type="button"
                    onClick={openDirections}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <span className="inline-flex items-center gap-1"><Navigation size={14} /> Directions</span>
                  </button>
                ) : null}
              </div>

              {shop.description && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  <div className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-500">About</div>
                  <p className="leading-relaxed">{shop.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}