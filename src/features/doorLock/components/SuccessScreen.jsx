import { motion } from 'framer-motion';
import { useDoorLockContext } from '../DoorLockContext';
import { successAnimations } from '../animations';
import { useEffect, useState } from 'react';

/**
 * Success Screen Component
 * 
 * Displayed when door is unlocked. Features:
 * - Celebration animation with glow effect
 * - Confetti particles
 * - Lock button to reset
 * - Smooth reveal animation
 */
export const SuccessScreen = () => {
  const { lockDoor } = useDoorLockContext();
  const [confetti, setConfetti] = useState([]);

  // Generate confetti particles on mount
  useEffect(() => {
    const particles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 400 - 200,
      delay: Math.random() * 0.5,
      color: ['#fbbf24', '#f59e0b', '#3b82f6', '#10b981', '#ef4444'][Math.floor(Math.random() * 5)],
    }));
    setConfetti(particles);
  }, []);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="region"
      aria-label="Access granted screen"
      aria-live="polite"
    >
      {/* Background Glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-transparent rounded-xl"
        animate={successAnimations.celebration}
      />

      {/* Confetti Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full"
            style={{ backgroundColor: particle.color }}
            initial={{ y: 0, x: 0, opacity: 0, rotate: 0 }}
            animate={{
              y: [0, -150 + Math.random() * 50, 300],
              x: [0, particle.x],
              rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: particle.delay,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Success Content */}
      <motion.div
        className="relative z-10 text-center space-y-8"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Success Icon */}
        <motion.div
          className="text-8xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 0.6,
            ease: 'easeInOut',
          }}
        >
          ✅
        </motion.div>

        {/* Success Message */}
        <div>
          <motion.h1
            className="text-4xl font-bold text-green-500 mb-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Access Granted!
          </motion.h1>
          <motion.p
            className="text-xl text-slate-300"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Welcome inside! 🎉
          </motion.p>
        </div>

        {/* Lock Button */}
        <motion.button
          onClick={lockDoor}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors shadow-lg"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          aria-label="Lock door again"
        >
          🔒 Lock Door Again
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
