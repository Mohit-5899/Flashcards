import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSpacedRepetition, CardState } from '../hooks/useSpacedRepetition';
import { sampleDeck } from '../data/sampleDeck';
import ResetConfirmModal from '../components/ResetConfirmModal';

const StatCard: React.FC<{
  title: string;
  value: string | number;
  description?: string;
  color: string;
  icon?: string;
  delay?: number;
}> = ({ title, value, description, color, icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className="p-6 rounded-xl bg-white dark:bg-accent-800 shadow-soft-xl border border-primary-100 dark:border-primary-800 
                 hover:shadow-lg dark:hover:shadow-primary-900/20 transition-all duration-300"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="flex items-start">
        {icon && (
          <div className={`mr-4 p-3 rounded-lg ${color}`}>
            <span className="text-2xl">{icon}</span>
          </div>
        )}
        <div>
          <h3 className="text-sm font-medium text-accent-500 dark:text-accent-400">
            {title}
          </h3>
          <p className="mt-1 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400">
            {value}
          </p>
          {description && (
            <p className="mt-1 text-sm text-accent-500 dark:text-accent-400">
              {description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ProgressBar: React.FC<{
  value: number;
  label: string;
  color: string;
  delay?: number;
}> = ({ value, label, color, delay = 0 }) => {
  return (
    <motion.div 
      className="mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-accent-700 dark:text-accent-300">
          {label}
        </span>
        <span className="text-sm font-medium text-accent-700 dark:text-accent-300">
          {value}%
        </span>
      </div>
      <div className="w-full h-4 bg-accent-200 dark:bg-accent-700 rounded-full overflow-hidden shadow-inner-lg">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: delay + 0.2 }}
          className={`h-full ${color}`}
        />
      </div>
    </motion.div>
  );
};

const BarChart: React.FC<{
  data: number[];
  labels: string[];
  color: string;
  title: string;
  maxValue?: number;
}> = ({ data, labels, color, title, maxValue }) => {
  const highest = maxValue || Math.max(...data, 5);
  
  return (
    <div className="bg-white dark:bg-accent-800 rounded-xl p-4 shadow-soft-xl">
      <h3 className="text-sm font-medium text-accent-700 dark:text-accent-300 mb-4">{title}</h3>
      <div className="flex items-end h-32 gap-1">
        {data.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <motion.div 
              className={`w-full ${color} rounded-t-sm`}
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(value / highest * 100, 2)}%` }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
            />
            <span className="text-xs text-accent-500 mt-1 truncate w-full text-center">
              {labels[index]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Donut chart component to visualize card distribution
const DonutChart: React.FC<{
  data: { value: number; color: string; label: string }[];
  size?: number;
  thickness?: number;
}> = ({ data, size = 150, thickness = 20 }) => {
  // Calculate total and convert to percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let accumulatedPercentage = 0;
  
  return (
    <div className="inline-flex items-center justify-center relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <div 
        className="absolute rounded-full bg-accent-200 dark:bg-accent-700"
        style={{ 
          width: size, 
          height: size, 
          clipPath: 'circle(50%)',
        }}
      ></div>
      
      {/* Data segments */}
      {data.map((segment, index) => {
        const percentage = total > 0 ? (segment.value / total) * 100 : 0;
        const startPercentage = accumulatedPercentage;
        accumulatedPercentage += percentage;
        
        if (percentage === 0) return null;
        
        // Calculate the angles for the conic gradient
        const startAngle = startPercentage * 3.6; // 3.6 = 360 / 100
        const endAngle = accumulatedPercentage * 3.6;
        
        return (
          <motion.div 
            key={index}
            className="absolute rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            style={{ 
              width: size, 
              height: size,
              background: `conic-gradient(${segment.color} ${startAngle}deg, ${segment.color} ${endAngle}deg, transparent ${endAngle}deg, transparent 360deg)`,
              clipPath: 'circle(50%)',
            }}
          ></motion.div>
        );
      })}
      
      {/* Inner circle (hole) */}
      <div 
        className="absolute rounded-full bg-white dark:bg-accent-800"
        style={{ 
          width: size - (thickness * 2), 
          height: size - (thickness * 2),
          clipPath: 'circle(50%)',
        }}
      ></div>
      
      {/* Center text */}
      <div className="relative z-10 text-center">
        <span className="block text-sm font-semibold text-accent-600 dark:text-accent-300">Cards</span>
        <span className="block text-xl font-bold text-primary-600 dark:text-primary-400">{total}</span>
      </div>
    </div>
  );
};

const StatsPage: React.FC = () => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const { stats, reviewHistory, cards, resetAllData } = useSpacedRepetition(sampleDeck);
  
  // Generate labels for the last 7 days
  const dayLabels = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + i);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  });
  
  // Card distribution data for donut chart
  const cardDistribution = [
    { value: stats.newCards, color: 'var(--tw-gradient-from, #0ea5e9)', label: 'New' },
    { value: stats.learningCards, color: 'var(--tw-gradient-from, #f59e0b)', label: 'Learning' },
    { value: stats.reviewCards, color: 'var(--tw-gradient-from, #3b82f6)', label: 'Review' },
    { value: stats.masteredCards, color: 'var(--tw-gradient-from, #22c55e)', label: 'Mastered' },
  ];
  
  // Calculate distribution of response qualities (Again, Hard, Good, Easy)
  const responseDistribution = [0, 0, 0, 0];
  reviewHistory.forEach(log => {
    responseDistribution[log.responseQuality]++;
  });
  
  const responseLabels = ['Again', 'Hard', 'Good', 'Easy'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      <div className="flex justify-between items-center">
        <motion.h2 
          className="text-3xl font-bold mb-6 text-primary-700 dark:text-primary-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Learning Statistics
        </motion.h2>
        
        <motion.button
          onClick={() => setIsResetModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm rounded-lg 
                    shadow-md hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Reset Data
        </motion.button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Retention Rate"
          value={`${Math.round(stats.retentionRate)}%`}
          description="of cards remembered"
          color="bg-primary-100 dark:bg-primary-900/30 text-primary-500"
          icon="🧠"
          delay={0.1}
        />
        <StatCard
          title="Average Ease"
          value={stats.averageEase.toFixed(2)}
          description="ease multiplier"
          color="bg-secondary-100 dark:bg-secondary-900/30 text-secondary-500"
          icon="⚙️"
          delay={0.2}
        />
        <StatCard
          title="Cards Reviewed"
          value={reviewHistory.length}
          description="total reviews"
          color="bg-warning-100 dark:bg-warning-900/30 text-warning-500"
          icon="🔄"
          delay={0.3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-accent-800 rounded-xl p-6 shadow-soft-xl border border-primary-100 dark:border-primary-800"
        >
          <h3 className="text-lg font-semibold mb-4 text-primary-700 dark:text-primary-300">Card Distribution</h3>
          <div className="flex flex-col items-center justify-center">
            <DonutChart data={cardDistribution} />
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 w-full text-sm">
              {cardDistribution.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-accent-600 dark:text-accent-300">{item.label}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-accent-800 rounded-xl p-6 shadow-soft-xl border border-primary-100 dark:border-primary-800"
        >
          <h3 className="text-lg font-semibold mb-4 text-primary-700 dark:text-primary-300">Daily Activity</h3>
          <BarChart 
            data={stats.cardsPerDay} 
            labels={dayLabels}
            color="bg-gradient-to-t from-primary-500 to-primary-400"
            title="Cards Reviewed Per Day"
          />
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white dark:bg-accent-800 rounded-xl p-6 shadow-soft-xl border border-primary-100 dark:border-primary-800"
      >
        <h3 className="text-lg font-semibold mb-4 text-primary-700 dark:text-primary-300">Performance Metrics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ProgressBar 
              value={stats.retentionRate} 
              label="Retention Rate" 
              color="bg-gradient-to-r from-success-400 to-success-500"
              delay={0.7}
            />
            <ProgressBar 
              value={(stats.masteredCards / stats.totalCards) * 100} 
              label="Mastery Progress" 
              color="bg-gradient-to-r from-primary-400 to-primary-500"
              delay={0.8}
            />
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-accent-700 dark:text-accent-300 mb-2">Response Distribution</h4>
              <BarChart 
                data={responseDistribution} 
                labels={responseLabels}
                color="bg-gradient-to-t from-secondary-500 to-secondary-400"
                title=""
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20">
              <h4 className="text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">Algorithm Settings</h4>
              <div className="space-y-1 text-sm text-accent-600 dark:text-accent-300">
                <p>Initial intervals: 1, 3, 7 days</p>
                <p>Default ease: 2.5</p>
                <p>Minimum ease: 1.3</p>
                <p>New cards per day: 20</p>
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-success-50 dark:bg-success-900/20">
              <h4 className="text-sm font-medium text-success-700 dark:text-success-300 mb-2">Learning Tip</h4>
              <p className="text-sm text-accent-600 dark:text-accent-300">
                Keep reviews consistent! Daily practice, even just a few minutes, 
                is more effective than cramming for hours once a week.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="text-center p-6 bg-gradient-radial from-primary-50 to-secondary-50 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-xl shadow-inner-lg"
      >
        <motion.p 
          className="italic text-accent-600 dark:text-accent-300"
          animate={{ 
            opacity: [0.7, 1, 0.7],
            scale: [1, 1.02, 1]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          "The spacing effect is one of the most reliable findings in the psychology of learning and memory."
        </motion.p>
      </motion.div>

      <ResetConfirmModal 
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={resetAllData}
      />
    </div>
  );
};

export default StatsPage; 