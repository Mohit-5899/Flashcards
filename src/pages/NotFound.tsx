import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-[70vh] space-y-6">
    <motion.div
      className="text-center p-8 rounded-xl bg-white dark:bg-accent-800 shadow-soft-xl border border-primary-100 dark:border-primary-800
                max-w-md w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2 
        className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-400 dark:to-secondary-400"
        animate={{ 
          opacity: [0.7, 1, 0.7],
          scale: [1, 1.03, 1],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        404
      </motion.h2>
      <p className="text-lg text-accent-600 dark:text-accent-300 mb-6">Page not found.</p>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link 
          to="/" 
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium shadow-md inline-block
                    hover:shadow-lg transition-all duration-300"
        >
          Go Home
        </Link>
      </motion.div>
    </motion.div>
  </div>
);

export default NotFound; 