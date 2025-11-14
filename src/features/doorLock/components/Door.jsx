import { motion } from 'framer-motion';
import { useDoorLockContext } from '../DoorLockContext';
import { doorAnimations } from '../animations';

/**
 * Door Component
 * 
 * Renders the animated door that responds to lock state changes.
 * - Closed state: Full opacity, centered, no rotation
 * - Shake: Horizontal oscillation on wrong password
 * - Open state: Rotates and slides left to reveal success screen
 * 
 * Uses CSS-only visuals with gradients and shadows for a 3D door effect.
 */
export const Door = () => {
  const { isUnlocked, lastAttemptFailed } = useDoorLockContext();

  return (
    <motion.div
      className="relative w-80 h-96 perspective-1000"
      style={{ transformStyle: 'preserve-3d' }}
      animate={
        lastAttemptFailed
          ? doorAnimations.shake
          : isUnlocked
          ? doorAnimations.unlocked
          : doorAnimations.locked
      }
      role="img"
      aria-label={isUnlocked ? 'Door open' : 'Door closed'}
      aria-live="polite"
    >
      {/* Door Panel */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 rounded-lg shadow-2xl border-4 border-amber-950">
        {/* Door Frame Details */}
        <div className="absolute inset-2 border-2 border-amber-700/30 rounded"></div>
        
        {/* Door Panels (decorative) */}
        <div className="absolute top-8 left-8 right-8 h-32 border-2 border-amber-700/50 rounded bg-amber-900/30"></div>
        <div className="absolute bottom-8 left-8 right-8 h-32 border-2 border-amber-700/50 rounded bg-amber-900/30"></div>
        
        {/* Door Handle */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-8 h-3 bg-gradient-to-r from-yellow-600 to-yellow-700 rounded-full shadow-md"></div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-600 rounded-full shadow-lg"></div>
        
        {/* Lock Indicator */}
        <div className={`absolute left-1/2 -translate-x-1/2 top-6 flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-300 ${
          isUnlocked 
            ? 'bg-green-500/20 border border-green-500' 
            : 'bg-red-500/20 border border-red-500'
        }`}>
          <div className={`w-3 h-3 rounded-full ${
            isUnlocked ? 'bg-green-500' : 'bg-red-500'
          } animate-pulse`}></div>
          <span className={`text-xs font-bold ${
            isUnlocked ? 'text-green-500' : 'text-red-500'
          }`}>
            {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
          </span>
        </div>
        
        {/* Wood Grain Texture (CSS-only) */}
        <div className="absolute inset-0 opacity-20 rounded-lg" style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 10px,
            rgba(0,0,0,0.1) 10px,
            rgba(0,0,0,0.1) 11px
          )`
        }}></div>
      </div>
      
      {/* Door Shadow */}
      <div className="absolute -bottom-2 -left-2 -right-2 h-4 bg-black/40 rounded-full blur-xl"></div>
    </motion.div>
  );
};
