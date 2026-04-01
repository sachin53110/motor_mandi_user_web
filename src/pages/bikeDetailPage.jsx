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

export default function BikeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
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
        setBike(data.data || data);
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🏍️</div>
          <p className="text-gray-600 font-semibold">Loading bike details...</p>
        </div>
      </div>
    );
  }

  if (error || !bike) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-gray-600 font-semibold mb-6">{error || "Bike not found"}</p>
          <button
            onClick={() => navigate("/bikes")}
            className="px-6 py-2 bg-lime-600 text-white rounded-lg hover:bg-lime-700 transition"
          >
            Back to Bikes
          </button>
        </div>
      </div>
    );
  }

  const images = bike.medias || [];
  const currentImage = images[imageIndex]?.media;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_SRC} alt="MotorMandi" className="h-10 w-auto object-contain" />
            <h1 className="text-lg font-bold text-gray-900 line-clamp-1">{bike.title}</h1>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition">
              <Share2 size={18} />
            </button>
            <button
              onClick={() => setLiked(!liked)}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"
            >
              <Heart size={18} fill={liked ? "#ef4444" : "none"} color={liked ? "#ef4444" : "#666"} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Gallery */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 relative">
              <div className="aspect-square bg-gradient-to-br from-lime-50 to-lime-100 flex items-center justify-center">
                {!imgError && currentImage ? (
                  <img
                    src={currentImage}
                    alt={bike.title}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="text-6xl">🏍️</div>
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
                      idx === imageIndex ? "border-lime-600" : "border-gray-200"
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
            {bike.description && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Description</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{bike.description}</p>
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
                    <span className="text-3xl font-bold text-lime-600">{formatPrice(bike.price)}</span>
                    {bike.customerPrice && (
                      <span className="text-lg text-gray-400 line-through">{formatPrice(bike.customerPrice)}</span>
                    )}
                  </div>
                </div>

                {bike.price && bike.customerPrice && parseFloat(bike.customerPrice) > parseFloat(bike.price) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm font-semibold text-red-700">
                      Save ₹{(parseFloat(bike.customerPrice) - parseFloat(bike.price)).toLocaleString("en-IN")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Specifications</h2>
              <div className="space-y-3">
                {bike.brand && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Brand</span>
                    <span className="font-semibold text-gray-900">{bike.brand}</span>
                  </div>
                )}
                {bike.model && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Model</span>
                    <span className="font-semibold text-gray-900">{bike.model}</span>
                  </div>
                )}
                {bike.year && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Year</span>
                    <span className="font-semibold text-gray-900">{bike.year}</span>
                  </div>
                )}
                {bike.bikeType && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Type</span>
                    <span className="font-semibold text-gray-900">{bike.bikeType}</span>
                  </div>
                )}
                {bike.condition && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Condition</span>
                    <span className="font-semibold text-gray-900 capitalize">{bike.condition}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Seller Info */}
            {bike.user && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Seller Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <p className="font-semibold text-gray-900">{bike.user.name || "N/A"}</p>
                  </div>

                  {bike.user.phone && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Phone</p>
                      <a
                        href={`tel:${bike.user.phone}`}
                        className="inline-flex items-center gap-2 text-lime-600 hover:text-lime-700 font-semibold"
                      >
                        <Phone size={16} />
                        {bike.user.phone}
                      </a>
                    </div>
                  )}

                  {bike.user.email && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Email</p>
                      <a
                        href={`mailto:${bike.user.email}`}
                        className="inline-flex items-center gap-2 text-lime-600 hover:text-lime-700 font-semibold break-all"
                      >
                        <Mail size={16} />
                        {bike.user.email}
                      </a>
                    </div>
                  )}

                  {bike.user.city && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Location</p>
                      <div className="flex items-center gap-2 text-gray-900">
                        <MapPin size={16} className="text-lime-600" />
                        {bike.user.city}
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
