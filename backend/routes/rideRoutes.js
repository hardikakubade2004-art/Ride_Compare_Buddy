const express = require('express');
const router = express.Router();

const calculateFare = (baseFare, perKm, distanceKm, perMin, durationMin, surgeMultiplier = 1) => {
  const fare = baseFare + (distanceKm * perKm) + (durationMin * perMin);
  return Math.round(fare * surgeMultiplier);
};

router.post('/calculate', (req, res) => {
  const { distanceText, durationText, isHighDemand, passengers = 1, preferredMode = 'mini' } = req.body;
  
  const distanceKm = parseFloat(distanceText) || 5;
  const durationMin = parseFloat(durationText) || 15;
  const surge = isHighDemand ? 1.4 : 1.0;

  const rides = {
    bike: [
      { id: 'b1', app: 'Rapido', appColor: 'bg-yellow-500 text-black', type: 'Bike', fare: calculateFare(15, 6, distanceKm, 1, durationMin, surge), eta: '3 min', duration: durationText },
      { id: 'b2', app: 'Ola', appColor: 'bg-green-500', type: 'Bike', fare: calculateFare(20, 7, distanceKm, 1, durationMin, surge), eta: '5 min', duration: durationText },
      { id: 'b3', app: 'Uber', appColor: 'bg-black', type: 'Moto', fare: calculateFare(25, 7, distanceKm, 1.2, durationMin, surge), eta: '2 min', duration: durationText }
    ],
    auto: [
      { id: 'a1', app: 'Rapido', appColor: 'bg-yellow-500 text-black', type: 'Auto', fare: calculateFare(30, 10, distanceKm, 1.5, durationMin, surge), eta: '4 min', duration: durationText },
      { id: 'a2', app: 'Ola', appColor: 'bg-green-500', type: 'Auto', fare: calculateFare(35, 11, distanceKm, 1.5, durationMin, surge), eta: '3 min', duration: durationText },
      { id: 'a3', app: 'Uber', appColor: 'bg-black', type: 'Auto', fare: calculateFare(35, 12, distanceKm, 1.5, durationMin, surge), eta: '6 min', duration: durationText }
    ],
    mini: [
      { id: 'm1', app: 'Rapido', appColor: 'bg-yellow-500 text-black', type: 'Mini', fare: calculateFare(50, 15, distanceKm, 2, durationMin, surge), eta: '5 min', duration: durationText },
      { id: 'm2', app: 'Ola', appColor: 'bg-green-500', type: 'Mini', fare: calculateFare(60, 16, distanceKm, 2, durationMin, surge), eta: '4 min', duration: durationText },
      { id: 'm3', app: 'Uber', appColor: 'bg-black', type: 'Go', fare: calculateFare(65, 15, distanceKm, 2.5, durationMin, surge), eta: '2 min', duration: durationText }
    ],
    sedan: [
      { id: 's1', app: 'Rapido', appColor: 'bg-yellow-500 text-black', type: 'Sedan', fare: calculateFare(70, 18, distanceKm, 2.5, durationMin, surge), eta: '7 min', duration: durationText },
      { id: 's2', app: 'Ola', appColor: 'bg-green-500', type: 'Prime', fare: calculateFare(80, 20, distanceKm, 2.5, durationMin, surge), eta: '5 min', duration: durationText },
      { id: 's3', app: 'Uber', appColor: 'bg-black', type: 'Premier', fare: calculateFare(85, 20, distanceKm, 3, durationMin, surge), eta: '4 min', duration: durationText }
    ]
  };

  // Logic to determine cheapest/fastest in each category
  Object.keys(rides).forEach(category => {
    let minFare = Infinity;
    let minEta = Infinity;
    rides[category].forEach(ride => {
      if (ride.fare < minFare) minFare = ride.fare;
      const etaNum = parseInt(ride.eta);
      if (etaNum < minEta) minEta = etaNum;
    });
    rides[category].forEach(ride => {
      if (ride.fare === minFare) ride.isCheapest = true;
      if (parseInt(ride.eta) === minEta) ride.isFastest = true;
    });
  });

  // Smarter AI Recommendation
  let recommendedCategory = preferredMode;

  if (passengers > 4) {
    recommendedCategory = 'sedan';
  } else if (passengers > 2 && (preferredMode === 'bike' || preferredMode === 'auto')) {
    recommendedCategory = 'mini';
  } else if (passengers === 1 && distanceKm < 3 && !isHighDemand) {
    recommendedCategory = 'bike';
  }

  let validRides = rides[recommendedCategory];
  if (!validRides) validRides = rides['mini']; // fallback

  let bestValueRide = validRides.find(r => r.isCheapest);
  let fastestRide = validRides.find(r => r.isFastest);

  let aiRecommendation = { text: '', savings: 0, waitTime: null };

  if (passengers > 4 && preferredMode !== 'sedan') {
    aiRecommendation.text = `For ${passengers} passengers, you need a Sedan. ${bestValueRide.app} ${bestValueRide.type} is the best value option available.`;
  } else if (passengers > 2 && preferredMode === 'bike') {
    aiRecommendation.text = `Bikes aren't suitable for ${passengers} people. We upgraded your search to ${recommendedCategory}. ${bestValueRide.app} is the cheapest!`;
  } else if (bestValueRide.id === fastestRide.id) {
    aiRecommendation.text = `${bestValueRide.app} ${bestValueRide.type} is both the cheapest and fastest ${recommendedCategory} right now. Perfect time to book!`;
  } else {
    const savings = fastestRide.fare - bestValueRide.fare;
    const timeDiff = Math.abs(parseInt(fastestRide.eta) - parseInt(bestValueRide.eta));
    aiRecommendation = {
      text: `${bestValueRide.app} ${bestValueRide.type} is the best value. Save ₹${savings} by waiting just ${timeDiff} extra minute(s) compared to ${fastestRide.app}.`,
      savings,
      waitTime: timeDiff
    };
  }

  res.json({
    surgeWarning: isHighDemand ? "High demand detected. Fares are higher than usual." : null,
    rides,
    aiRecommendation
  });
});

module.exports = router;
