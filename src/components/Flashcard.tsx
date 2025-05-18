import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FlashcardProps {
  front: string;
  back: string;
  className?: string;
}

/**
 * A single flashcard with animated 3-D flip effect.
 * – Click/tap to flip between front and back.
 * – Uses Tailwind CSS utility classes and Framer Motion for smooth animation.
 */
const Flashcard: React.FC<FlashcardProps> = ({ front, back, className = '' }) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => setFlipped((prev: boolean) => !prev);

  return (
    <div
      className={`w-full h-full cursor-pointer perspective-1000 ${className}`}
      onClick={handleFlip}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ 
          rotateY: flipped ? 180 : 0,
          scale: flipped ? [1, 1.03, 1] : [1, 1.03, 1]
        }}
        transition={{ 
          rotateY: { duration: 0.7, ease: [0.4, 0.0, 0.2, 1] },
          scale: { duration: 0.7, times: [0, 0.5, 1] }
        }}
        style={{ 
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front Side */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center p-8 rounded-2xl backface-hidden
                    bg-gradient-to-br from-white via-primary-50 to-white dark:from-dark-600 dark:via-primary-900/10 dark:to-dark-700
                    border border-primary-100 dark:border-dark-500
                    shadow-[0_10px_25px_-5px_rgba(14,165,233,0.15)] dark:shadow-[0_10px_25px_-5px_rgba(3,105,161,0.3)]"
        >
          <span className="text-3xl font-bold text-primary-700 dark:text-primary-300 text-center">
            {front}
          </span>
          <motion.span 
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mt-6 text-xs text-primary-500/80 dark:text-primary-400/80"
          >
            Tap to flip
          </motion.span>
        </motion.div>

        {/* Back Side */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center p-8 rounded-2xl backface-hidden
                    bg-gradient-to-br from-white via-secondary-50 to-white dark:from-dark-600 dark:via-secondary-900/10 dark:to-dark-700
                    border border-secondary-100 dark:border-dark-500
                    shadow-[0_10px_25px_-5px_rgba(59,130,246,0.15)] dark:shadow-[0_10px_25px_-5px_rgba(29,78,216,0.3)]"
          style={{
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
          }}
        >
          <span className="text-3xl font-bold text-secondary-700 dark:text-secondary-300 text-center">
            {back}
          </span>
          <motion.span 
            initial={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mt-6 text-xs text-secondary-500/80 dark:text-secondary-400/80"
          >
            Tap to flip back
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Flashcard; 