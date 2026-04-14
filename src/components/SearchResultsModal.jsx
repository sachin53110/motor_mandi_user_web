import { useEffect, useState } from "react";
import {
  X, Search, AlertCircle, ChevronLeft, ChevronRight,
  MapPin, Phone, RefreshCw, Star, SlidersHorizontal, Loader
} from "lucide-react";
import useSearch from "../hooks/useSearch";
import ItemDetailModal from "./ItemDetailModal";
import TyreDetailModal from "./TyreDetailModal";
import WheelDetailModal from "./WheelDetailModal";

const formatPrice = (price) => {
  const value = parseFloat(price);
  if (Number.isNaN(value)) return "N/A";
  return `₹${value.toLocaleString("en-IN")}`;
};

const conditionStyles = {
  excellent: "bg-blue-100 text-blue-700 border-blue-200",
  good: "bg-lime-50 text-lime-700 border-lime-200",
  fair: "bg-amber-50 text-amber-700 border-amber-200",
  old: "bg-amber-50 text-amber-700 border-amber-200",
  used: "bg-amber-50 text-amber-700 border-amber-200",
};

function VehicleCard({ vehicle, onItemClick }) {
  const conditionKey = vehicle.condition?.toLowerCase();
  const conditionClass = conditionStyles[conditionKey] || conditionStyles.old;

  return (
    <div
      onClick={() => onItemClick(vehicle)}
      className="group bg-white border border-blue-100 hover:border-blue-400/60 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100/80 cursor-pointer">
      <div className="relative h-32 bg-gradient-to-br from-teal-50 to-blue-50 overflow-hidden flex items-center justify-center">
        <span className="text-5xl">{vehicle.type === "bike" ? "🏍️" : "🚗"}</span>
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border capitalize ${conditionClass}`}>
            {vehicle.condition || "—"}
          </span>
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[8px] text-blue-500 font-bold uppercase tracking-wider">{vehicle.type}</span>
          {vehicle.brandName && (
            <>
              <span className="text-blue-300">·</span>
              <span className="text-[8px] text-blue-500 font-bold uppercase">{vehicle.brandName}</span>
            </>
          )}
        </div>
        <h4 className="text-blue-950 font-bold text-xs leading-snug mb-2 group-hover:text-blue-600 transition-colors">
          {vehicle.name || "Vehicle"}
        </h4>
        <div className="flex flex-wrap gap-1 mb-2 text-[8px] font-semibold">
          {vehicle.model && <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">Model: {vehicle.model}</span>}
          {vehicle.km && <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{vehicle.km} km</span>}
        </div>
        <div className="flex items-end justify-between pt-2 border-t border-blue-50">
          <div className="text-blue-700 font-bold text-sm">{formatPrice(vehicle.price)}</div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded transition-all hover:scale-105">
            <Phone size={10} className="inline mr-1" /> Contact
          </button>
        </div>
      </div>
    </div>
  );
}

function TyreCard({ tyre, onItemClick }) {
  return (
    <div
      onClick={() => onItemClick(tyre)}
      className="group bg-white border border-blue-100 hover:border-blue-400/60 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100/80 cursor-pointer">
      <div className="relative h-32 bg-gradient-to-br from-teal-50 to-blue-50 overflow-hidden flex items-center justify-center">
        <span className="text-5xl">🛞</span>
        <div className="absolute top-2 left-2">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 capitalize">
            {tyre.condition || "old"}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h4 className="text-blue-950 font-bold text-xs mb-1">
          {tyre.brandName || "Tyre"} - Size {tyre.size}
        </h4>
        <div className="flex flex-wrap gap-1 mb-2 text-[8px] font-semibold">
          <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{tyre.type}</span>
          <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">Qty: {tyre.quantity}</span>
        </div>
        <div className="flex items-end justify-between pt-2 border-t border-blue-50">
          <div>
            <div className="text-blue-700 font-bold text-sm">{formatPrice(tyre.price)}</div>
            <div className="text-blue-400/60 text-[8px]">{formatPrice(tyre.customerPrice)} retail</div>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded transition-all hover:scale-105">
            <Phone size={10} className="inline mr-1" /> Contact
          </button>
        </div>
      </div>
    </div>
  );
}

function WheelCard({ wheel, onItemClick }) {
  return (
    <div
      onClick={() => onItemClick(wheel)}
      className="group bg-white border border-blue-100 hover:border-blue-400/60 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100/80 cursor-pointer">
      <div className="relative h-32 bg-gradient-to-br from-teal-50 to-blue-50 overflow-hidden flex items-center justify-center">
        <span className="text-5xl">⚙️</span>
        <div className="absolute top-2 left-2">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 capitalize">
            {wheel.condition || "old"}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h4 className="text-blue-950 font-bold text-xs mb-1">
          {wheel.brandName || "Wheel"} - Size {wheel.size}
        </h4>
        <div className="flex flex-wrap gap-1 mb-2 text-[8px] font-semibold">
          <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">PCD: {wheel.pcd}</span>
          <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">Stock: {wheel.stock}</span>
        </div>
        <div className="flex items-end justify-between pt-2 border-t border-blue-50">
          <div>
            <div className="text-blue-700 font-bold text-sm">{formatPrice(wheel.price)}</div>
            <div className="text-blue-400/60 text-[8px]">{formatPrice(wheel.customerPrice)} retail</div>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded transition-all hover:scale-105">
            <Phone size={10} className="inline mr-1" /> Contact
          </button>
        </div>
      </div>
    </div>
  );
}

function RimCard({ rim, onItemClick }) {
  return (
    <div
      onClick={() => onItemClick(rim)}
      className="group bg-white border border-blue-100 hover:border-blue-400/60 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-100/80 cursor-pointer">
      <div className="relative h-32 bg-gradient-to-br from-teal-50 to-blue-50 overflow-hidden flex items-center justify-center">
        <span className="text-5xl">🔩</span>
        <div className="absolute top-2 left-2">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
            Active
          </span>
        </div>
      </div>
      <div className="p-3">
        <h4 className="text-blue-950 font-bold text-xs mb-1">
          Rim - Size {rim.size}
        </h4>
        <div className="flex flex-wrap gap-1 mb-2 text-[8px] font-semibold">
          <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">Qty: {rim.quantity}</span>
        </div>
        <div className="flex items-end justify-between pt-2 border-t border-blue-50">
          <div>
            <div className="text-blue-700 font-bold text-sm">{formatPrice(rim.ownerPrice)}</div>
            <div className="text-blue-400/60 text-[8px]">{formatPrice(rim.customerPrice)} retail</div>
          </div>
          <button className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded transition-all hover:scale-105">
            <Phone size={10} className="inline mr-1" /> Contact
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SearchResultsModal({ isOpen, onClose, initialQuery = "" }) {
  const { results, loading, error, query, performSearch, reset } = useSearch();
  const [localSearch, setLocalSearch] = useState(initialQuery);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (isOpen && !query) {
      performSearch(initialQuery || "");
    }
  }, [isOpen, initialQuery, query, performSearch]);

  const handleSearch = () => {
    performSearch(localSearch);
  };

  const totalResults = (results.vehicles?.length || 0) +
    (results.tyres?.length || 0) +
    (results.wheels?.length || 0) +
    (results.rims?.length || 0);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes slideUp   { from { opacity:0; transform:translateY(30px) scale(.97) } to { opacity:1; transform:none } }
        @keyframes fadeIn    { from { opacity:0 } to { opacity:1 } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-20px) } to { opacity:1; transform:none } }
        .modal-enter { animation: fadeIn .2s ease both; }
        .panel-enter { animation: slideDown .3s cubic-bezier(.34,1.56,.64,1) both; }
        .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
      `}</style>

      <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md modal-enter" onClick={onClose} />

      <div className="fixed inset-0 z-[110] overflow-y-auto">
        <div className="min-h-full flex flex-col">
          <div className="flex-1 bg-white mt-16 rounded-t-3xl panel-enter flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-blue-100 px-4 sm:px-6 py-4 rounded-t-3xl">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">🔍</div>
                    <div>
                      <h2 className="text-blue-950 font-black text-xl leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}>
                        SEARCH RESULTS
                      </h2>
                      {query && <p className="text-blue-500 text-xs">{totalResults} results found for "{query}"</p>}
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-9 h-9 flex items-center justify-center rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50 transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex gap-3 flex-col sm:flex-row">
                  <div className="flex-1 flex items-center gap-2 bg-blue-50 rounded-xl px-4 py-2.5">
                    <Search size={16} className="text-blue-400 shrink-0" />
                    <input
                      type="text"
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      placeholder="Search tyres, rims, cars, bikes..."
                      className="bg-transparent text-blue-900 placeholder-blue-400 text-sm w-full outline-none"
                    />
                    {localSearch && (
                      <button onClick={() => setLocalSearch("")} className="text-blue-400 hover:text-blue-600">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2"
                  >
                    {loading ? <Loader size={16} className="animate-spin" /> : <Search size={16} />}
                    Search
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 px-4 sm:px-6 py-6 max-w-7xl mx-auto w-full">
              {loading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader size={40} className="text-blue-600 animate-spin mb-4" />
                  <p className="text-blue-600 font-semibold">Searching...</p>
                </div>
              )}

              {!loading && error && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle size={28} className="text-red-400" />
                  </div>
                  <p className="text-blue-950 font-bold text-lg mb-1">Search failed</p>
                  <p className="text-blue-600/60 text-sm mb-5">{error}</p>
                </div>
              )}

              {!loading && !error && query && totalResults === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-7xl mb-4">🔍</div>
                  <p className="text-blue-950 font-bold text-lg mb-1">No results found</p>
                  <p className="text-blue-600/60 text-sm mb-5">Try different keywords or check the spelling</p>
                </div>
              )}

              {!loading && !error && totalResults === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-7xl mb-4">🔍</div>
                  <p className="text-blue-950 font-bold text-lg mb-1">No listings available</p>
                  <p className="text-blue-600/60 text-sm">Try a different search query</p>
                </div>
              )}

              {!loading && !error && totalResults > 0 && (
                <div className="space-y-8">
                  {/* Vehicles */}
                  {results.vehicles && results.vehicles.length > 0 && (
                    <div>
                      <h3 className="text-blue-950 font-black text-lg mb-4 flex items-center gap-2">
                        <span className="text-2xl">{results.vehicles[0]?.type === "bike" ? "🏍️" : "🚗"}</span>
                        Vehicles ({results.vehicles.length})
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {results.vehicles.map((vehicle) => (
                          <VehicleCard key={vehicle.id} vehicle={vehicle} onItemClick={setSelectedItem} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tyres */}
                  {results.tyres && results.tyres.length > 0 && (
                    <div>
                      <h3 className="text-blue-950 font-black text-lg mb-4 flex items-center gap-2">
                        <span className="text-2xl">🛞</span>
                        Tyres ({results.tyres.length})
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {results.tyres.map((tyre) => (
                          <TyreCard key={tyre.id} tyre={tyre} onItemClick={setSelectedItem} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Wheels */}
                  {results.wheels && results.wheels.length > 0 && (
                    <div>
                      <h3 className="text-blue-950 font-black text-lg mb-4 flex items-center gap-2">
                        <span className="text-2xl">⚙️</span>
                        Wheels ({results.wheels.length})
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {results.wheels.map((wheel) => (
                          <WheelCard key={wheel.id} wheel={wheel} onItemClick={setSelectedItem} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rims */}
                  {results.rims && results.rims.length > 0 && (
                    <div>
                      <h3 className="text-blue-950 font-black text-lg mb-4 flex items-center gap-2">
                        <span className="text-2xl">🔩</span>
                        Rims ({results.rims.length})
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {results.rims.map((rim) => (
                          <RimCard key={rim.id} rim={rim} onItemClick={setSelectedItem} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="border-t border-blue-100 px-6 py-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <p className="text-blue-600/50 text-xs">
                  {query ? `Results for "${query}"` : "All listings"}
                </p>
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

      {/* Detail Modals - Show appropriate modal based on item type */}
      {selectedItem?.type === "car" || selectedItem?.type === "bike" ? (
        <ItemDetailModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
        />
      ) : selectedItem && !selectedItem.pcd && !selectedItem.carCompany ? (
        <TyreDetailModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
        />
      ) : (
        <WheelDetailModal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
        />
      )}
    </>
  );
}
