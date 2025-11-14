import { renderHook, act } from '@testing-library/react';
import { useDoorLock } from '../useDoorLock';
import { DOOR_LOCK_CONFIG } from '../config';

/**
 * Tests for useDoorLock hook
 * 
 * Coverage:
 * - Password verification (correct/incorrect)
 * - Attempt counting and lockout logic
 * - LocalStorage persistence
 * - Lockout countdown timer
 * - Password input validation
 */

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useDoorLock', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Password Verification', () => {
    it('should unlock with correct password', () => {
      const { result } = renderHook(() => useDoorLock());

      // Set correct password
      act(() => {
        result.current.updatePassword(DOOR_LOCK_CONFIG.correctPassword);
      });

      expect(result.current.password).toBe(DOOR_LOCK_CONFIG.correctPassword);

      // Verify password
      act(() => {
        result.current.verifyPassword();
      });

      expect(result.current.isUnlocked).toBe(true);
      expect(result.current.password).toBe(''); // Should clear password
      expect(result.current.showError).toBe(false);
    });

    it('should show error on incorrect password', () => {
      const { result } = renderHook(() => useDoorLock());

      act(() => {
        result.current.updatePassword('WrongPassword');
        result.current.verifyPassword();
      });

      expect(result.current.isUnlocked).toBe(false);
      expect(result.current.showError).toBe(true);
      expect(result.current.attemptCount).toBe(1);
      expect(result.current.password).toBe(''); // Should clear password
    });

    it('should persist unlock state in localStorage', () => {
      const { result } = renderHook(() => useDoorLock());

      act(() => {
        result.current.updatePassword(DOOR_LOCK_CONFIG.correctPassword);
        result.current.verifyPassword();
      });

      expect(localStorage.getItem(DOOR_LOCK_CONFIG.storageKeys.unlockState)).toBe('true');
    });
  });

  describe('Attempt Counting and Lockout', () => {
    it('should increment attempt count on wrong password', () => {
      const { result } = renderHook(() => useDoorLock());

      for (let i = 1; i <= 3; i++) {
        act(() => {
          result.current.updatePassword('wrong');
          result.current.verifyPassword();
        });

        expect(result.current.attemptCount).toBe(i);
        expect(result.current.remainingAttempts).toBe(DOOR_LOCK_CONFIG.maxAttempts - i);
      }
    });

    it('should trigger lockout after max attempts', () => {
      const { result } = renderHook(() => useDoorLock());

      // Make max failed attempts
      for (let i = 0; i < DOOR_LOCK_CONFIG.maxAttempts; i++) {
        act(() => {
          result.current.updatePassword('wrong');
          result.current.verifyPassword();
        });
      }

      expect(result.current.isLockedOut).toBe(true);
      expect(result.current.lockoutTimeRemaining).toBe(DOOR_LOCK_CONFIG.lockoutDurationSeconds);
    });

    it('should countdown lockout timer', () => {
      const { result } = renderHook(() => useDoorLock());

      // Trigger lockout
      for (let i = 0; i < DOOR_LOCK_CONFIG.maxAttempts; i++) {
        act(() => {
          result.current.updatePassword('wrong');
          result.current.verifyPassword();
        });
      }

      expect(result.current.lockoutTimeRemaining).toBe(30);

      // Advance timer by 5 seconds
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(result.current.lockoutTimeRemaining).toBe(25);

      // Advance to end of lockout
      act(() => {
        jest.advanceTimersByTime(25000);
      });

      expect(result.current.isLockedOut).toBe(false);
      expect(result.current.attemptCount).toBe(0);
    });

    it('should prevent password entry during lockout', () => {
      const { result } = renderHook(() => useDoorLock());

      // Trigger lockout
      for (let i = 0; i < DOOR_LOCK_CONFIG.maxAttempts; i++) {
        act(() => {
          result.current.updatePassword('wrong');
          result.current.verifyPassword();
        });
      }

      act(() => {
        result.current.updatePassword('test');
      });

      expect(result.current.password).toBe('');
    });
  });

  describe('Lock/Unlock Actions', () => {
    it('should lock door and clear state', () => {
      const { result } = renderHook(() => useDoorLock());

      // First unlock
      act(() => {
        result.current.updatePassword(DOOR_LOCK_CONFIG.correctPassword);
        result.current.verifyPassword();
      });

      expect(result.current.isUnlocked).toBe(true);

      // Then lock
      act(() => {
        result.current.lockDoor();
      });

      expect(result.current.isUnlocked).toBe(false);
      expect(result.current.password).toBe('');
      expect(localStorage.getItem(DOOR_LOCK_CONFIG.storageKeys.unlockState)).toBeNull();
    });

    it('should clear password input', () => {
      const { result } = renderHook(() => useDoorLock());

      act(() => {
        result.current.updatePassword('test123');
      });

      expect(result.current.password).toBe('test123');

      act(() => {
        result.current.clearPassword();
      });

      expect(result.current.password).toBe('');
    });
  });

  describe('PIN Input Validation', () => {
    it('should limit PIN to 4 digits', () => {
      const { result } = renderHook(() => useDoorLock());
      const longPin = '123456789';

      act(() => {
        result.current.updatePassword(longPin);
      });

      expect(result.current.password.length).toBeLessThanOrEqual(
        DOOR_LOCK_CONFIG.pinLength
      );
    });

    it('should only accept numeric input', () => {
      const { result } = renderHook(() => useDoorLock());

      act(() => {
        result.current.updatePassword('12ab34');
      });

      expect(result.current.password).toBe('');
    });

    it('should accept valid numeric input', () => {
      const { result } = renderHook(() => useDoorLock());

      act(() => {
        result.current.updatePassword('1234');
      });

      expect(result.current.password).toBe('1234');
    });
  });

  describe('Keyboard Handling', () => {
    it('should submit on Enter key', () => {
      const { result } = renderHook(() => useDoorLock());

      act(() => {
        result.current.updatePassword(DOOR_LOCK_CONFIG.correctPassword);
        result.current.handleKeyPress({ key: 'Enter' });
      });

      expect(result.current.isUnlocked).toBe(true);
    });

    it('should clear on Escape key', () => {
      const { result } = renderHook(() => useDoorLock());

      act(() => {
        result.current.updatePassword('test');
        result.current.handleKeyPress({ key: 'Escape' });
      });

      expect(result.current.password).toBe('');
    });
  });
});
