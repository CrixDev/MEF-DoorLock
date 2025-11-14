/**
 * Framer Motion Animation Configurations
 * 
 * Animation timeline and spring configurations:
 * 
 * Door Opening (1.2s):
 *   - Phase 1 (0-0.4s): Door rotates 15deg on Y-axis (perspective effect)
 *   - Phase 2 (0.4-1.2s): Door translates left revealing success screen
 *   - Spring: type="spring", stiffness=80, damping=20 (smooth, realistic)
 * 
 * Door Closing (1.0s):
 *   - Reverse of opening, slightly faster
 *   - Spring: stiffness=100, damping=22
 * 
 * Shake Animation (0.6s):
 *   - 4 oscillations on X-axis: 0 → -10px → 10px → -5px → 0
 *   - Easing: "easeInOut"
 * 
 * Celebration (1.5s):
 *   - Scale pulse: 1 → 1.05 → 1
 *   - Opacity fade-in with particles
 */

export const doorAnimations = {
  // Door locked state (initial)
  locked: {
    rotateY: 0,
    x: 0,
    scale: 1,
    opacity: 1,
  },
  
  // Door unlocked state (open)
  unlocked: {
    rotateY: -15,
    x: -320,
    scale: 1,
    opacity: 0.3,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 20,
      duration: 1.2,
    },
  },
  
  // Shake animation on wrong password
  shake: {
    x: [0, -10, 10, -10, 10, -5, 5, 0],
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
};

export const keypadAnimations = {
  // Individual key press micro-interaction
  keyPress: {
    scale: [1, 0.9, 1],
    transition: {
      duration: 0.1,
      ease: 'easeInOut',
    },
  },
  
  // Error state for entire keypad
  error: {
    backgroundColor: ['#ef4444', '#dc2626', '#ef4444'],
    borderColor: ['#dc2626', '#b91c1c', '#dc2626'],
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
  
  // Lockout state
  lockedOut: {
    opacity: 0.5,
    scale: 0.98,
    transition: {
      duration: 0.3,
    },
  },
};

export const successAnimations = {
  // Success screen reveal
  reveal: {
    opacity: [0, 1],
    scale: [0.8, 1],
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  
  // Celebration glow pulse
  celebration: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  
  // Confetti particle
  confetti: {
    y: [0, -100, 200],
    x: [-50, 50],
    rotate: [0, 360],
    opacity: [0, 1, 0],
    transition: {
      duration: 2,
      ease: 'easeOut',
    },
  },
};

export const containerAnimations = {
  // Stagger children animations
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
