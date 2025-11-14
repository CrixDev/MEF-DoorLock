import { useState, useEffect, useCallback } from 'react';
import { DOOR_LOCK_CONFIG } from './config';

/**
 * Custom hook for managing door lock state, password verification, and security logic.
 * 
 * Features:
 * - Password verification with configurable attempts
 * - Automatic lockout after max failed attempts
 * - LocalStorage persistence for unlock state
 * - Countdown timer for lockout period
 * - Keyboard event handling
 * 
 * @returns {Object} Lock state and control functions
 */
export const useDoorLock = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState(0);
  const [showError, setShowError] = useState(false);
  const [lastAttemptFailed, setLastAttemptFailed] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    const savedUnlockState = localStorage.getItem(
      DOOR_LOCK_CONFIG.storageKeys.unlockState
    );
    const savedLockoutUntil = localStorage.getItem(
      DOOR_LOCK_CONFIG.storageKeys.lockoutUntil
    );
    const savedAttemptCount = localStorage.getItem(
      DOOR_LOCK_CONFIG.storageKeys.attemptCount
    );

    if (savedUnlockState === 'true') {
      setIsUnlocked(true);
    }

    if (savedAttemptCount) {
      setAttemptCount(parseInt(savedAttemptCount, 10));
    }

    // Check if still in lockout period
    if (savedLockoutUntil) {
      const lockoutUntil = parseInt(savedLockoutUntil, 10);
      const now = Date.now();
      
      if (lockoutUntil > now) {
        setIsLockedOut(true);
        setLockoutTimeRemaining(Math.ceil((lockoutUntil - now) / 1000));
      } else {
        // Lockout expired, clear it
        localStorage.removeItem(DOOR_LOCK_CONFIG.storageKeys.lockoutUntil);
        localStorage.removeItem(DOOR_LOCK_CONFIG.storageKeys.attemptCount);
        setAttemptCount(0);
      }
    }
  }, []);

  // Countdown timer for lockout
  useEffect(() => {
    if (!isLockedOut || lockoutTimeRemaining <= 0) return;

    const timer = setInterval(() => {
      setLockoutTimeRemaining((prev) => {
        if (prev <= 1) {
          // Lockout period ended
          setIsLockedOut(false);
          setAttemptCount(0);
          localStorage.removeItem(DOOR_LOCK_CONFIG.storageKeys.lockoutUntil);
          localStorage.removeItem(DOOR_LOCK_CONFIG.storageKeys.attemptCount);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLockedOut, lockoutTimeRemaining]);

  /**
   * Verify password and update state accordingly
   */
  const verifyPassword = useCallback((passwordToVerify = password) => {
    if (isLockedOut) return;

    const isCorrect = passwordToVerify === DOOR_LOCK_CONFIG.correctPassword;

    if (isCorrect) {
      // Success!
      setIsUnlocked(true);
      setShowError(false);
      setLastAttemptFailed(false);
      setAttemptCount(0);
      setPassword('');
      
      localStorage.setItem(DOOR_LOCK_CONFIG.storageKeys.unlockState, 'true');
      localStorage.removeItem(DOOR_LOCK_CONFIG.storageKeys.attemptCount);
    } else {
      // Failed attempt
      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);
      setShowError(true);
      setLastAttemptFailed(true);
      setPassword('');
      
      localStorage.setItem(
        DOOR_LOCK_CONFIG.storageKeys.attemptCount,
        newAttemptCount.toString()
      );

      // Check if max attempts reached
      if (newAttemptCount >= DOOR_LOCK_CONFIG.maxAttempts) {
        const lockoutUntil = Date.now() + DOOR_LOCK_CONFIG.lockoutDurationSeconds * 1000;
        setIsLockedOut(true);
        setLockoutTimeRemaining(DOOR_LOCK_CONFIG.lockoutDurationSeconds);
        
        localStorage.setItem(
          DOOR_LOCK_CONFIG.storageKeys.lockoutUntil,
          lockoutUntil.toString()
        );
      }

      // Clear error state after animation
      setTimeout(() => {
        setShowError(false);
        setLastAttemptFailed(false);
      }, 600);
    }
  }, [password, attemptCount, isLockedOut]);

  /**
   * Lock the door (reset to locked state)
   */
  const lockDoor = useCallback(() => {
    setIsUnlocked(false);
    setPassword('');
    setShowError(false);
    setLastAttemptFailed(false);
    localStorage.removeItem(DOOR_LOCK_CONFIG.storageKeys.unlockState);
  }, []);

  /**
   * Update password input
   */
  const updatePassword = useCallback((value) => {
    if (isLockedOut) return;
    // Only allow numeric input and max 4 digits
    if (/^\d*$/.test(value) && value.length <= DOOR_LOCK_CONFIG.pinLength) {
      setPassword(value);
    }
  }, [isLockedOut, password]);

  /**
   * Clear password input
   */
  const clearPassword = useCallback(() => {
    if (!isLockedOut) {
      setPassword('');
    }
  }, [isLockedOut]);

  /**
   * Handle keyboard events
   */
  const handleKeyPress = useCallback(
    (event) => {
      if (isLockedOut) return;

      if (event.key === 'Enter' && password.length === DOOR_LOCK_CONFIG.pinLength) {
        verifyPassword();
      } else if (event.key === 'Escape') {
        clearPassword();
      }
    },
    [password, isLockedOut, verifyPassword, clearPassword]
  );

  return {
    // State
    isUnlocked,
    password,
    attemptCount,
    isLockedOut,
    lockoutTimeRemaining,
    showError,
    lastAttemptFailed,
    remainingAttempts: Math.max(0, DOOR_LOCK_CONFIG.maxAttempts - attemptCount),
    
    // Actions
    verifyPassword,
    lockDoor,
    updatePassword,
    clearPassword,
    handleKeyPress,
  };
};
