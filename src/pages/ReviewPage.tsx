import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Flashcard from '../components/Flashcard';
import { useSpacedRepetition, ResponseQuality, CardState } from '../hooks/useSpacedRepetition';
import { sampleDeck } from '../data/sampleDeck';
import ResetConfirmModal from '../components/ResetConfirmModal';

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ResponseButton = ({ 
  label, 
  onClick, 
  colorClass,
  hoverColor,
  delay = 0
}: { 
  label: string; 
  onClick: () => void; 
  colorClass: string;
  hoverColor: string;
  delay?: number;
}) => (
  <motion.button
    variants={buttonVariants}
    initial="hidden"
    animate="visible"
    transition={{ delay }}
    whileHover={{ 
      scale: 1.05, 
      boxShadow: `0 10px 15px -3px ${hoverColor}`,
    }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-6 py-3 rounded-xl ${colorClass} text-white font-medium shadow-md transition-all duration-300`}
  >
    {label}
  </motion.button>
);

const CardStateLabel = ({ state }: { state: CardState }) => {
  let bgColor = '';
  let label = '';
  
  switch(state) {
    case CardState.NEW:
      bgColor = 'bg-primary-500';
      label = 'New';
      break;
    case CardState.LEARNING:
      bgColor = 'bg-warning-500';
      label = 'Learning';
      break;
    case CardState.REVIEW:
      bgColor = 'bg-success-500';
      label = 'Review';
      break;
    case CardState.RELEARNING:
      bgColor = 'bg-danger-500';
      label = 'Relearning';
      break;
  }
  
  return (
    <span className={`text-xs px-2 py-1 rounded-full text-white ${bgColor}`}>
      {label}
    </span>
  );
};

const formatDueDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  
  // If due today
  if (date.toDateString() === now.toDateString()) {
    return 'Today';
  }
  
  // If due tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  
  // Due in X days
  const diffTime = Math.abs(date.getTime() - now.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (date > now) {
    return `In ${diffDays} days`;
  } else {
    return `${diffDays} days ago`;
  }
};

const ReviewPage: React.FC = () => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const { 
    currentCard, 
    recordResponse, 
    stats,
    resetAllData
  } = useSpacedRepetition(sampleDeck);
  
  if (!currentCard) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6">
        <motion.div 
          className="text-center p-8 rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-dark-700 dark:to-dark-600 
            border border-primary-100 dark:border-dark-500 shadow-soft-xl w-full max-w-lg"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.h2 
              className="text-3xl font-bold mb-4 text-primary-700 dark:text-primary-300"
              animate={{ 
                color: ['#0ea5e9', '#3b82f6', '#0ea5e9'],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              You're all caught up! 🎉
            </motion.h2>
            <p className="text-lg text-accent-600 dark:text-accent-300 mb-4">
              You've reviewed all cards that are due.
            </p>
            
            <div className="mt-8 flex justify-center">
              <motion.button
                onClick={() => setIsResetModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl 
                          shadow-md hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Reset Cards & Start Over
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        <ResetConfirmModal 
          isOpen={isResetModalOpen}
          onClose={() => setIsResetModalOpen(false)}
          onConfirm={resetAllData}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between h-full">
      {/* Card State Pill */}
      <div className="flex justify-center w-full mb-3">
        <div className="flex items-center space-x-3">
          <CardStateLabel state={currentCard.state} />
          {currentCard.interval > 0 && (
            <span className="text-sm text-accent-600 dark:text-accent-300">
              Interval: {currentCard.interval} days
            </span>
          )}
        </div>
      </div>
      
      {/* Flashcard Container */}
      <div className="flex-1 w-full max-w-md flex items-center justify-center mb-8">
        <div className="w-full aspect-[4/3]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentCard.id}
              initial={{ opacity: 0, x: 50, rotateY: 0 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full"
            >
              <Flashcard front={currentCard.front} back={currentCard.back} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Response buttons */}
      <div className="w-full flex justify-center">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full max-w-md">
          <ResponseButton 
            label="Again" 
            onClick={() => recordResponse(ResponseQuality.AGAIN)} 
            colorClass="bg-gradient-to-r from-danger-500 to-danger-600" 
            hoverColor="rgba(239,68,68,0.2)"
            delay={0.1}
          />
          <ResponseButton 
            label="Hard" 
            onClick={() => recordResponse(ResponseQuality.HARD)} 
            colorClass="bg-gradient-to-r from-warning-500 to-warning-600" 
            hoverColor="rgba(245,158,11,0.2)"
            delay={0.2}
          />
          <ResponseButton 
            label="Good" 
            onClick={() => recordResponse(ResponseQuality.GOOD)} 
            colorClass="bg-gradient-to-r from-success-500 to-success-600" 
            hoverColor="rgba(34,197,94,0.2)"
            delay={0.3}
          />
          <ResponseButton 
            label="Easy" 
            onClick={() => recordResponse(ResponseQuality.EASY)} 
            colorClass="bg-gradient-to-r from-secondary-500 to-secondary-600" 
            hoverColor="rgba(59,130,246,0.2)"
            delay={0.4}
          />
        </div>
      </div>
    </div>
  );
};

export default ReviewPage; 