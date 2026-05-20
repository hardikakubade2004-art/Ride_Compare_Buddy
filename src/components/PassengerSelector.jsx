import { useState } from 'react';
import { Users, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const PassengerSelector = ({ value, onChange }) => {
  const handleDecrement = () => {
    if (value > 1) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < 6) onChange(value + 1);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white/50 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm mt-4 mx-4">
      <div className="flex items-center space-x-3">
        <div className="bg-blue-50 p-2 rounded-full">
          <Users className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">How many people?</p>
          <p className="text-xs text-slate-500">Select passengers</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleDecrement}
          className={`w-8 h-8 flex items-center justify-center rounded-full border ${
            value === 1 ? 'border-slate-200 text-slate-300' : 'border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
          disabled={value === 1}
        >
          <Minus className="w-4 h-4" />
        </motion.button>
        
        <span className="text-lg font-semibold w-4 text-center">{value}</span>
        
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleIncrement}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

export default PassengerSelector;
