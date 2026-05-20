import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Map, MapPin, Loader2, Navigation, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import MapPreview from '../components/MapPreview';
import axios from 'axios';

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const passengers = queryParams.get('passengers') || 1;
  const mode = queryParams.get('mode') || 'mini';

  const [showMapSelection, setShowMapSelection] = useState(false);
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  const [suggestions, setSuggestions] = useState([]);
  const [activeInput, setActiveInput] = useState(null); // 'pickup' or 'dest'
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);

  const debounceTimer = useRef(null);

  const saveRecentSearch = (p, d) => {
    if (!p || !d) return;
    try {
      let recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      recent = recent.filter(s => s.pickup !== p || s.destination !== d);
      const newSearch = { pickup: p, destination: d, timestamp: Date.now() };
      recent.unshift(newSearch);
      localStorage.setItem('recentSearches', JSON.stringify(recent.slice(0, 5)));
    } catch (e) {
      console.error('Error saving recent search', e);
    }
  };

  // Auto-Geolocation on mount and load recent searches
  useEffect(() => {
    // Load recent searches
    const saved = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(saved);

    if (navigator.geolocation && !pickup) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setPickupCoords({ lat, lng: lon });
          try {
            const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            if (res.data && res.data.display_name) {
              // Simplify the address a bit
              const parts = res.data.display_name.split(',');
              setPickup(parts.slice(0, 3).join(', '));
            } else {
              setPickup('Current Location');
            }
          } catch (e) {
            setPickup('Current Location');
          }
          setLoadingLocation(false);
        },
        () => {
          setLoadingLocation(false);
          if (!pickup) setPickup('My Location');
        }
      );
    }
  }, []);

  const searchNominatim = (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
        setSuggestions(res.data);
      } catch (e) {
        console.error(e);
      }
    }, 500);
  };

  const handleSelectSuggestion = (place) => {
    const coords = { lat: parseFloat(place.lat), lng: parseFloat(place.lon) };
    if (activeInput === 'pickup') {
      setPickup(place.display_name);
      setPickupCoords(coords);
      setActiveInput('dest'); // Move to next input
    } else {
      setDestination(place.display_name);
      setDestCoords(coords);
      setSuggestions([]);

      // Auto navigate if both coords exist
      if (pickupCoords) {
        saveRecentSearch(pickup, place.display_name);
        navigate(`/results?plat=${pickupCoords.lat}&plng=${pickupCoords.lng}&dlat=${coords.lat}&dlng=${coords.lng}&pname=${encodeURIComponent(pickup)}&dname=${encodeURIComponent(place.display_name)}&passengers=${passengers}&mode=${mode}`);
      }
    }
  };

  const handleManualSearch = () => {
    if (pickup && destination) {
      saveRecentSearch(pickup, destination);
      navigate(`/results?pname=${encodeURIComponent(pickup)}&dname=${encodeURIComponent(destination)}&plat=${pickupCoords?.lat || 0}&plng=${pickupCoords?.lng || 0}&dlat=${destCoords?.lat || 0}&dlng=${destCoords?.lng || 0}&passengers=${passengers}&mode=${mode}`);
    }
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="flex flex-col h-screen bg-slate-50 relative lg:h-full lg:rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-white px-4 pt-6 pb-4 shadow-sm z-20 relative">
        <div className="flex items-center mb-6">
          <button
            onClick={() => showMapSelection ? setShowMapSelection(false) : navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-slate-800" />
          </button>
          <h1 className="text-xl font-bold ml-2 text-slate-800">
            {showMapSelection ? 'Select on Map' : 'Plan your ride'}
          </h1>
        </div>

        {!showMapSelection && (
          <div className="relative flex flex-col space-y-3 pl-8">
            <div className="absolute left-3 top-5 bottom-6 w-0.5 bg-slate-200">
              <div className="absolute -top-1 -left-1.5 w-3.5 h-3.5 rounded-full bg-indigo-500 border-4 border-white shadow-sm"></div>
              <div className="absolute -bottom-1 -left-1.5 w-3.5 h-3.5 rounded-none bg-purple-500 border-4 border-white shadow-sm"></div>
            </div>

            <div className="relative z-50">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Current Location"
                  value={pickup}
                  onFocus={() => setActiveInput('pickup')}
                  onChange={(e) => {
                    setPickup(e.target.value);
                    searchNominatim(e.target.value);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                  className="w-full bg-slate-50 border border-slate-100 shadow-inner rounded-xl px-4 py-3.5 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none font-medium pr-10"
                />
                {loadingLocation && (
                  <Loader2 className="absolute right-3 top-4 w-5 h-5 text-indigo-500 animate-spin" />
                )}
                {!loadingLocation && pickupCoords && (
                  <Navigation className="absolute right-3 top-4 w-5 h-5 text-indigo-500" />
                )}
              </div>
            </div>

            <div className="relative z-40">
              <input
                type="text"
                placeholder="Where to?"
                autoFocus
                value={destination}
                onFocus={() => {
                  setActiveInput('dest');
                  searchNominatim(destination);
                }}
                onChange={(e) => {
                  setDestination(e.target.value);
                  searchNominatim(e.target.value);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                className="w-full bg-slate-50 border border-slate-100 shadow-inner rounded-xl px-4 py-3.5 text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all outline-none font-medium"
              />
            </div>
          </div>
        )}
      </div>

      {!showMapSelection && activeInput && suggestions.length > 0 && (
        <div className="absolute top-[200px] left-4 right-4 bg-white rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto border border-slate-100">
          {suggestions.map((s, i) => (
            <div
              key={i}
              onClick={() => handleSelectSuggestion(s)}
              className="p-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer flex items-start space-x-3"
            >
              <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-slate-800 line-clamp-1">{s.display_name.split(',')[0]}</p>
                <p className="text-xs text-slate-500 line-clamp-1">{s.display_name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showMapSelection ? (
        <div className="flex-1 relative flex flex-col">
          <div className="flex-1 relative">
            <div className="absolute inset-0 z-0">
              <MapPreview isInteractive={true} onCenterChanged={setMapCenter} fullHeight={true} pickupLocation={pickupCoords} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20 relative pb-8">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6"></div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Confirm Location</h3>
            <p className="text-slate-500 text-sm mb-6">Drag map to position the pin exactly</p>

            <button
              onClick={() => {
                const finalLat = mapCenter?.lat || pickupCoords?.lat || 28.6139;
                const finalLng = mapCenter?.lng || pickupCoords?.lng || 77.2090;
                const pName = pickup || 'Current Location';
                saveRecentSearch(pName, 'Pinned Location');
                let url = `/results?pname=${encodeURIComponent(pName)}&dname=Pinned Location&passengers=${passengers}&mode=${mode}`;
                if (pickupCoords) url += `&plat=${pickupCoords.lat}&plng=${pickupCoords.lng}`;
                url += `&dlat=${finalLat}&dlng=${finalLng}`;
                navigate(url);
              }}
              className="w-full premium-gradient text-white font-bold rounded-2xl py-4 hover:shadow-lg active:scale-[0.98] transition-all shadow-md"
            >
              Confirm Destination
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 flex-1 overflow-y-auto" onClick={() => setSuggestions([])}>
          <button
            onClick={() => setShowMapSelection(true)}
            className="flex items-center space-x-4 w-full p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all mb-6 group"
          >
            <div className="bg-indigo-50 p-2.5 rounded-full group-hover:bg-indigo-100 transition-colors">
              <Map className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">Choose on map</span>
          </button>

          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 ml-2">Recent Places</h3>
            <div className="space-y-2">
              {recentSearches.length > 0 ? (
                recentSearches.map((search, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      const p = search.pickup || 'Current Location';
                      const d = search.destination || 'Destination';
                      saveRecentSearch(p, d);
                      navigate(`/results?pname=${encodeURIComponent(p)}&dname=${encodeURIComponent(d)}&plat=0&plng=0&dlat=0&dlng=0&passengers=${passengers}&mode=${mode}`);
                    }}
                    className="flex items-center space-x-4 p-3.5 rounded-2xl hover:bg-white hover:shadow-md cursor-pointer transition-all border border-transparent hover:border-slate-100"
                  >
                    <div className="bg-slate-100 p-2.5 rounded-full text-slate-500">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 line-clamp-1">{search.pickup}</h4>
                      <p className="text-sm text-slate-500 font-medium line-clamp-1">{search.destination}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-slate-500 text-sm">No recent searches</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SearchPage;
