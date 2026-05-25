import { useEffect } from 'react';
import { motion } from 'framer-motion';
import './style.css';

const IntroAnimation = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete && onComplete();
    }, 3200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="intro-overlay">
      <motion.img
        src="/intro.png"
        alt="Foodyfy"
        className="intro-brand-img"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />

      <motion.div
        className="intro-progress-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <motion.div
          className="intro-progress"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.8, duration: 2.2 }}
          onAnimationComplete={onComplete}
        />
      </motion.div>

      <div className="intro-glow intro-glow-1" />
      <div className="intro-glow intro-glow-2" />
    </div>
  );
};

export default IntroAnimation;
