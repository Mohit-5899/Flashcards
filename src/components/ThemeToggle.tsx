import React from 'react';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggle }) => {
  return (
    <motion.button
      onClick={toggle}
      aria-label="Toggle Theme"
      className="relative flex items-center px-2 py-1 rounded-full
                bg-white dark:bg-dark-700
                border border-primary-100 dark:border-dark-500
                shadow-sm hover:shadow-md
                transition-all duration-300"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'dark' ? 360 : 0,
          opacity: theme === 'dark' ? 0 : 1
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`absolute left-2 flex items-center justify-center ${theme === 'dark' ? 'opacity-0' : 'opacity-100'}`}
      >
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="img"
          aria-label="sun"
          className="text-warning-500 text-sm"
        >
          ☀️
        </motion.span>
      </motion.div>
      
      <motion.div
        layout
        className="relative w-10 h-5 rounded-full bg-primary-200 dark:bg-dark-600"
      >
        <motion.div
          className="absolute w-3.5 h-3.5 rounded-full shadow-md top-[3px]"
          animate={{ 
            x: theme === 'dark' ? 22 : 3,
            backgroundColor: theme === 'dark' ? '#3b82f6' : '#0ea5e9',
            boxShadow: theme === 'dark' 
              ? '0 0 8px 1px rgba(59, 130, 246, 0.7)' 
              : '0 0 8px 1px rgba(14, 165, 233, 0.7)'
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 500, 
            damping: 30
          }}
        />
      </motion.div>
      
      <motion.div
        initial={false}
        animate={{
          rotate: theme === 'dark' ? 0 : -360,
          opacity: theme === 'dark' ? 1 : 0
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className={`absolute right-2 flex items-center justify-center ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}
      >
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="img" 
          aria-label="moon"
          className="text-warning-400 text-sm"
        >
          🌙
        </motion.span>
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle; 