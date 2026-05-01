import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Mail,
  MapPin,
  Phone,
  Share2,
} from "lucide-react";
import ApiProvider from "../api/ApiProvider";
import AdSenseSlot from "../components/AdSenseSlot.jsx";

const formatPrice = (price) => {
  const value = parseFloat(price);
  if (Number.isNaN(value)) return "N/A";
  return `₹${value.toLocaleString("en-IN")}`;
};

export default function RimDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [liked, setLiked] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [rim, setRim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const inlineDetailSlot = (import.meta.env.VITE_ADSENSE_INLINE_DETAIL_SLOT || "5182233001").trim();

  useEffect(() => {
    const fetchRim = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ApiProvider.rims.getDetail(id);
        setRim(data.data || data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Failed to load rim details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRim();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">⚙️</div>
          <p className="text-gray-600 font-semibold">Loading rim details...</p>
        </div>
      </div>
    );
  }

  if (error || !rim) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-gray-600 font-semibold mb-6">{error || "Rim not found"}</p>
          <button
            onClick={() => navigate("/rims")}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Back to Rims
          </button>
        </div>
      </div>
    );
  }

  const images = rim.medias || [];
  const currentImage = images[imageIndex]?.media;
  const title = rim.name || rim.code || (rim.size ? `Rim • ${rim.size}` : "Rim Listing");

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <section className="mb-5 bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 line-clamp-1">{title}</h1>
            <p className="text-sm text-gray-600 mt-0.5">{rim.size || ""} {rim.color ? `• ${rim.color}` : ""}</p>
          </div>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition">
              <Share2 size={16} />
            </button>
            <button
              onClick={() => setLiked(!liked)}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition"
            >
              <Heart size={16} fill={liked ? "#ef4444" : "none"} color={liked ? "#ef4444" : "#666"} />
            </button>
          </div>
        </section>

        {inlineDetailSlot && <AdSenseSlot slot={inlineDetailSlot} className="mb-5 overflow-hidden" />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 relative">
              <div className="aspect-square bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                {!imgError && currentImage ? (
                  <img
                    src={currentImage}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="text-6xl">⚙️</div>
                )}
              </div>

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

              {images.length > 0 && (
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                  {imageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setImgError(false);
                      setImageIndex(idx);
                    }}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition ${
                      idx === imageIndex ? "border-green-600" : "border-gray-200"
                    }`}
                  >
                    <img src={img.media} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Price</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-green-600">{formatPrice(rim.ownerPrice)}</span>
                    {rim.customerPrice && (
                      <span className="text-lg text-gray-400 line-through">{formatPrice(rim.customerPrice)}</span>
                    )}
                  </div>
                </div>

                {rim.ownerPrice && rim.customerPrice && parseFloat(rim.customerPrice) > parseFloat(rim.ownerPrice) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm font-semibold text-red-700">
                      Save ₹{(parseFloat(rim.customerPrice) - parseFloat(rim.ownerPrice)).toLocaleString("en-IN")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Specifications</h2>
              <div className="space-y-3">
                {rim.size && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Size</span>
                    <span className="font-semibold text-gray-900">{rim.size}</span>
                  </div>
                )}
                {rim.quantity !== null && rim.quantity !== undefined && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Quantity</span>
                    <span className="font-semibold text-gray-900">{rim.quantity}</span>
                  </div>
                )}
                {rim.condition && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Condition</span>
                    <span className="font-semibold text-gray-900 capitalize">{rim.condition}</span>
                  </div>
                )}
                {rim.color && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Color</span>
                    <span className="font-semibold text-gray-900">{rim.color}</span>
                  </div>
                )}
              </div>
            </div>

            {rim.user && (
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Seller Information</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Shop / Name</p>
                    <p className="font-semibold text-gray-900">{rim.user.shopName || rim.user.name || "N/A"}</p>
                  </div>

                  {rim.user.phone && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Phone</p>
                      <a
                        href={`tel:${rim.user.phone}`}
                        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
                      >
                        <Phone size={16} />
                        {rim.user.phone}
                      </a>
                    </div>
                  )}

                  {rim.user.email && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Email</p>
                      <a
                        href={`mailto:${rim.user.email}`}
                        className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold break-all"
                      >
                        <Mail size={16} />
                        {rim.user.email}
                      </a>
                    </div>
                  )}

                  {rim.user.address && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Address</p>
                      <div className="flex items-start gap-2 text-gray-700">
                        <MapPin size={16} className="mt-0.5 text-green-600 flex-shrink-0" />
                        <span className="whitespace-pre-line">{rim.user.address}</span>
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
