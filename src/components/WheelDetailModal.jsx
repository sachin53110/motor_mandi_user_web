import { useState } from "react";
import {
  X, Phone, Mail, MapPin, Star, CheckCircle, Heart, Share2,
  ChevronLeft, ChevronRight, Circle, Package, AlertCircle, Zap
} from "lucide-react";

const formatPrice = (price) => {
  const value = parseFloat(price);
  if (Number.isNaN(value)) return "N/A";
  return `₹${value.toLocaleString("en-IN")}`;
};

export default function WheelDetailModal({ isOpen, onClose, item }) {
  const [liked, setLiked] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  if (!isOpen || !item) return null;

  const firstImage = item.medias?.[0]?.media;

  return (
    <>
      <style>{`
        @keyframes slideUp   { from { opacity:0; transform:translateY(30px) scale(.97) } to { opacity:1; transform:none } }
        @keyframes fadeIn    { from { opacity:0 } to { opacity:1 } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-20px) } to { opacity:1; transform:none } }
        .modal-enter { animation: fadeIn .2s ease both; }
        .panel-enter { animation: slideDown .3s cubic-bezier(.34,1.56,.64,1) both; }
      `}</style>

      <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md modal-enter" onClick={onClose} />

      <div className="fixed inset-0 z-[110] overflow-y-auto">
        <div className="min-h-full flex flex-col">
          <div className="flex-1 bg-white mt-12 rounded-t-3xl panel-enter flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-blue-100 px-4 sm:px-6 py-4 rounded-t-3xl">
              <div className="max-w-6xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">
                    ⚙️
                  </div>
                  <div>
                    <h2 className="text-blue-950 font-black text-lg leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      {item.brandName || "Wheel"} - Size {item.size}
                    </h2>
                    <p className="text-blue-600 text-xs mt-1">{item.carCompany ? `For ${item.carCompany}` : "Premium Wheels"}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 px-4 sm:px-6 py-6 max-w-6xl mx-auto w-full">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Image Gallery */}
                <div className="lg:col-span-2">
                  <div className="relative bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl overflow-hidden h-96 border border-blue-200 mb-4 flex items-center justify-center group">
                    {item.medias && item.medias.length > 0 && !imgError ? (
                      <>
                        <img
                          src={item.medias[imageIndex]?.media}
                          alt={`${item.brandName} - View ${imageIndex + 1}`}
                          className="w-full h-full object-cover"
                          onError={() => setImgError(true)}
                        />
                        {item.medias.length > 1 && (
                          <>
                            <button
                              onClick={() => setImageIndex((i) => (i - 1 + item.medias.length) % item.medias.length)}
                              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <ChevronLeft size={24} />
                            </button>
                            <button
                              onClick={() => setImageIndex((i) => (i + 1) % item.medias.length)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <ChevronRight size={24} />
                            </button>
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                              {imageIndex + 1}/{item.medias.length}
                            </div>
                            <div className="absolute bottom-14 left-0 right-0 flex gap-2 justify-center px-3 flex-wrap">
                              {item.medias.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setImageIndex(idx)}
                                  className={`h-2 rounded-full transition-all ${
                                    idx === imageIndex
                                      ? "bg-blue-500 w-6"
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
                        <div className="text-8xl opacity-40">⚙️</div>
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
                          : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                      }`}
                    >
                      <Heart size={16} fill={liked ? "currentColor" : "none"} /> Like
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all text-sm">
                      <Share2 size={16} /> Share
                    </button>
                  </div>
                </div>

                {/* Details Section */}
                <div className="lg:col-span-3 space-y-6">
                  {/* Price */}
                  <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-blue-600/60 text-sm font-semibold">Current Price</span>
                      {item.customerPrice && (
                        <span className="text-blue-500/60 text-xs line-through">{formatPrice(item.customerPrice)}</span>
                      )}
                    </div>
                    <div className="text-4xl font-black text-blue-700 mb-2">{formatPrice(item.price)}</div>
                    <p className="text-blue-600/70 text-sm">Price per wheel</p>
                  </div>

                  {/* Specifications Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-blue-100 rounded-xl p-4">
                      <div className="text-blue-600/60 text-xs font-semibold mb-1 flex items-center gap-1">
                        <Circle size={14} /> Size
                      </div>
                      <div className="text-blue-950 font-bold text-lg">{item.size || "—"}</div>
                    </div>

                    <div className="bg-white border border-blue-100 rounded-xl p-4">
                      <div className="text-blue-600/60 text-xs font-semibold mb-1 flex items-center gap-1">
                        <Zap size={14} /> PCD
                      </div>
                      <div className="text-blue-950 font-bold text-lg">{item.pcd || "—"}</div>
                    </div>

                    <div className="bg-white border border-blue-100 rounded-xl p-4">
                      <div className="text-blue-600/60 text-xs font-semibold mb-1 flex items-center gap-1">
                        <Package size={14} /> Stock
                      </div>
                      <div className="text-blue-950 font-bold text-lg">{item.stock || "—"} pcs</div>
                    </div>

                    <div className="bg-white border border-blue-100 rounded-xl p-4">
                      <div className="text-blue-600/60 text-xs font-semibold mb-1 flex items-center gap-1">
                        <AlertCircle size={14} /> Condition
                      </div>
                      <div className={`text-sm font-bold px-2 py-1 rounded-full w-fit capitalize ${
                        item.condition?.toLowerCase() === "new"
                          ? "bg-blue-100 text-blue-700"
                          : item.condition?.toLowerCase() === "used"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {item.condition || "—"}
                      </div>
                    </div>

                    {item.brandName && (
                      <div className="bg-white border border-blue-100 rounded-xl p-4">
                        <div className="text-blue-600/60 text-xs font-semibold mb-1">Brand</div>
                        <div className="text-blue-950 font-bold text-lg">{item.brandName}</div>
                      </div>
                    )}

                    {item.carCompany && (
                      <div className="bg-white border border-blue-100 rounded-xl p-4">
                        <div className="text-blue-600/60 text-xs font-semibold mb-1">Compatible With</div>
                        <div className="text-blue-950 font-bold text-lg">{item.carCompany}</div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {item.description && (
                    <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                      <div className="text-blue-600/60 text-xs font-semibold mb-2">Description</div>
                      <p className="text-blue-900 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  )}

                  {/* Seller Information */}
                  {item.user && (
                    <div className="bg-blue-950 rounded-2xl p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-black text-lg" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                            {item.user.shopName || item.user.name}
                          </h3>
                          <p className="text-blue-400 text-sm flex items-center gap-1">
                            <CheckCircle size={14} /> Verified Seller
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star key={i} size={14} fill="#f59e0b" stroke="#f59e0b" />
                            ))}
                          </div>
                          <p className="text-blue-400 text-xs">Highly Rated</p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-blue-800">
                        <a
                          href={`tel:${item.user.phone}`}
                          className="flex items-center gap-3 text-blue-300 hover:text-white transition-colors"
                        >
                          <Phone size={18} /> {item.user.phone}
                        </a>
                        {item.user.email && (
                          <a
                            href={`mailto:${item.user.email}`}
                            className="flex items-center gap-3 text-blue-300 hover:text-white transition-colors text-sm break-all"
                          >
                            <Mail size={18} /> {item.user.email}
                          </a>
                        )}
                        {item.user.address && (
                          <div className="flex items-start gap-3 text-blue-300">
                            <MapPin size={18} className="mt-1 flex-shrink-0" /> {item.user.address}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
