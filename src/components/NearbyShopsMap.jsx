import { GoogleMap, LoadScript, OverlayView } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, MapPin, Star, Clock, Navigation, X, Mail } from "lucide-react";

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const getValidCoords = (point) => {
  const lat = toNumber(point?.lat);
  const lng = toNumber(point?.lng);

  if (lat === null || lng === null) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  return { lat, lng };
};

const getShopTitle = (shop) => {
  const title = shop?.displayName || shop?.shopName || shop?.name;
  return typeof title === "string" && title.trim() ? title.trim() : "Shop";
};

const getShopAddress = (shop) => {
  const address = shop?.address || shop?.locationText;
  return typeof address === "string" && address.trim() ? address.trim() : "Address not available";
};

const resolveShopImage = (shop) => {
  if (typeof shop?.imageUrl === "string" && shop.imageUrl.trim()) return shop.imageUrl.trim();

  const candidates = [
    ...(Array.isArray(shop?.imageUrls) ? shop.imageUrls : []),
    ...(Array.isArray(shop?.images) ? shop.images : []),
    shop?.image,
    shop?.media,
  ];

  return candidates
    .map((img) => {
      if (typeof img === "string") return img.trim();
      if (typeof img?.media === "string") return img.media.trim();
      if (typeof img?.url === "string") return img.url.trim();
      return "";
    })
    .filter(Boolean)[0] || null;
};

const resolveShopImages = (shop) => {
  const candidates = [
    ...(Array.isArray(shop?.imageUrls) ? shop.imageUrls : []),
    ...(Array.isArray(shop?.images) ? shop.images : []),
    shop?.image,
    shop?.media,
    shop?.imageUrl,
  ];

  const imageUrls = candidates
    .map((img) => {
      if (typeof img === "string") return img.trim();
      if (typeof img?.media === "string") return img.media.trim();
      if (typeof img?.url === "string") return img.url.trim();
      return "";
    })
    .filter(Boolean);

  return [...new Set(imageUrls)];
};

const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      reject,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  });

const NearbyShopsMap = ({
  shops = [],
  userLocation = null,
  onShopClick = null,
  focusedShop = null,
  height = 500,
  borderRadius = "12px",
}) => {
  const navigate = useNavigate();
  const [selectedShop, setSelectedShop] = useState(null);
  const [mapError, setMapError] = useState(null);
  const GOOGLE_MAP_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const userCoords = getValidCoords(userLocation);

  useEffect(() => {
    if (focusedShop) setSelectedShop(focusedShop);
  }, [focusedShop]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const previousAuthFailure = window.gm_authFailure;
    window.gm_authFailure = () => {
      setMapError(
        "Google Maps authentication failed. This usually means the API key is restricted to different domains, billing is not enabled, or the Maps JavaScript API is not enabled."
      );
    };

    return () => {
      window.gm_authFailure = previousAuthFailure;
    };
  }, []);

  const shopMarkers = shops.reduce((acc, shop, index) => {
    const coords = getValidCoords(shop);
    if (!coords) return acc;

    const identity = shop?.id ?? shop?.shopName ?? shop?.name ?? "shop";
    const key = `${identity}-${coords.lat}-${coords.lng}-${index}`;
    acc.push({ shop, coords, key });
    return acc;
  }, []);

  const selectedShopCoords = getValidCoords(selectedShop);
  const selectedIdentity = selectedShop?.id ?? selectedShop?.shopName ?? selectedShop?.name ?? null;
  const selectedImage = resolveShopImage(selectedShop);
  const selectedImages = resolveShopImages(selectedShop);

  const focusedCoords = getValidCoords(focusedShop);

  const resolvedHeight = typeof height === "number" ? `${height}px` : height;

  const mapContainerStyle = {
    width: "100%",
    height: resolvedHeight,
    borderRadius,
  };

  const defaultCenter = focusedCoords || userCoords || shopMarkers[0]?.coords || { lat: 30.6928, lng: 76.7079 };

  const mapOptions = {
    zoom: 14,
    styles: [
      {
        featureType: "all",
        elementType: "labels.text.fill",
        stylers: [{ color: "#333333" }],
      },
      {
        featureType: "water",
        elementType: "geometry.fill",
        stylers: [{ color: "#d3d3d3" }],
      },
    ],
  };

  const selectedDistanceKm = Number.isFinite(selectedShop?.distanceKm)
    ? selectedShop.distanceKm
    : Number.isFinite(selectedShop?.distance)
      ? selectedShop.distance / 1000
      : null;

  const openDirections = async (shopCoords) => {
    if (!shopCoords) return;

    let origin = userCoords;
    try {
      origin = await getCurrentPosition();
    } catch {
      origin = userCoords;
    }

    const url = origin
      ? `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${shopCoords.lat},${shopCoords.lng}`
      : `https://www.google.com/maps/dir/?api=1&destination=${shopCoords.lat},${shopCoords.lng}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (!GOOGLE_MAP_KEY) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
        Google Map is not configured. Set <span className="font-mono">VITE_GOOGLE_MAPS_API_KEY</span> in your
        <span className="font-mono"> .env.local</span> (and in Vercel Environment Variables for production).
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
        <div className="font-semibold text-gray-900">Google Map failed to load</div>
        <div className="mt-1">{mapError}</div>
        <div className="mt-2">
          If you are on localhost, allow these HTTP referrers for your key: <span className="font-mono">http://localhost/*</span>
          , <span className="font-mono">http://127.0.0.1/*</span>. Also ensure billing is enabled and <span className="font-mono">Maps JavaScript API</span>
          is enabled in Google Cloud.
        </div>
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAP_KEY}
      onError={() =>
        setMapError(
          "Google Maps script failed to load. This can be caused by API key restrictions, billing/API not enabled, or blocked third-party scripts (ad blocker / network policy)."
        )
      }
      loadingElement={
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">Loading map…</div>
      }
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={14}
        options={mapOptions}
      >
        {userCoords && (
          <OverlayView position={userCoords} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
            <div className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-sky-600 shadow-lg shadow-sky-500/30">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 text-[11px] font-black text-white">You</div>
            </div>
          </OverlayView>
        )}

        {shopMarkers.map(({ shop, coords, key }) => {
          const shopIdentity = shop?.id ?? shop?.shopName ?? shop?.name ?? null;
          const isSelected = Boolean(
            selectedShop &&
              selectedShopCoords &&
              (selectedShop === shop ||
                (selectedIdentity !== null &&
                  shopIdentity === selectedIdentity &&
                  coords.lat === selectedShopCoords.lat &&
                  coords.lng === selectedShopCoords.lng))
          );

          return (
            <OverlayView key={key} position={coords} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
              <button
                type="button"
                onClick={() => {
                  setSelectedShop(shop);
                  onShopClick?.(shop);
                  navigate(`/shops/${shop?.id}`, { state: { shop } });
                }}
                className={`group -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl shadow-slate-900/20 transition-transform hover:scale-110 ${
                  isSelected ? "scale-110 ring-4 ring-sky-500/30" : ""
                }`}
                title={getShopTitle(shop)}
                aria-label={getShopTitle(shop)}
              >
                <div className="relative h-14 w-14 sm:h-16 sm:w-16">
                  {resolveShopImage(shop) ? (
                    <img src={resolveShopImage(shop)} alt={getShopTitle(shop)} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs font-black text-slate-600">
                      {getShopTitle(shop)
                        .split(" ")
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}

                  <div className={`absolute inset-x-0 bottom-0 h-2 ${shop.shopStatus === "open" ? "bg-emerald-500" : "bg-rose-500"}`} />
                </div>
              </button>
            </OverlayView>
          );
        })}
      </GoogleMap>

      {selectedShop && (
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center p-3 sm:p-6">
          <div
            className="pointer-events-auto w-full max-w-[420px] overflow-hidden rounded-2xl shadow-2xl shadow-slate-900/20"
            style={{ backgroundColor: "#ffffff", border: "1px solid rgba(226, 232, 240, 0.9)" }}
          >
            <div className="relative h-40 bg-slate-100">
              {selectedImage ? (
                <img src={selectedImage} alt={getShopTitle(selectedShop)} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-500">No image available</div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" />

              <button
                type="button"
                onClick={() => setSelectedShop(null)}
                className="absolute right-3 top-3 rounded-full p-2 text-slate-700 shadow"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
                aria-label="Close shop details"
              >
                <X size={16} />
              </button>

              <div className="absolute bottom-3 left-3 right-3">
                <div className="flex items-start justify-between gap-3 text-white">
                  <div>
                    <h3 className="text-lg font-black leading-tight">{getShopTitle(selectedShop)}</h3>
                    <p className="text-xs text-white/85">{selectedShop.ownerName || selectedShop.name || "Owner not available"}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${selectedShop.shopStatus === "open" ? "bg-emerald-400 text-emerald-950" : "bg-rose-400 text-rose-950"}`}>
                    {selectedShop.shopStatus === "open" ? "Open" : "Closed"}
                  </span>
                </div>
              </div>
            </div>

            {selectedImages.length > 1 && (
              <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
                <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  Shop Photos
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {selectedImages.map((url, index) => (
                    <button
                      type="button"
                      key={`${url}-${index}`}
                      onClick={() => setSelectedShop({ ...selectedShop, imageUrl: url })}
                      className="h-16 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:scale-[1.02]"
                      aria-label={`Show shop photo ${index + 1}`}
                    >
                      <img src={url} alt={`${getShopTitle(selectedShop)} photo ${index + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 p-4">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{selectedShop.rating?.toFixed(1) || "N/A"}</span>
                {selectedShop.reviews ? <span className="text-slate-500">({selectedShop.reviews} reviews)</span> : null}
              </div>

              <div className="flex items-start gap-2 text-sm text-slate-700">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                <span>{getShopAddress(selectedShop)}</span>
              </div>

              {selectedShop.phone && (
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Phone className="h-4 w-4 shrink-0 text-sky-600" />
                  <a href={`tel:${selectedShop.phone}`} className="hover:text-sky-700">{selectedShop.phone}</a>
                </div>
              )}

              {selectedShop.email && (
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <Mail className="h-4 w-4 shrink-0 text-sky-600" />
                  <span className="truncate">{selectedShop.email}</span>
                </div>
              )}

              {selectedDistanceKm !== null && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="h-4 w-4 shrink-0 text-sky-600" />
                  <span>{selectedDistanceKm.toFixed(1)} km away</span>
                </div>
              )}

              {selectedShop.hours && (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="h-4 w-4 shrink-0 text-sky-600" />
                  <span>{selectedShop.hours}</span>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                {selectedShop.phone && (
                  <a
                    href={`tel:${selectedShop.phone}`}
                    className="flex-1 rounded-xl bg-sky-600 px-3 py-2 text-center text-sm font-bold text-white hover:bg-sky-500"
                  >
                    Call
                  </a>
                )}

                {selectedShopCoords ? (
                  <button
                    type="button"
                    onClick={() => openDirections(selectedShopCoords)}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <span className="inline-flex items-center gap-1"><Navigation size={14} /> Directions</span>
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </LoadScript>
  );
};

export default NearbyShopsMap;
