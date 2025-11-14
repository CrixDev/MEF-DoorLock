/**
 * Door Lock Feature Configuration
 * 
 * Central configuration for password protection, security rules, and behavior settings.
 * Password can be overridden via environment variables for production deployments.
 */

export const DOOR_LOCK_CONFIG = {
  // Password settings
  correctPassword: import.meta.env.VITE_DOOR_PASSWORD || '8765',
  
  // Security settings
  maxAttempts: 5,
  lockoutDurationSeconds: 30,
  
  // LocalStorage keys
  storageKeys: {
    unlockState: 'doorLock_unlockState',
    lockoutUntil: 'doorLock_lockoutUntil',
    attemptCount: 'doorLock_attemptCount',
  },
  
  // Animation durations (in seconds)
  animations: {
    doorOpen: 1.2,
    doorClose: 1.0,
    shake: 0.6,
    celebration: 1.5,
    keypadPress: 0.1,
  },
  
  // UI settings
  pinLength: 4, // Exactly 4 digits required
};
