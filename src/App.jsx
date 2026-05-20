import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';
import SplashScreen from './components/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash screen for 2.5 seconds for a premium app feel
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" />
        ) : (
          <motion.div
            key="main-app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen font-sans text-slate-900 selection:bg-pink-200 selection:text-pink-900 premium-gradient"
          >
            <div className="mx-auto max-w-md radiant-glass min-h-screen shadow-2xl relative overflow-hidden sm:max-w-xl md:max-w-3xl lg:max-w-5xl lg:rounded-2xl lg:my-8 lg:min-h-[85vh] premium-shadow border border-white/50">
              {/* Main App Container - Mobile constrained, desktop expansive but centered */}
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/results" element={<ResultsPage />} />
              </Routes>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Router>
  );
}

export default App;
