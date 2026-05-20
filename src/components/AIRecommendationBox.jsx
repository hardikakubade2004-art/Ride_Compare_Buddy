import { Sparkles, TrendingDown, Clock, AlertTriangle } from 'lucide-react';

const AIRecommendationBox = ({ recommendation, surgeWarning }) => {
  return (
    <div className="mx-4 mb-6">
      {surgeWarning && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3 flex items-center space-x-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-800 font-medium">{surgeWarning}</p>
        </div>
      )}

      <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
        {/* Background visual flair */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl -mr-10 -mt-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400 opacity-20 rounded-full blur-xl -ml-10 -mb-10"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-5 h-5 text-blue-300" />
            <h3 className="font-bold text-lg tracking-tight">AI Recommendation</h3>
          </div>
          
          <p className="text-blue-50 text-sm leading-relaxed mb-4">
            {recommendation.text}
          </p>

          <div className="flex space-x-3">
            {recommendation.savings && (
              <div className="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <TrendingDown className="w-4 h-4 text-green-300" />
                <span className="text-xs font-semibold text-green-100">Save ₹{recommendation.savings}</span>
              </div>
            )}
            {recommendation.waitTime && (
              <div className="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <Clock className="w-4 h-4 text-blue-200" />
                <span className="text-xs font-semibold text-blue-100">Wait {recommendation.waitTime} mins</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationBox;
