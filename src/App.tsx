import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ReviewPage from './pages/ReviewPage';
import StatsPage from './pages/StatsPage';
import NotFound from './pages/NotFound';
import ThemeToggle from './components/ThemeToggle';
import Sidebar from './components/Sidebar';
import { useSpacedRepetition } from './hooks/useSpacedRepetition';
import { sampleDeck } from './data/sampleDeck';

// Layout component with animated nav indication and sidebar
const AppLayout = ({ children, theme, toggleTheme }: {
  children: React.ReactNode;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { stats, resetAllData } = useSpacedRepetition(sampleDeck);
  
  // Toggle sidebar visibility
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-primary-50 dark:from-dark-900 dark:to-dark-800 transition-colors duration-700">
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-dark-800/95 backdrop-blur-md shadow-sm border-b border-primary-100 dark:border-dark-600">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="mr-4 p-2 text-accent-600 dark:text-accent-300 hover:bg-accent-100 dark:hover:bg-dark-600 rounded-md"
                aria-label="Toggle sidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-lg font-bold text-primary-600 dark:text-primary-400"
              >
                <motion.span 
                  role="img" 
                  aria-label="flashcards" 
                  className="text-2xl"
                  whileHover={{ rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5 } }}
                >
                  🧠
                </motion.span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400">
                  Recallify
                </span>
              </Link>
            </div>
            
            <nav className="flex items-center">
              <div className="relative hidden sm:block">
                <div className="flex space-x-1">
                  <Link 
                    to="/" 
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative
                             ${location.pathname === '/'
                               ? 'text-primary-600 dark:text-primary-400'
                               : 'text-accent-600 dark:text-accent-300 hover:text-primary-600 dark:hover:text-primary-400'
                             }`}
                  >
                    Review
                    {location.pathname === '/' && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 dark:from-primary-400 dark:to-secondary-400"
                        initial={false}
                        transition={{ type: 'spring', duration: 0.5 }}
                      />
                    )}
                  </Link>
                  
                  <Link 
                    to="/stats" 
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative
                             ${location.pathname === '/stats'
                               ? 'text-primary-600 dark:text-primary-400'
                               : 'text-accent-600 dark:text-accent-300 hover:text-primary-600 dark:hover:text-primary-400'
                             }`}
                  >
                    Stats
                    {location.pathname === '/stats' && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 dark:from-primary-400 dark:to-secondary-400"
                        initial={false}
                        transition={{ type: 'spring', duration: 0.5 }}
                      />
                    )}
                  </Link>
                </div>
              </div>
              
              <div className="sm:hidden flex space-x-2">
                <Link 
                  to="/" 
                  className={`p-2 rounded-md text-sm font-medium ${location.pathname === '/' 
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-dark-700' 
                    : 'text-accent-600 dark:text-accent-300'}`}
                >
                  <span role="img" aria-label="review">🔄</span>
                </Link>
                <Link 
                  to="/stats" 
                  className={`p-2 rounded-md text-sm font-medium ${location.pathname === '/stats' 
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-dark-700' 
                    : 'text-accent-600 dark:text-accent-300'}`}
                >
                  <span role="img" aria-label="stats">📊</span>
                </Link>
              </div>
              
              <div className="ml-3">
                <ThemeToggle theme={theme} toggle={toggleTheme} />
              </div>
            </nav>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          isOpen={isSidebarOpen} 
          stats={stats}
          resetAllData={resetAllData}
          currentPath={location.pathname}
        />
        
        {/* Main content */}
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-0 md:ml-64' : 'ml-0'}`}>
          <div className="h-full py-6 px-4 sm:px-6 md:px-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="min-h-[calc(100vh-12rem)]"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      <footer className="py-4 px-4 border-t border-primary-100 dark:border-dark-600">
        <motion.div 
          className="max-w-7xl mx-auto text-center text-sm text-accent-500 dark:text-accent-400"
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <p className="flex justify-center items-center space-x-1">
            <span>Built with</span>
            <motion.span 
              role="img" 
              aria-label="heart" 
              className="text-danger-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ❤️
            </motion.span>
            <span>using React, Tailwind & Vite</span>
          </p>
        </motion.div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <AppLayout theme={theme} toggleTheme={toggleTheme}>
            <ReviewPage />
          </AppLayout>
        } />
        <Route path="/stats" element={
          <AppLayout theme={theme} toggleTheme={toggleTheme}>
            <StatsPage />
          </AppLayout>
        } />
        <Route path="*" element={
          <AppLayout theme={theme} toggleTheme={toggleTheme}>
            <NotFound />
          </AppLayout>
        } />
      </Routes>
    </Router>
  );
};

export default App; 