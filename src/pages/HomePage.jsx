import React, { useState } from 'react';
import { Menu, User, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MapPreview from '../components/MapPreview';
import LocationInput from '../components/LocationInput';
import PassengerSelector from '../components/PassengerSelector';
import RideModeSelector from '../components/RideModeSelector';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const HomePage = () => {
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState(1);
  const [rideMode, setRideMode] = useState('mini');

  const goToSearch = () => {
    navigate(`/search?passengers=${passengers}&mode=${rideMode}`);
  };
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen bg-slate-50 lg:min-h-full"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-20 flex justify-between items-center p-4">
        <motion.button 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="glass p-2.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-slate-800 hover:bg-white transition-colors"
        >
          <Menu className="w-5 h-5" />
        </motion.button>
        
        {/* Current Location Bar */}
        <motion.div 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={goToSearch}
          className="glass px-5 py-2.5 rounded-full flex items-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] cursor-pointer hover:bg-white premium-transition"
        >
          <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full mr-2.5 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
          <span className="text-sm font-bold text-slate-800 truncate max-w-[150px]">Current Location</span>
        </motion.div>

        <motion.button 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="glass p-2.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-slate-800 hover:bg-white transition-colors"
        >
          <User className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Map Section */}
      <MapPreview />

      {/* Main Content Area - overlaps map slightly */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 bg-white rounded-t-[2.5rem] -mt-10 relative z-10 flex flex-col pb-8 shadow-[0_-20px_40px_rgba(0,0,0,0.05)] border-t border-white/50"
      >
        
        {/* Drag handle pill */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-6"></div>

        {/* Destination Input */}
        <motion.div variants={itemVariants}>
          <LocationInput onClick={goToSearch} />
        </motion.div>

        {/* Additional configuration */}
        <div className="mt-6 flex-1 space-y-4">
          <motion.div variants={itemVariants}>
            <PassengerSelector value={passengers} onChange={setPassengers} />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <RideModeSelector value={rideMode} onChange={setRideMode} />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
