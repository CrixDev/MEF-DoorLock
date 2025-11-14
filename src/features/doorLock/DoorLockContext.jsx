import { createContext, useContext } from 'react';
import { useDoorLock } from './useDoorLock';

/**
 * Context for Door Lock state management
 * 
 * Provides global access to lock state and actions throughout the door lock feature.
 * This allows child components (Door, Keypad, SuccessScreen) to access shared state
 * without prop drilling.
 */
const DoorLockContext = createContext(null);

/**
 * Provider component that wraps the door lock feature
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export const DoorLockProvider = ({ children }) => {
  const lockState = useDoorLock();

  return (
    <DoorLockContext.Provider value={lockState}>
      {children}
    </DoorLockContext.Provider>
  );
};

/**
 * Hook to access door lock context
 * 
 * @throws {Error} If used outside of DoorLockProvider
 * @returns {Object} Lock state and actions from useDoorLock
 */
export const useDoorLockContext = () => {
  const context = useContext(DoorLockContext);
  
  if (!context) {
    throw new Error('useDoorLockContext must be used within DoorLockProvider');
  }
  
  return context;
};
