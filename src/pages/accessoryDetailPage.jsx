import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  X, Phone, Mail, MapPin, Star, CheckCircle, Heart, Share2,
  ChevronLeft, ChevronRight, Gauge, Package, AlertCircle, TrendingUp
} from "lucide-react";
import ApiProvider from "../api/ApiProvider";

const formatPrice = (price) => {
  const value = parseFloat(price);
  if (Number.isNaN(value)) return "N/A";
  return `₹${value.toLocaleString("en-IN")}`;
};

export default function AccessoryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [accessory, setAccessory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccessory = async () => {
      try {
        setLoading(true);
        const data = await ApiProvider.accessories.getDetail(id);
        setAccessory(data.data || data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load accessory details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAccessory();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🔧</div>
          <p className="text-gray-400 font-semibold">Loading accessory details...</p>
        </div>
      </div>
    );
  }

  if (error || !accessory) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-gray-400 font-semibold mb-6">{error || "Accessory not found"}</p>
          <button
            onClick={() => navigate("/accessories")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Accessories
          </button>
        </div>
      </div>
    );
  }

  const images = accessory.medias || [];
  const currentImage = images[imageIndex]?.media;

  return (
    <div className="min-h-screen bg-gray-950">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <section className="mb-5 bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-white line-clamp-1">{accessory.title}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{accessory.brand || accessory.category || "Accessory"}</p>
          </div>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center hover:bg-gray-800 transition text-gray-400">
              <Share2 size={16} />
            </button>
            <button
              onClick={() => setLiked(!liked)}
              className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center hover:bg-gray-800 transition"
            >
              <Heart size={16} fill={liked ? "#ef4444" : "none"} color={liked ? "#ef4444" : "#9ca3af"} />
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 relative">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                {!imgError && currentImage ? (
                  <img
                    src={currentImage}
                    alt={accessory.title}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="text-6xl">🔧</div>
                )}
              </div>

              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setImageIndex((i) => (i - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setImageIndex((i) => (i + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {images.length > 0 && (
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {imageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition ${
                      idx === imageIndex ? "border-blue-600" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img.media}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Description */}
            {accessory.description && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{accessory.description}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Section */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Price</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-blue-400">{formatPrice(accessory.price)}</span>
                    {accessory.customerPrice && (
                      <span className="text-lg text-gray-400 line-through">{formatPrice(accessory.customerPrice)}</span>
                    )}
                  </div>
                </div>

                {accessory.price && accessory.customerPrice && parseFloat(accessory.customerPrice) > parseFloat(accessory.price) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm font-semibold text-red-700">
                      Save ₹{(parseFloat(accessory.customerPrice) - parseFloat(accessory.price)).toLocaleString("en-IN")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Details</h2>
              <div className="space-y-3">
                {accessory.brand && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Brand</span>
                    <span className="font-semibold text-gray-900">{accessory.brand}</span>
                  </div>
                )}
                {accessory.category && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Category</span>
                    <span className="font-semibold text-gray-900">{accessory.category}</span>
                  </div>
                )}
                {accessory.quantity && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">In Stock</span>
                    <span className="font-semibold text-gray-900">{accessory.quantity}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Seller Info */}
            {accessory.user && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Seller Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <p className="font-semibold text-gray-900">{accessory.user.name || "N/A"}</p>
                  </div>

                  {accessory.user.phone && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Phone</p>
                      <a
                        href={`tel:${accessory.user.phone}`}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        <Phone size={16} />
                        {accessory.user.phone}
                      </a>
                    </div>
                  )}

                  {accessory.user.email && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Email</p>
                      <a
                        href={`mailto:${accessory.user.email}`}
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold break-all"
                      >
                        <Mail size={16} />
                        {accessory.user.email}
                      </a>
                    </div>
                  )}

                  {accessory.user.city && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Location</p>
                      <div className="flex items-center gap-2 text-gray-900">
                        <MapPin size={16} className="text-blue-600" />
                        {accessory.user.city}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
