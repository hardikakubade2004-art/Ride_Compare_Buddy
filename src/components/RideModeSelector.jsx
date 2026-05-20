import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bike, Car, CarFront, Navigation } from 'lucide-react';

const modes = [
  { id: 'bike', name: 'Bike', icon: Bike, time: '2 min' },
  { id: 'auto', name: 'Auto', icon: Navigation, time: '4 min' }, // Using Navigation as a stand-in for Auto rickshaw
  { id: 'mini', name: 'Mini', icon: Car, time: '5 min' },
  { id: 'sedan', name: 'Sedan', icon: CarFront, time: '8 min' },
];

const RideModeSelector = ({ value, onChange }) => {
  return (
    <div className="mt-6 px-4">
      <h3 className="text-sm font-semibold text-slate-800 mb-3 px-1">Ride Options</h3>
      <div className="flex space-x-3 overflow-x-auto no-scrollbar pb-2">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = value === mode.id;

          return (
            <motion.button
              key={mode.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => onChange(mode.id)}
              className={`flex flex-col items-center justify-center min-w-[90px] p-3 rounded-2xl border transition-all duration-300 ${
                isSelected
                  ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-200'
                  : 'bg-white border-slate-200 hover:border-blue-300'
              }`}
            >
              <Icon className={`w-8 h-8 mb-2 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
              <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                {mode.name}
              </span>
              <span className={`text-xs mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                {mode.time}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default RideModeSelector;
