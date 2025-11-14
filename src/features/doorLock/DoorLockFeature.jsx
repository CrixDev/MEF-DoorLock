import { DoorLockProvider, useDoorLockContext } from './DoorLockContext';
import { Door } from './components/Door';
import { Keypad } from './components/Keypad';
import { SuccessScreen } from './components/SuccessScreen';
import { Header } from './components/Header';

/**
 * Main Door Lock Feature Component (Internal)
 * 
 * Orchestrates the layout and composition of all door lock subcomponents.
 * Handles responsive layout for mobile/desktop.
 */
const DoorLockFeatureContent = () => {
  const { isUnlocked } = useDoorLockContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-7xl mx-auto">
          {/* Door Section */}
          <div className="relative flex-shrink-0">
            <Door />
            
            {/* Success Screen (revealed when unlocked) */}
            {isUnlocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <SuccessScreen />
              </div>
            )}
          </div>

          {/* Keypad Section */}
          {!isUnlocked && (
            <div className="flex-shrink-0">
              <Keypad />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Door Lock Feature (Main Export)
 * 
 * Wraps the feature content with the context provider.
 * Use this component to integrate the door lock feature into your app.
 * 
 * @example
 * ```jsx
 * import { DoorLockFeature } from './features/doorLock/DoorLockFeature';
 * 
 * function App() {
 *   return <DoorLockFeature />;
 * }
 * ```
 */
export const DoorLockFeature = () => {
  return (
    <DoorLockProvider>
      <DoorLockFeatureContent />
    </DoorLockProvider>
  );
};
