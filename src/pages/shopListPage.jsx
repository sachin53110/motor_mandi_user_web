import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Navigation,
  LocateFixed,
  RefreshCcw,
  SlidersHorizontal,
} from "lucide-react";
import ApiProvider from "../api/ApiProvider";

const PAGE_SURFACE = "#f3f6fb";
const PAGE_LIMIT = 20;

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

const getDistanceKm = (lat1, lng1, lat2, lng2) => {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const earthRadiusKm = 6371;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

const normalizeShop = (shop = {}) => {
  const lat = toNumber(shop.lat);
  const lng = toNumber(shop.lng);
  const imageMedia = shop?.image?.media;

  const imageUrl = typeof imageMedia === "string" && imageMedia.trim()
    ? imageMedia.trim()
    : null;

  const locationBits = [shop.address, shop.city, shop.state, shop.country, shop.pincode]
    .filter(Boolean);

  return {
    ...shop,
    lat,
    lng,
    imageUrl,
    displayName: shop.shopName || shop.name || "Unnamed Shop",
    ownerName: shop.name || "Unknown",
    email: shop.email || "",
    phone: shop.phone || "",
    status: (shop.status || "inactive").toLowerCase(),
    shopStatus: (shop.shopStatus || "unknown").toLowerCase(),
    locationText: locationBits.length ? locationBits.join(", ") : "Location not available",
  };
};

export default function ShopListPage() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 1,
  });

  const [searchText, setSearchText] = useState("");
  const [locationText, setLocationText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");

  const [userLocation, setUserLocation] = useState(null);
  const [nearOnly, setNearOnly] = useState(false);
  const [radiusKm, setRadiusKm] = useState(25);

  const fetchShopsPage = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ApiProvider.shops.getNearby({ page, limit: PAGE_LIMIT });

      if (!response?.status) {
        throw new Error(response?.message || "Failed to fetch shops");
      }

      const list = Array.isArray(response?.data?.result)
        ? response.data.result
        : Array.isArray(response?.data)
          ? response.data
          : [];

      const normalized = list.map(normalizeShop);
      setShops(normalized);

      const apiPagination = response?.data?.pagination || {};
      setPagination({
        page: apiPagination.page || page,
        limit: apiPagination.limit || PAGE_LIMIT,
        total: apiPagination.total ?? normalized.length,
        totalPages: apiPagination.totalPages || 1,
      });
    } catch (err) {
      setError(err.message || "Unable to load shops");
      setShops([]);
      setPagination((prev) => ({ ...prev, total: 0, totalPages: 1 }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopsPage(currentPage);
  }, [currentPage]);

  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setNearOnly(true);
      },
      () => {
        setError("Unable to access your location");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const shopsWithDistance = useMemo(() => {
    if (!userLocation) {
      return shops.map((shop) => ({ ...shop, distanceKm: null }));
    }

    return shops.map((shop) => {
      if (!hasValidCoords(shop.lat, shop.lng)) {
        return { ...shop, distanceKm: null };
      }

      return {
        ...shop,
        distanceKm: getDistanceKm(userLocation.lat, userLocation.lng, shop.lat, shop.lng),
      };
    });
  }, [shops, userLocation]);

  const filteredShops = useMemo(() => {
    let list = [...shopsWithDistance];

    const searchQuery = searchText.trim().toLowerCase();
    if (searchQuery) {
      list = list.filter((shop) => {
        const searchable = [shop.displayName, shop.ownerName, shop.email, shop.phone]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchable.includes(searchQuery);
      });
    }

    const locationQuery = locationText.trim().toLowerCase();
    if (locationQuery) {
      list = list.filter((shop) => shop.locationText.toLowerCase().includes(locationQuery));
    }

    if (statusFilter !== "all") {
      list = list.filter((shop) => shop.shopStatus === statusFilter);
    }

    if (nearOnly && userLocation) {
      list = list.filter((shop) => shop.distanceKm !== null && shop.distanceKm <= radiusKm);
    }

    if (sortBy === "name-asc") {
      list.sort((a, b) => a.displayName.localeCompare(b.displayName));
    } else if (sortBy === "name-desc") {
      list.sort((a, b) => b.displayName.localeCompare(a.displayName));
    } else if (sortBy === "newest") {
      list.sort((a, b) => (b.id || 0) - (a.id || 0));
    } else if (sortBy === "distance") {
      list.sort((a, b) => {
        const da = a.distanceKm ?? Number.POSITIVE_INFINITY;
        const db = b.distanceKm ?? Number.POSITIVE_INFINITY;
        return da - db;
      });
    }

    return list;
  }, [shopsWithDistance, searchText, locationText, statusFilter, nearOnly, radiusKm, sortBy, userLocation]);

  const clearFilters = () => {
    setSearchText("");
    setLocationText("");
    setStatusFilter("all");
    setNearOnly(false);
    setRadiusKm(25);
    setSortBy("name-asc");
  };

  const pageItems = useMemo(() => {
    const total = pagination.totalPages || 1;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const items = [1];
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(total - 1, currentPage + 1);

    if (start > 2) items.push("start-ellipsis");
    for (let i = start; i <= end; i += 1) items.push(i);
    if (end < total - 1) items.push("end-ellipsis");

    items.push(total);
    return items;
  }, [pagination.totalPages, currentPage]);

  const changePage = (page) => {
    if (page < 1 || page > pagination.totalPages || page === currentPage) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: PAGE_SURFACE }}>
      <section className="pt-6 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-[2rem] border border-white/80 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sky-700 text-xs font-bold tracking-widest uppercase mb-1">Shop Directory</p>
                <h1
                  className="text-4xl font-black text-slate-900"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
                >
                  ALL SHOPS
                </h1>
                <p className="text-sm text-slate-500 mt-2">
                  Showing {filteredShops.length} of {shops.length} shops on page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Back To Home
                </Link>
                <button
                  onClick={() => fetchShopsPage(currentPage)}
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
                >
                  <RefreshCcw size={15} /> Refresh
                </button>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
              <div className="xl:col-span-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <Search size={16} className="text-sky-700" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search by shop name, owner, email, phone"
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="xl:col-span-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <MapPin size={16} className="text-sky-700" />
                <input
                  type="text"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  placeholder="Filter by city, state, country, address, pincode"
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
              <button
                onClick={requestUserLocation}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-100"
              >
                <LocateFixed size={15} /> Use My Location
              </button>

              <label className="inline-flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                <span className="font-semibold text-slate-700">Near Me Only</span>
                <input
                  type="checkbox"
                  checked={nearOnly}
                  onChange={(e) => setNearOnly(e.target.checked)}
                  className="h-4 w-4 accent-sky-600"
                />
              </label>

              <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                <span className="font-semibold text-slate-700">Radius</span>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value) || 25)}
                  className="w-16 rounded-md border border-slate-200 px-2 py-1 text-sm"
                />
                <span className="text-slate-500">km</span>
              </label>

              <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm xl:col-span-2">
                <SlidersHorizontal size={15} className="text-slate-500" />
                <span className="font-semibold text-slate-700">Sort By</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="ml-auto rounded-md border border-slate-200 px-2 py-1 text-sm"
                >
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="newest">Newest</option>
                  <option value="distance">Distance</option>
                </select>
              </label>
            </div>

            <div className="mt-3">
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline-offset-2 hover:underline"
              >
                Clear all filters
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <strong>Error:</strong> {error}
              </div>
            )}
          </div>

          <div className="mt-6">
            {loading ? (
              <div className="rounded-2xl border border-white/80 bg-white p-10 text-center">
                <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600" />
                <p className="text-slate-600 font-medium">Loading shops...</p>
              </div>
            ) : filteredShops.length === 0 ? (
              <div className="rounded-2xl border border-white/80 bg-white p-10 text-center">
                <p className="text-slate-700 font-semibold">No shops found for current filters.</p>
                <p className="text-slate-500 text-sm mt-1">Try clearing filters or changing search terms.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filteredShops.map((shop) => {
                    const validCoords = hasValidCoords(shop.lat, shop.lng);
                    const directionsUrl = validCoords
                      ? `https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}`
                      : null;

                    return (
                      <article key={shop.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:shadow-slate-200/60 transition-all">
                        <div className="relative h-44 bg-slate-100">
                          {shop.imageUrl ? (
                            <img src={shop.imageUrl} alt={shop.displayName} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-slate-500">No Image</div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-slate-900/0 to-transparent" />

                          <span className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-[11px] font-bold ${shop.shopStatus === "open" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                            {shop.shopStatus === "open" ? "Open" : "Closed"}
                          </span>

                          {shop.distanceKm !== null && (
                            <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                              {(shop.distanceKm).toFixed(1)} km away
                            </span>
                          )}
                        </div>

                        <div className="p-4">
                          <h3 className="text-lg font-black text-slate-900 leading-tight">{shop.displayName}</h3>
                          <p className="text-xs text-slate-500 mt-1">Owner: {shop.ownerName}</p>

                          <div className="mt-3 space-y-2">
                            <div className="flex items-start gap-2 text-sm text-slate-600">
                              <MapPin size={14} className="mt-0.5 text-sky-600 shrink-0" />
                              <span>{shop.locationText}</span>
                            </div>

                            {shop.phone && (
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Phone size={14} className="text-sky-600 shrink-0" />
                                <a href={`tel:${shop.phone}`} className="hover:text-sky-700">{shop.phone}</a>
                              </div>
                            )}

                            {shop.email && (
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Mail size={14} className="text-sky-600 shrink-0" />
                                <span className="truncate">{shop.email}</span>
                              </div>
                            )}
                          </div>

                          <div className="mt-4 flex gap-2">
                            {shop.phone && (
                              <a
                                href={`tel:${shop.phone}`}
                                className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-700 hover:bg-sky-100"
                              >
                                <Phone size={13} /> Call
                              </a>
                            )}

                            {directionsUrl && (
                              <a
                                href={directionsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                              >
                                <Navigation size={13} /> Directions
                              </a>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={() => changePage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                    >
                      Prev
                    </button>

                    {pageItems.map((item, idx) => (
                      typeof item === "number" ? (
                        <button
                          key={item}
                          onClick={() => changePage(item)}
                          className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                            item === currentPage
                              ? "border-sky-600 bg-sky-600 text-white"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {item}
                        </button>
                      ) : (
                        <span key={`${item}-${idx}`} className="px-1 text-slate-400">...</span>
                      )
                    ))}

                    <button
                      onClick={() => changePage(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                      className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
