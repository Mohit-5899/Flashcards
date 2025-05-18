import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="bg-white dark:bg-accent-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-300 mb-2">
              Reset All Data?
            </h3>
            
            <p className="text-accent-600 dark:text-accent-300 mb-6">
              This will reset all cards to their initial state and delete all your progress. 
              This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-white dark:bg-accent-700 text-accent-700 dark:text-white 
                           border border-accent-300 dark:border-accent-600 rounded-lg"
                onClick={onClose}
              >
                Cancel
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-danger-500 text-white rounded-lg"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                Reset Data
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResetConfirmModal; 