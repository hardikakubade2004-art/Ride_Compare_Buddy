import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

const RideComparisonCard = ({ 
  app, 
  appColor,
  type, 
  fare, 
  eta, 
  duration, 
  isCheapest, 
  isFastest 
}) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-3 flex items-center justify-between cursor-pointer premium-transition hover:shadow-md hover:border-slate-200"
    >
      <div className="flex items-center space-x-4">
        {/* Mock Logo / Avatar */}
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-inner ${appColor}`}>
          {app.charAt(0)}
        </div>
        
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="font-bold text-slate-800 text-lg">{app} {type}</h4>
            {(isCheapest || isFastest) && (
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${isCheapest ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {isCheapest ? 'Cheapest' : 'Fastest'}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 font-medium">{duration} drop-off • {eta} away</p>
        </div>
      </div>

      <div className="text-right">
        <div className="font-bold text-xl text-slate-900">₹{fare}</div>
        <div className="flex items-center justify-end text-slate-400 mt-1">
          <Info className="w-3.5 h-3.5" />
        </div>
      </div>
    </motion.div>
  );
};

export default RideComparisonCard;
