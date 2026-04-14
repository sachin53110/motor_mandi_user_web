import { useState } from "react";
import {
  X, Phone, Mail, MapPin, Calendar, Package, Gauge, User,
  Star, CheckCircle, AlertCircle, Heart, Share2, MessageCircle,
  ChevronLeft, ChevronRight
} from "lucide-react";

const formatPrice = (price) => {
  const value = parseFloat(price);
  if (Number.isNaN(value)) return "N/A";
  return `₹${value.toLocaleString("en-IN")}`;
};

const getItemIcon = (item) => {
  if (item.type === "bike") return "🏍️";
  if (item.type === "car") return "🚗";
  if (item.type === "Tyre" || item.size) return "🛞";
  if (item.pcd) return "⚙️";
  return "🔩";
};

const getItemTitle = (item) => {
  if (item.type === "car" || item.type === "bike") {
    return item.name || item.brandName || "Vehicle";
  }
  if (item.pcd) {
    return `${item.brandName || "Wheel"} - Size ${item.size}`;
  }
  if (item.brandName || item.size) {
    return `${item.brandName || "Tyre"} - Size ${item.size}`;
  }
  return `Rim - Size ${item.size}`;
};

export default function ItemDetailModal({ isOpen, onClose, item }) {
  const [liked, setLiked] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  if (!isOpen || !item) return null;

  const isVehicle = item.type === "car" || item.type === "bike";
  const isTyre = !item.pcd && !item.carCompany && item.size && !isVehicle;
  const isWheel = item.pcd || item.carCompany;
  const isRim = item.ownerPrice !== undefined;

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
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">
                    {getItemIcon(item)}
                  </div>
                  <div>
                    <h2 className="text-blue-950 font-black text-lg leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                      {getItemTitle(item)}
                    </h2>
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
            <div className="flex-1 px-4 sm:px-6 py-6 max-w-4xl mx-auto w-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Image Section */}
                <div className="lg:col-span-1">
                  <div className="relative bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl overflow-hidden h-72 border border-blue-200 mb-4 flex items-center justify-center group">
                    {item.medias && item.medias.length > 0 ? (
                      <>
                        <img
                          src={item.medias[imageIndex]?.media}
                          alt={getItemTitle(item)}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = null;
                          }}
                        />
                        {item.medias.length > 1 && (
                          <>
                            <button
                              onClick={() => setImageIndex((i) => (i - 1 + item.medias.length) % item.medias.length)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <ChevronLeft size={20} />
                            </button>
                            <button
                              onClick={() => setImageIndex((i) => (i + 1) % item.medias.length)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <ChevronRight size={20} />
                            </button>
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                              {imageIndex + 1}/{item.medias.length}
                            </div>
                            <div className="absolute bottom-12 left-0 right-0 flex gap-2 justify-center px-3 flex-wrap">
                              {item.medias.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setImageIndex(idx)}
                                  className={`w-2 h-2 rounded-full transition-all ${
                                    idx === imageIndex
                                      ? "bg-blue-500 w-6"
                                      : "bg-white/50 hover:bg-white/75"
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="text-9xl">{getItemIcon(item)}</div>
                    )}
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setLiked(!liked)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all text-sm ${
                        liked
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                      }`}
                    >
                      <Heart size={16} fill={liked ? "currentColor" : "none"} /> Move
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all text-sm">
                      <Share2 size={16} /> Share
                    </button>
                  </div>
                </div>

                {/* Details Section */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Price */}
                  <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-blue-600/60 text-sm font-semibold">Price</span>
                      {(item.customerPrice || item.price) && (
                        <span className="text-blue-500/60 text-xs line-through">{formatPrice(item.customerPrice || item.price)}</span>
                      )}
                    </div>
                    <div className="text-4xl font-black text-blue-700">{formatPrice(item.price || item.ownerPrice)}</div>
                  </div>

                  {/* Key Details Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Vehicle Details */}
                    {isVehicle && (
                      <>
                        <div className="bg-white border border-blue-100 rounded-xl p-4">
                          <div className="text-blue-600/60 text-xs font-semibold mb-1">Brand</div>
                          <div className="text-blue-950 font-bold text-lg">{item.brandName || "—"}</div>
                        </div>
                        <div className="bg-white border border-blue-100 rounded-xl p-4">
                          <div className="text-blue-600/60 text-xs font-semibold mb-1">Model</div>
                          <div className="text-blue-950 font-bold text-lg">{item.model || "—"}</div>
                        </div>
                        <div className="bg-white border border-blue-100 rounded-xl p-4">
                          <div className="text-blue-600/60 text-xs font-semibold mb-1">KM Driven</div>
                          <div className="text-blue-950 font-bold text-lg">{item.km || "—"} km</div>
                        </div>
                        <div className="bg-white border border-blue-100 rounded-xl p-4">
                          <div className="text-blue-600/60 text-xs font-semibold mb-1">Condition</div>
                          <div className={`text-sm font-bold px-2 py-1 rounded-full w-fit capitalize ${
                            item.condition?.toLowerCase() === "excellent"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {item.condition || "—"}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Tyre Details */}
                    {isTyre && (
                      <>
                        <div className="bg-white border border-blue-100 rounded-xl p-4">
                          <div className="text-blue-600/60 text-xs font-semibold mb-1">Size</div>
                          <div className="text-blue-950 font-bold text-lg">{item.size || "—"}</div>
                        </div>
                        <div className="bg-white border border-blue-100 rounded-xl p-4">
                          <div className="text-blue-600/60 text-xs font-semibold mb-1">Type</div>
                          <div className="text-blue-950 font-bold text-lg">{item.type || "—"}</div>
                        </div>
                        <div className="bg-white border border-blue-100 rounded-xl p-4">
                          <div className="text-blue-600/60 text-xs font-semibold mb-1">Quantity</div>
                          <div className="text-blue-950 font-bold text-lg">{item.quantity || "—"}</div>
                        </div>
                        <div className="bg-white border border-blue-100 rounded-xl p-4">
                          <div className="text-blue-600/60 text-xs font-semibold mb-1">Condition</div>
                          <div className={`text-sm font-bold px-2 py-1 rounded-full w-fit capitalize ${
                            item.condition?.toLowerCase() === "new"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {item.condition || "—"}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Wheel Details */}
                    {isWheel && (
                      <>
                        <div className="bg-white border border-blue-100 rounded-xl p-4">
                          <div className="text-blue-600/60 text-xs font-semibold mb-1">Size</div>
                          <div className="text-blue-950 font-bold text-lg">{item.size || "—"}</div>
                        </div>
                        <div className="bg-white border border-blue-100 rounded-xl p-4">
                          <div className="text-blue-600/60 text-xs font-semibold mb-1">PCD</div>
                          <div className="text-blue-950 font-bold text-lg">{item.pcd || "—"}</div>
                        </div>
                        <div className="bg-white border border-blue-100 rounded-xl p-4">
                          <div className="text-blue-600/60 text-xs font-semibold mb-1">Stock</div>
                          <div className="text-blue-950 font-bold text-lg">{item.stock || "—"}</div>
                        </div>
                        <div className="bg-white border border-blue-100 rounded-xl p-4">
                          <div className="text-blue-600/60 text-xs font-semibold mb-1">Condition</div>
                          <div className={`text-sm font-bold px-2 py-1 rounded-full w-fit capitalize ${
                            item.condition?.toLowerCase() === "new"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {item.condition || "—"}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Rim Details */}
                    {isRim && (
                      <>
                        <div className="bg-white border border-blue-100 rounded-xl p-4">
                          <div className="text-blue-600/60 text-xs font-semibold mb-1">Size</div>
                          <div className="text-blue-950 font-bold text-lg">{item.size || "—"}</div>
                        </div>
                        <div className="bg-white border border-blue-100 rounded-xl p-4">
                          <div className="text-blue-600/60 text-xs font-semibold mb-1">Quantity</div>
                          <div className="text-blue-950 font-bold text-lg">{item.quantity || "—"}</div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Description */}
                  {item.description && (
                    <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                      <div className="text-blue-600/60 text-xs font-semibold mb-2">Description</div>
                      <p className="text-blue-900 text-sm">{item.description}</p>
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

                      <div className="space-y-2 mb-4">
                        {item.user.address && (
                          <div className="flex items-center gap-2 text-blue-300 text-sm">
                            <MapPin size={14} className="text-blue-500 shrink-0" />
                            <span>{item.user.address}</span>
                          </div>
                        )}
                        {item.user.phone && (
                          <div className="flex items-center gap-2 text-blue-300 text-sm">
                            <Phone size={14} className="text-blue-500 shrink-0" />
                            <span>{item.user.phone}</span>
                          </div>
                        )}
                        {item.user.email && (
                          <div className="flex items-center gap-2 text-blue-300 text-sm">
                            <Mail size={14} className="text-blue-500 shrink-0" />
                            <span>{item.user.email}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {item.user.phone && (
                          <a
                            href={`tel:${item.user.phone}`}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                          >
                            <Phone size={16} /> Call Now
                          </a>
                        )}
                        {item.user.email && (
                          <a
                            href={`mailto:${item.user.email}`}
                            className="flex-1 bg-white/10 hover:bg-white/20 border border-blue-700/50 text-blue-300 font-bold text-sm px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                          >
                            <Mail size={16} /> Email
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-3 text-xs text-blue-600/60">
                    {item.createdAt && (
                      <div className="flex items-center gap-2">
                        <Calendar size={12} />
                        <span>Posted {new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    )}
                    {item.status && (
                      <div className="flex items-center gap-2">
                        <Package size={12} />
                        <span className="capitalize">{item.status}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-blue-100 px-6 py-4">
              <div className="max-w-4xl mx-auto flex items-center justify-between">
                <p className="text-blue-600/50 text-xs">Item Details - MotorMandi</p>
                <button
                  onClick={onClose}
                  className="text-sm text-blue-600 hover:text-blue-500 font-semibold flex items-center gap-1 transition-colors"
                >
                  <X size={14} /> Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
