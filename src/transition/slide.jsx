import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const CrossfadeTransition = ({ children }) => {
  const location = useLocation();

  const crossfadeVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: 'easeInOut',
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={crossfadeVariants}
        className="min-h-screen bg-black"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
