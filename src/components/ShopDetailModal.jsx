import { useEffect, useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight, MapPin, Phone, Mail, Navigation } from "lucide-react";

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

const resolveImageUrls = (shop = {}) => {
  if (Array.isArray(shop?.imageUrls) && shop.imageUrls.length) {
    return shop.imageUrls.filter(Boolean);
  }

  const candidates = [
    ...(Array.isArray(shop?.images) ? shop.images : []),
    shop?.image,
    shop?.media,
  ].filter(Boolean);

  return candidates
    .map((img) => {
      if (typeof img === "string") return img.trim();
      if (typeof img?.media === "string") return img.media.trim();
      if (typeof img?.url === "string") return img.url.trim();
      return "";
    })
    .filter(Boolean);
};

export default function ShopDetailModal({ isOpen, onClose, shop, userLocation = null }) {
  const [imageIndex, setImageIndex] = useState(0);

  const imageUrls = useMemo(() => resolveImageUrls(shop), [shop]);

  useEffect(() => {
    setImageIndex(0);
  }, [shop?.id, shop?.shopName, shop?.name]);

  if (!isOpen || !shop) return null;

  const lat = toNumber(shop?.lat);
  const lng = toNumber(shop?.lng);
  const hasCoords = hasValidCoords(lat, lng);

  const userLat = toNumber(userLocation?.lat);
  const userLng = toNumber(userLocation?.lng);
  const hasUserCoords = hasValidCoords(userLat, userLng);

  const directionsUrl = hasCoords
    ? hasUserCoords
      ? `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${lat},${lng}`
      : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    : null;

  const showImage = imageUrls[imageIndex] || null;

  const handlePrev = () => {
    setImageIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  const handleNext = () => {
    setImageIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const displayName = shop?.displayName || shop?.shopName || shop?.name || "Shop";
  const ownerName = shop?.ownerName || shop?.name || "Unknown";
  const address = shop?.locationText || shop?.address || "Address not available";
  const distanceKm = Number.isFinite(shop?.distanceKm)
    ? shop.distanceKm
    : Number.isFinite(shop?.distance)
      ? shop.distance / 1000
      : null;

  return (
    <div className="fixed inset-0 z-[80] bg-slate-950/75 p-3 sm:p-6" role="dialog" aria-modal="true">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-700">Shop Details</p>
            <h2 className="text-xl font-black text-slate-900 sm:text-2xl">{displayName}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
            aria-label="Close shop details"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-5">
          <div className="border-b border-slate-200 p-4 sm:p-6 lg:col-span-3 lg:border-b-0 lg:border-r">
            <div className="relative h-72 overflow-hidden rounded-2xl bg-slate-100 sm:h-[420px]">
              {showImage ? (
                <img src={showImage} alt={displayName} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-500">No image available</div>
              )}

              {imageUrls.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow hover:bg-white"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-slate-700 shadow hover:bg-white"
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <div className="absolute bottom-3 right-3 rounded-full bg-slate-950/75 px-2.5 py-1 text-xs font-semibold text-white">
                    {imageIndex + 1}/{imageUrls.length}
                  </div>
                </>
              )}
            </div>

            {imageUrls.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {imageUrls.map((url, idx) => (
                  <button
                    type="button"
                    key={`${url}-${idx}`}
                    onClick={() => setImageIndex(idx)}
                    className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border ${
                      idx === imageIndex ? "border-sky-500" : "border-slate-200"
                    }`}
                    aria-label={`Show image ${idx + 1}`}
                  >
                    <img src={url} alt={`${displayName} view ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4 p-4 sm:p-6 lg:col-span-2">
            <div>
              <p className="text-sm text-slate-500">Owner</p>
              <p className="text-lg font-bold text-slate-900">{ownerName}</p>
            </div>

            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-sky-700" />
                <span>{address}</span>
              </div>

              {shop?.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={16} className="shrink-0 text-sky-700" />
                  <a href={`tel:${shop.phone}`} className="hover:text-sky-700">{shop.phone}</a>
                </div>
              )}

              {shop?.email && (
                <div className="flex items-center gap-2">
                  <Mail size={16} className="shrink-0 text-sky-700" />
                  <span className="break-all">{shop.email}</span>
                </div>
              )}

              {distanceKm !== null && (
                <p className="text-xs font-semibold text-slate-500">Distance: {distanceKm.toFixed(1)} km</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${shop?.shopStatus === "open" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                {shop?.shopStatus === "open" ? "Open" : "Closed"}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {(shop?.status || "inactive").toString()}
              </span>
            </div>

            <div className="pt-2">
              {directionsUrl ? (
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-sky-500"
                >
                  <Navigation size={15} /> Directions
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-bold text-slate-500"
                >
                  <Navigation size={15} /> Directions Unavailable
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
