import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  X, Phone, Mail, MapPin, Star, CheckCircle, Heart, Share2,
  ChevronLeft, ChevronRight, Gauge, Package, AlertCircle, TrendingUp
} from "lucide-react";
import ApiProvider from "../api/ApiProvider";
import LOGO_SRC from "../assets/motorMandiLogo.png";

const formatPrice = (price) => {
  const value = parseFloat(price);
  if (Number.isNaN(value)) return "N/A";
  return `₹${value.toLocaleString("en-IN")}`;
};

export default function TyreDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [tyre, setTyre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTyre = async () => {
      try {
        setLoading(true);
        const data = await ApiProvider.tyres.getDetail(id);
        setTyre(data.data || data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load tyre details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTyre();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🛞</div>
          <p className="text-gray-600 font-semibold">Loading tyre details...</p>
        </div>
      </div>
    );
  }

  if (error || !tyre) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={40} className="text-red-400" />
        </div>
        <p className="text-gray-900 font-bold text-xl mb-2">Failed to load tyre</p>
        <p className="text-gray-600 text-sm mb-6">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3 rounded-lg transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-emerald-100 px-4 sm:px-6 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={LOGO_SRC} alt="MotorMandi" className="h-10 w-auto object-contain" />
            <div>
              <h2 className="text-emerald-950 font-black text-lg leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {tyre.brandName || "Tyre"} - Size {tyre.size}
              </h2>
              <p className="text-emerald-600 text-xs mt-1">{tyre.type || "Premium Tyres"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Image Gallery */}
          <div className="lg:col-span-2">
            <div className="relative bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl overflow-hidden h-96 border border-emerald-200 mb-4 flex items-center justify-center group">
              {tyre.medias && tyre.medias.length > 0 && !imgError ? (
                <>
                  <img
                    src={tyre.medias[imageIndex]?.media}
                    alt={`${tyre.brandName} - View ${imageIndex + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                  {tyre.medias.length > 1 && (
                    <>
                      <button
                        onClick={() => setImageIndex((i) => (i - 1 + tyre.medias.length) % tyre.medias.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={() => setImageIndex((i) => (i + 1) % tyre.medias.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <ChevronRight size={24} />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                        {imageIndex + 1}/{tyre.medias.length}
                      </div>
                      <div className="absolute bottom-14 left-0 right-0 flex gap-2 justify-center px-3 flex-wrap">
                        {tyre.medias.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setImageIndex(idx)}
                            className={`h-2 rounded-full transition-all ${
                              idx === imageIndex
                                ? "bg-emerald-500 w-6"
                                : "bg-white/50 hover:bg-white/75 w-2"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-8xl opacity-40">🛞</div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setLiked(!liked)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all text-sm ${
                  liked
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                }`}
              >
                <Heart size={16} fill={liked ? "currentColor" : "none"} /> Like
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-all text-sm">
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-3 space-y-6">
            {/* Price */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-emerald-600/60 text-sm font-semibold">Current Price</span>
                {tyre.customerPrice && (
                  <span className="text-emerald-500/60 text-xs line-through">{formatPrice(tyre.customerPrice)}</span>
                )}
              </div>
              <div className="text-4xl font-black text-emerald-700 mb-2">{formatPrice(tyre.price)}</div>
              <p className="text-emerald-600/70 text-sm">Price is per piece</p>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-emerald-100 rounded-xl p-4">
                <div className="text-emerald-600/60 text-xs font-semibold mb-1 flex items-center gap-1">
                  <Gauge size={14} /> Size
                </div>
                <div className="text-emerald-950 font-bold text-lg">{tyre.size || "—"}</div>
              </div>

              <div className="bg-white border border-emerald-100 rounded-xl p-4">
                <div className="text-emerald-600/60 text-xs font-semibold mb-1 flex items-center gap-1">
                  <Package size={14} /> Type
                </div>
                <div className="capitalize text-emerald-950 font-bold text-lg">
                  {tyre.type === "TubeLess" ? "Tubeless" : tyre.type || "—"}
                </div>
              </div>

              <div className="bg-white border border-emerald-100 rounded-xl p-4">
                <div className="text-emerald-600/60 text-xs font-semibold mb-1 flex items-center gap-1">
                  <TrendingUp size={14} /> Quantity
                </div>
                <div className="text-emerald-950 font-bold text-lg">{tyre.quantity || "—"} pcs</div>
              </div>

              <div className="bg-white border border-emerald-100 rounded-xl p-4">
                <div className="text-emerald-600/60 text-xs font-semibold mb-1 flex items-center gap-1">
                  <AlertCircle size={14} /> Condition
                </div>
                <div className={`text-sm font-bold px-2 py-1 rounded-full w-fit capitalize ${
                  tyre.condition?.toLowerCase() === "new"
                    ? "bg-emerald-100 text-emerald-700"
                    : tyre.condition?.toLowerCase() === "used"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-blue-100 text-blue-700"
                }`}>
                  {tyre.condition || "—"}
                </div>
              </div>

              {tyre.brandName && (
                <div className="bg-white border border-emerald-100 rounded-xl p-4 col-span-2">
                  <div className="text-emerald-600/60 text-xs font-semibold mb-1">Brand</div>
                  <div className="text-emerald-950 font-bold text-lg">{tyre.brandName}</div>
                </div>
              )}
            </div>

            {/* Description */}
            {tyre.description && (
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                <div className="text-emerald-600/60 text-xs font-semibold mb-2">Description</div>
                <p className="text-emerald-900 text-sm leading-relaxed">{tyre.description}</p>
              </div>
            )}

            {/* Seller Information */}
            {tyre.user && (
              <div className="bg-emerald-950 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-black text-lg" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      {tyre.user.shopName || tyre.user.name}
                    </h3>
                    <p className="text-emerald-400 text-sm flex items-center gap-1">
                      <CheckCircle size={14} /> Verified Seller
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} size={14} fill="#f59e0b" stroke="#f59e0b" />
                      ))}
                    </div>
                    <p className="text-emerald-400 text-xs">Highly Rated</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-emerald-800">
                  <a
                    href={`tel:${tyre.user.phone}`}
                    className="flex items-center gap-3 text-emerald-300 hover:text-white transition-colors"
                  >
                    <Phone size={18} /> {tyre.user.phone}
                  </a>
                  {tyre.user.email && (
                    <a
                      href={`mailto:${tyre.user.email}`}
                      className="flex items-center gap-3 text-emerald-300 hover:text-white transition-colors text-sm break-all"
                    >
                      <Mail size={18} /> {tyre.user.email}
                    </a>
                  )}
                  {tyre.user.address && (
                    <div className="flex items-start gap-3 text-emerald-300">
                      <MapPin size={18} className="mt-1 flex-shrink-0" /> {tyre.user.address}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
