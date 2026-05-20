import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import MapPreview from '../components/MapPreview';
import RideComparisonCard from '../components/RideComparisonCard';
import AIRecommendationBox from '../components/AIRecommendationBox';
import axios from 'axios';

const listVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const pname = queryParams.get('pname') || 'Current Location';
  const dname = queryParams.get('dname') || 'Destination';
  const plat = queryParams.get('plat');
  const plng = queryParams.get('plng');
  const dlat = queryParams.get('dlat');
  const dlng = queryParams.get('dlng');

  const passengers = parseInt(queryParams.get('passengers')) || 1;
  const preferredMode = queryParams.get('mode') || 'mini';

  const [activeTab, setActiveTab] = useState(preferredMode);
  const [loading, setLoading] = useState(true);
  const [rideData, setRideData] = useState({ rides: {}, aiRecommendation: {}, surgeWarning: null });
  const [routeCoords, setRouteCoords] = useState(null);

  useEffect(() => {
    const fetchRoutingAndFares = async () => {
      let distanceText = "5.0 km";
      let durationText = "15 mins";
      let distanceKm = 5.0;

      // 1. Fetch real route from OSRM if we have valid coordinates
      if (plat && plng && dlat && dlng && plat !== '0' && plng !== '0' && dlat !== '0' && dlng !== '0') {
        try {
          const osrmRes = await axios.get(`https://router.project-osrm.org/route/v1/driving/${plng},${plat};${dlng},${dlat}?overview=full&geometries=geojson`);

          if (osrmRes.data && osrmRes.data.routes && osrmRes.data.routes.length > 0) {
            const route = osrmRes.data.routes[0];
            const leafletCoords = route.geometry.coordinates.map(c => [c[1], c[0]]);
            setRouteCoords(leafletCoords);

            distanceKm = route.distance / 1000;
            distanceText = `${distanceKm.toFixed(1)} km`;
            durationText = `${Math.ceil(route.duration / 60)} mins`;
          }
        } catch (osrmError) {
          console.error("OSRM Routing failed, falling back to default distance:", osrmError);
        }
      }

      // 2. Fetch prices from our backend with the real/fallback distance
      try {
        const backendRes = await fetch('http://localhost:5000/api/rides/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            distanceText,
            durationText,
            isHighDemand: Math.random() > 0.7,
            passengers,
            preferredMode
          })
        });

        if (!backendRes.ok) throw new Error("Backend API failed");

        const data = await backendRes.json();
        console.log("Ride data received:", data);
        setRideData(data);
      } catch (backendError) {
        console.error("Error fetching fare data:", backendError);

        // DEMO MODE: Show mock data so you can see what it should look like
        const baseBike = Math.round(15 + distanceKm * 8);
        const baseAuto = Math.round(25 + distanceKm * 15);
        const baseMini = Math.round(40 + distanceKm * 20);
        const baseSedan = Math.round(50 + distanceKm * 25);

        const demoRides = {
          bike: [
            { id: 'b1', app: 'Rapido', appColor: 'bg-yellow-500 text-black', type: 'Bike', fare: baseBike, eta: '3 min', duration: durationText, isCheapest: true },
            { id: 'b2', app: 'Ola', appColor: 'bg-green-500', type: 'Bike', fare: Math.round(baseBike * 1.15), eta: '5 min', duration: durationText },
            { id: 'b3', app: 'Uber', appColor: 'bg-black', type: 'Moto', fare: Math.round(baseBike * 1.25), eta: '2 min', duration: durationText, isFastest: true }
          ],
          auto: [
            { id: 'a1', app: 'Rapido', appColor: 'bg-yellow-500 text-black', type: 'Auto', fare: baseAuto, eta: '4 min', duration: durationText, isCheapest: true },
            { id: 'a2', app: 'Ola', appColor: 'bg-green-500', type: 'Auto', fare: Math.round(baseAuto * 1.1), eta: '3 min', duration: durationText },
            { id: 'a3', app: 'Uber', appColor: 'bg-black', type: 'Auto', fare: Math.round(baseAuto * 1.2), eta: '6 min', duration: durationText, isFastest: true }
          ],
          mini: [
            { id: 'm1', app: 'Rapido', appColor: 'bg-yellow-500 text-black', type: 'Mini', fare: baseMini, eta: '5 min', duration: durationText, isCheapest: true },
            { id: 'm2', app: 'Ola', appColor: 'bg-green-500', type: 'Mini', fare: Math.round(baseMini * 1.15), eta: '4 min', duration: durationText },
            { id: 'm3', app: 'Uber', appColor: 'bg-black', type: 'Go', fare: Math.round(baseMini * 1.3), eta: '2 min', duration: durationText, isFastest: true }
          ],
          sedan: [
            { id: 's1', app: 'Rapido', appColor: 'bg-yellow-500 text-black', type: 'Sedan', fare: baseSedan, eta: '7 min', duration: durationText, isCheapest: true },
            { id: 's2', app: 'Ola', appColor: 'bg-green-500', type: 'Prime', fare: Math.round(baseSedan * 1.2), eta: '5 min', duration: durationText },
            { id: 's3', app: 'Uber', appColor: 'bg-black', type: 'Premier', fare: Math.round(baseSedan * 1.3), eta: '4 min', duration: durationText, isFastest: true }
          ]
        };

        const activeOptions = demoRides[preferredMode] || demoRides['mini'];
        const cheapest = activeOptions.reduce((prev, curr) => (prev.fare < curr.fare ? prev : curr), activeOptions[0]);
        const fastest = activeOptions.reduce((prev, curr) => (parseInt(prev.eta) < parseInt(curr.eta) ? prev : curr), activeOptions[0]);

        setRideData({
          rides: demoRides,
          aiRecommendation: {
            text: `✨ Smart AI Insight: For a ${distanceText} trip, ${cheapest.app} ${cheapest.type} offers the best price at ₹${cheapest.fare}. If you're in a hurry, ${fastest.app} ${fastest.type} is arriving in ${fastest.eta}.`,
            savings: fastest.fare > cheapest.fare ? fastest.fare - cheapest.fare : 25,
            waitTime: parseInt(fastest.eta)
          },
          surgeWarning: null
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRoutingAndFares();
  }, [plat, plng, dlat, dlng, passengers, preferredMode]);

  const rides = rideData.rides[activeTab] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col h-screen bg-slate-50 relative lg:h-full lg:rounded-xl overflow-hidden"
    >
      {/* Map Section */}
      <div className="h-[35vh] relative flex-shrink-0 z-0">
        <MapPreview
          isInteractive={false}
          showRoute={true}
          routeCoordinates={routeCoords}
          pickupLocation={plat ? { lat: plat, lng: plng } : null}
        />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-4 z-[500] bg-white/90 backdrop-blur p-2.5 rounded-full shadow-md text-slate-800 hover:bg-white"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Results Bottom Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200, delay: 0.1 }}
        className="flex-1 bg-white rounded-t-[2.5rem] -mt-8 relative z-20 flex flex-col shadow-[0_-20px_40px_rgba(0,0,0,0.05)] border-t border-white/50 overflow-hidden"
      >

        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2"></div>

        <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100">
          <div className="flex-1 mr-4 overflow-hidden">
            <h2 className="text-2xl font-bold text-slate-900 truncate tracking-tight">Choose a ride</h2>
            <p className="text-sm text-slate-500 font-medium truncate">{pname.split(',')[0]} • {dname.split(',')[0]}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="bg-slate-50 p-2.5 rounded-full text-slate-600 hover:bg-slate-100 transition-colors shadow-sm border border-slate-100"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto pt-5 pb-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
              <p className="text-slate-500 font-medium">Calculating best fares...</p>
            </div>
          ) : (
            <>
              {rideData.aiRecommendation && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                  <AIRecommendationBox
                    surgeWarning={rideData.surgeWarning}
                    recommendation={rideData.aiRecommendation}
                  />
                </motion.div>
              )}

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="px-4 mb-5">
                <div className="flex p-1 bg-slate-100 rounded-xl">
                  {['bike', 'auto', 'mini', 'sedan'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all capitalize ${activeTab === tab ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="show"
                key={activeTab} // Retrigger animation on tab change
                className="px-4 space-y-3"
              >
                {rides.map(ride => (
                  <motion.div variants={itemVariants} key={ride.id}>
                    <RideComparisonCard {...ride} />
                  </motion.div>
                ))}
              </motion.div>

              {rides.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="px-4 mt-6">
                  <button className="w-full premium-gradient text-white font-bold text-lg rounded-2xl py-4 hover:shadow-[0_8px_30px_rgba(79,70,229,0.4)] active:scale-[0.98] transition-all shadow-lg">
                    Book {rides.find(r => r.isCheapest)?.app || rides[0].app} {rides.find(r => r.isCheapest)?.type || rides[0].type}
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResultsPage;
