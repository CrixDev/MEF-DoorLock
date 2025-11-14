import { motion } from 'framer-motion';
import { useDoorLockContext } from '../DoorLockContext';
import { keypadAnimations } from '../animations';
import { useEffect } from 'react';
import { DOOR_LOCK_CONFIG } from '../config';

/**
 * Keypad Component
 * 
 * Phone-style numeric keypad (0-9) with:
 * - Visual PIN display (4 digits, masked)
 * - Numeric buttons in phone layout (1-9, then 0)
 * - Auto-submit when 4 digits entered
 * - Clear button
 * - Error state visualization
 * - Lockout countdown display
 * - Attempt counter
 * 
 * Accessibility:
 * - Proper ARIA labels and roles
 * - Keyboard number support
 * - Screen reader announcements for state changes
 */
export const Keypad = () => {
  const {
    password,
    updatePassword,
    verifyPassword,
    clearPassword,
    handleKeyPress,
    showError,
    isLockedOut,
    lockoutTimeRemaining,
    attemptCount,
    remainingAttempts,
  } = useDoorLockContext();

  // Handle number button click
  const handleNumberClick = (num) => {
    if (isLockedOut || password.length >= DOOR_LOCK_CONFIG.pinLength) return;
    
    const newPassword = password + num;
    updatePassword(newPassword);
    
    // Auto-submit when 4 digits entered
    if (newPassword.length === DOOR_LOCK_CONFIG.pinLength) {
      setTimeout(() => verifyPassword(newPassword), 100);
    }
  };

  // Handle backspace
  const handleBackspace = () => {
    if (isLockedOut || password.length === 0) return;
    updatePassword(password.slice(0, -1));
  };

  // Keyboard event listener for numeric keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLockedOut) return;
      
      // Handle numeric keys (0-9)
      if (/^[0-9]$/.test(e.key)) {
        handleNumberClick(e.key);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleBackspace();
      } else if (e.key === 'Enter' && password.length === DOOR_LOCK_CONFIG.pinLength) {
        verifyPassword(password);
      } else if (e.key === 'Escape') {
        clearPassword();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [password, isLockedOut, verifyPassword, clearPassword, handleNumberClick, handleBackspace]);

  // Numeric buttons layout (phone-style)
  const numericButtons = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  return (
    <motion.div
      className="bg-slate-800 rounded-xl shadow-2xl p-6 w-80"
      animate={showError ? keypadAnimations.error : isLockedOut ? keypadAnimations.lockedOut : {}}
      role="form"
      aria-label="Numeric PIN keypad"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          🔐 PIN de Seguridad
        </h2>
        <p className="text-slate-400 text-sm">
          {isLockedOut 
            ? 'Acceso Denegado - Espere' 
            : 'Ingrese PIN de 4 Dígitos'}
        </p>
      </div>

      {/* Lockout Warning */}
      {isLockedOut && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-center"
          role="alert"
          aria-live="assertive"
        >
          <div className="text-red-500 font-bold text-lg mb-1">
            🚫 BLOQUEADO
          </div>
          <div className="text-red-400 text-sm">
            Demasiados intentos fallidos
          </div>
          <div className="text-white text-2xl font-mono mt-2">
            {Math.floor(lockoutTimeRemaining / 60)}:{String(lockoutTimeRemaining % 60).padStart(2, '0')}
          </div>
        </motion.div>
      )}

      {/* PIN Display */}
      <div className={`mb-6 p-4 bg-slate-900 rounded-lg border-2 transition-colors ${
        showError ? 'border-red-500' : 'border-slate-700'
      }`}>
        <div className="flex justify-center gap-3" aria-label="PIN display">
          {[0, 1, 2, 3].map((index) => (
            <motion.div
              key={index}
              className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold transition-colors ${
                password.length > index
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-slate-500'
              }`}
              animate={password.length === index + 1 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.2 }}
            >
              {password.length > index ? '●' : ''}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {showError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-red-500 text-sm text-center font-semibold mb-4"
          role="alert"
        >
          ❌ PIN Incorrecto
        </motion.div>
      )}

      {/* Attempt Counter */}
      {attemptCount > 0 && !isLockedOut && (
        <div className="text-orange-400 text-xs text-center mb-4">
          ⚠️ {remainingAttempts} intento{remainingAttempts !== 1 ? 's' : ''} restante{remainingAttempts !== 1 ? 's' : ''}
        </div>
      )}

      {/* Numeric Keypad */}
      <div className="space-y-3 mb-4">
        {numericButtons.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-3 justify-center">
            {row.map((num) => (
              <motion.button
                key={num}
                onClick={() => handleNumberClick(num.toString())}
                disabled={isLockedOut}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-20 h-20 bg-black text-white text-3xl font-bold rounded-2xl shadow-lg hover:bg-gray-900 active:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label={`Número ${num}`}
              >
                {num}
              </motion.button>
            ))}
          </div>
        ))}
        
        {/* Bottom Row: 0 button centered */}
        <div className="flex gap-3 justify-center">
          <motion.button
            onClick={() => handleNumberClick('0')}
            disabled={isLockedOut}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-20 h-20 bg-black text-white text-3xl font-bold rounded-2xl shadow-lg hover:bg-gray-900 active:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Número 0"
          >
            0
          </motion.button>
        </div>
      </div>

      {/* Clear Button */}
      <motion.button
        onClick={clearPassword}
        disabled={isLockedOut || password.length === 0}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Borrar PIN"
      >
        ← Borrar
      </motion.button>

      {/* Keyboard Hints */}
      <div className="mt-4 text-slate-500 text-xs text-center">
        ⌨️ Puedes usar el teclado numérico
      </div>
    </motion.div>
  );
};
