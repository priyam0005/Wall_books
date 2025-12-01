import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const BlurTransition = ({ children }) => {
  const location = useLocation();

  const blurVariants = {
    initial: {
      opacity: 0,
      filter: 'blur(10px)',
    },
    animate: {
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      filter: 'blur(10px)',
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={blurVariants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
