# 🔐 Door Lock Feature Module

A complete, production-ready password-protected door simulation with polished animations built using React, Framer Motion, and Tailwind CSS.

## 📋 Features

- **Password Protection**: Configurable password with validation
- **Security Features**:
  - 5 max failed attempts before lockout
  - 30-second lockout period with countdown
  - Attempt counter with remaining attempts display
- **Smooth Animations**:
  - Door opening/closing with 3D perspective effect
  - Shake animation on incorrect password
  - Micro-interactions on keypad buttons
  - Confetti celebration on successful unlock
- **Accessibility**:
  - Full keyboard support (Enter to submit, Escape to clear)
  - ARIA labels and states
  - Focus management
  - Screen reader announcements
- **Persistence**: Unlock state saved to localStorage
- **Responsive**: Mobile and desktop friendly

## 🚀 Quick Start

### 1. Integration

Add the feature to your app:

```jsx
import { DoorLockFeature } from './features/doorLock/DoorLockFeature';

function App() {
  return <DoorLockFeature />;
}
```

### 2. Configuration

Create a `.env` file in your project root:

```env
VITE_DOOR_PASSWORD=YourCustomPassword
```

Or modify `src/features/doorLock/config.js` directly.

### 3. Default Password

**Default password**: `OpenSesame123`

## 📁 File Structure

```
src/features/doorLock/
├── components/
│   ├── Door.jsx              # Animated door component
│   ├── Keypad.jsx            # Password input keypad
│   └── SuccessScreen.jsx     # Unlock success screen
├── __tests__/
│   ├── useDoorLock.test.js   # Hook unit tests
│   └── DoorLockFeature.test.jsx  # Integration tests
├── config.js                 # Feature configuration
├── animations.js             # Framer Motion animations
├── useDoorLock.js           # Custom hook for lock logic
├── DoorLockContext.jsx      # React Context provider
├── DoorLockFeature.jsx      # Main feature component
└── README.md                # This file
```

## 🎨 Animations

### Door Opening (1.2s)
- **Phase 1** (0-0.4s): 15° Y-axis rotation (perspective effect)
- **Phase 2** (0.4-1.2s): Slide left 320px revealing success screen
- **Spring**: stiffness=80, damping=20 (smooth, realistic)

### Door Shake (0.6s)
- 4 oscillations on X-axis: 0 → -10px → 10px → -5px → 0
- Triggered on incorrect password

### Keypad Interactions
- Button press: Scale 0.9 → 1 (0.1s)
- Error state: Red background pulse
- Lockout state: Opacity 0.5, scale 0.98

### Celebration (1.5s)
- Success screen reveal with scale
- Confetti particles (20 particles, random trajectories)
- Glow pulse effect

## ⚙️ Configuration

Edit `config.js`:

```javascript
export const DOOR_LOCK_CONFIG = {
  correctPassword: 'OpenSesame123',
  maxAttempts: 5,
  lockoutDurationSeconds: 30,
  
  animations: {
    doorOpen: 1.2,
    doorClose: 1.0,
    shake: 0.6,
    celebration: 1.5,
  },
};
```

## 🧪 Testing

### Unit Tests (Jest + React Testing Library)

```bash
# Run all unit tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

**Test Coverage**:
- Password verification (correct/incorrect)
- Attempt counting and lockout logic
- LocalStorage persistence
- Keyboard event handling
- Component rendering and interactions

### E2E Tests (Playwright)

```bash
# Run E2E tests
npm run e2e

# Interactive UI mode
npm run e2e:ui

# Headed mode (see browser)
npm run e2e:headed
```

**E2E Test Scenarios**:
- Initial locked state
- Correct password unlock flow
- Error handling on wrong password
- Lockout after 5 failed attempts
- State persistence after refresh
- Lock again functionality

## ♿ Accessibility

- **Keyboard Navigation**:
  - `Tab` / `Shift+Tab`: Move focus
  - `Enter`: Submit password
  - `Escape`: Clear password input
- **Screen Readers**:
  - ARIA labels on all interactive elements
  - Live regions for state changes
  - Descriptive error messages
- **Visual**:
  - High contrast colors (WCAG AA compliant)
  - Clear focus indicators
  - Status indicators (locked/unlocked)

## 🔒 Security Features

1. **Brute Force Protection**:
   - Maximum 5 attempts
   - 30-second lockout after max attempts
   - Countdown timer display

2. **State Persistence**:
   - Unlock state saved to localStorage
   - Lockout state persists across refreshes
   - Attempt counter tracked

3. **Password Requirements**:
   - Minimum 4 characters
   - Maximum 20 characters
   - Alphanumeric support

## 🎯 Usage Examples

### Basic Integration

```jsx
import { DoorLockFeature } from './features/doorLock/DoorLockFeature';

function App() {
  return <DoorLockFeature />;
}
```

### Custom Wrapper

```jsx
import { DoorLockProvider, useDoorLockContext } from './features/doorLock/DoorLockContext';

function CustomApp() {
  return (
    <DoorLockProvider>
      <YourCustomLayout />
    </DoorLockProvider>
  );
}
```

### Using the Hook Directly

```jsx
import { useDoorLockContext } from './features/doorLock/DoorLockContext';

function CustomComponent() {
  const { 
    isUnlocked, 
    verifyPassword, 
    remainingAttempts 
  } = useDoorLockContext();
  
  // Your custom logic
}
```

## 📱 Responsive Design

- **Desktop**: Side-by-side door and keypad layout
- **Mobile**: Stacked vertical layout
- **Touch-friendly**: Large tap targets (min 44x44px)
- **Flexible**: Adapts to container size

## 🐛 Troubleshooting

### Tests Failing

**Issue**: Jest can't transform JSX  
**Solution**: Ensure `babel.config.cjs` is in root directory

**Issue**: Framer Motion errors in tests  
**Solution**: Check `jest.setup.js` has matchMedia mock

### Animations Not Working

**Issue**: Door doesn't animate  
**Solution**: Verify Framer Motion is installed: `npm install framer-motion`

### LocalStorage Not Persisting

**Issue**: State resets on refresh  
**Solution**: Check browser allows localStorage (not in incognito mode)

## 🔧 Maintenance Notes

### Adding New Animations

1. Define animation in `animations.js`
2. Document timeline and spring values
3. Apply to component using `motion` component
4. Test performance (aim for 60fps)

### Modifying Security Rules

1. Update `config.js` values
2. Update tests to match new rules
3. Update README documentation
4. Test lockout behavior thoroughly

## 📦 Dependencies

- **react** (^19.2.0): Core library
- **framer-motion** (^12.23.24): Animations
- **tailwindcss** (^4.1.17): Styling

## 📄 License

This feature module is part of your project and inherits its license.

## 🤝 Contributing

When modifying this feature:

1. Update tests to cover changes
2. Document animation timelines
3. Maintain accessibility standards
4. Test on mobile and desktop
5. Update this README

## 📞 Support

For issues or questions about this feature module, refer to the main project documentation or contact the development team.

---

**Built with** ❤️ **using React, Framer Motion, and Tailwind CSS**
