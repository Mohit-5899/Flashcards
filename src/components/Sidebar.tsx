import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CardState } from '../hooks/useSpacedRepetition';

// Type definition for sidebar props
interface SidebarProps {
  isOpen: boolean;
  stats: {
    totalCards: number;
    newCards: number;
    learningCards: number;
    reviewCards: number;
    masteredCards: number;
    averageEase: number;
    retentionRate: number;
    cardsPerDay: number[];
  };
  resetAllData: () => void;
  currentPath: string;
}

// Sidebar item component
const SidebarItem = ({
  icon,
  label,
  active = false,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  to: string;
}) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      active
        ? 'bg-primary-50 dark:bg-dark-700 text-primary-600 dark:text-primary-400'
        : 'hover:bg-accent-100 dark:hover:bg-dark-600/50 text-accent-600 dark:text-accent-300'
    }`}
  >
    <span className="text-xl">{icon}</span>
    <span className="font-medium">{label}</span>
  </Link>
);

// Progress bar component
const ProgressBar = ({ value, max, color }: { value: number; max: number; color: string }) => (
  <div className="w-full h-1.5 bg-accent-200 dark:bg-dark-600 rounded-full overflow-hidden">
    <div 
      className={`h-full ${color}`} 
      style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
    />
  </div>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, stats, resetAllData, currentPath }) => {
  // Example of getting a current card for display (would normally come from context/state)
  const currentDeckName = "Spanish Basics";
  
  // Get today's due count
  const dueToday = stats.newCards + stats.learningCards + stats.reviewCards;
  
  return (
    <motion.aside
      initial={{ width: 0, opacity: 0 }}
      animate={{ 
        width: isOpen ? '16rem' : '0rem',
        opacity: isOpen ? 1 : 0,
        x: isOpen ? 0 : -40
      }}
      transition={{ duration: 0.3 }}
      className={`fixed md:relative z-20 h-full bg-white dark:bg-dark-800 border-r border-primary-100 dark:border-dark-600 shadow-md overflow-hidden ${
        isOpen ? 'block' : 'hidden md:block'
      }`}
    >
      <div className="flex flex-col h-full py-4 overflow-y-auto">
        {/* Deck Info */}
        <div className="px-4 pb-4 border-b border-gray-100 dark:border-dark-600">
          <h2 className="text-base font-bold text-primary-700 dark:text-primary-400 flex items-center gap-2">
            <span className="text-lg">📚</span>
            {currentDeckName}
          </h2>
          <p className="text-xs text-accent-500 dark:text-accent-400 mt-0.5 mb-2">
            Total: {stats.totalCards} cards
          </p>

          {/* Mastery progress */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-accent-600 dark:text-accent-400 mb-1">
              <span>Mastery</span>
              <span>{Math.round((stats.masteredCards / stats.totalCards) * 100)}%</span>
            </div>
            <ProgressBar 
              value={stats.masteredCards} 
              max={stats.totalCards} 
              color="bg-gradient-to-r from-success-400 to-success-500" 
            />
          </div>
        </div>
        
        {/* Card Status Section */}
        <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-600">
          {/* Card states breakdown */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-primary-500 dark:text-primary-400 font-medium">New</span>
              <span className="text-accent-600 dark:text-accent-300 bg-primary-50 dark:bg-dark-700 px-2 rounded-full">{stats.newCards}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-warning-500 dark:text-warning-400 font-medium">Learning</span>
              <span className="text-accent-600 dark:text-accent-300 bg-warning-50 dark:bg-dark-700 px-2 rounded-full">{stats.learningCards}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-secondary-500 dark:text-secondary-400 font-medium">Review</span>
              <span className="text-accent-600 dark:text-accent-300 bg-secondary-50 dark:bg-dark-700 px-2 rounded-full">{stats.reviewCards}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-success-500 dark:text-success-400 font-medium">Mastered</span>
              <span className="text-accent-600 dark:text-accent-300 bg-success-50 dark:bg-dark-700 px-2 rounded-full">{stats.masteredCards}</span>
            </div>
          </div>
          
          {/* Due count */}
          <div className="mt-3 bg-primary-50 dark:bg-dark-700 p-2.5 rounded-lg text-center">
            <p className="text-sm font-medium text-primary-700 dark:text-primary-400">
              {dueToday} cards due today
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-2 py-3 space-y-1 border-b border-gray-100 dark:border-dark-600">
          <SidebarItem
            icon="🔄"
            label="Review"
            active={currentPath === "/"}
            to="/"
          />
          <SidebarItem
            icon="📊"
            label="Statistics"
            active={currentPath === "/stats"}
            to="/stats"
          />
        </div>

        {/* Additional options */}
        <div className="mt-auto px-4 py-3">
          <div className="p-3 rounded-lg mb-4 bg-primary-50/50 dark:bg-dark-700/50 border border-primary-100 dark:border-dark-600">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-medium text-accent-700 dark:text-accent-300">
                Retention Rate
              </span>
              <span className="text-accent-600 dark:text-accent-300 bg-white/50 dark:bg-dark-800/50 px-2 py-0.5 rounded">
                {Math.round(stats.retentionRate)}%
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-medium text-accent-700 dark:text-accent-300">
                Average Ease
              </span>
              <span className="text-accent-600 dark:text-accent-300 bg-white/50 dark:bg-dark-800/50 px-2 py-0.5 rounded">
                {stats.averageEase.toFixed(2)}
              </span>
            </div>
          </div>
          
          <button
            onClick={resetAllData}
            className="w-full py-2.5 px-4 text-sm font-medium text-white bg-gradient-to-r from-danger-500 to-danger-600 
                       rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center space-x-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Reset Progress</span>
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar; 