# 🔐 Door Lock Feature - Setup & Integration Guide

Complete installation and testing guide for the password-protected door simulation feature.

## 📦 Installation

### 1. Install Dependencies

The feature requires additional testing dependencies. Run:

```bash
npm install
```

This will install:
- **Testing**: Jest, React Testing Library, Playwright
- **Babel**: For JSX transformation in tests
- **Utilities**: Identity-obj-proxy for CSS mocking

### 2. Verify Installation

Check that all dependencies installed correctly:

```bash
npm list framer-motion react react-dom
npm list --dev @testing-library/react jest @playwright/test
```

## 🚀 Running the Feature

### Development Server

```bash
npm run dev
```

Then open your browser to `http://localhost:5173`

**Default Password**: `OpenSesame123`

### Preview Build

```bash
npm run build
npm run preview
```

## ✅ Testing

### Unit Tests (Jest + React Testing Library)

Run all unit tests:

```bash
npm test
```

Watch mode (automatically re-runs on file changes):

```bash
npm run test:watch
```

With coverage report:

```bash
npm run test:coverage
```

**Expected Results**:
- ✅ Password verification tests
- ✅ Lockout logic tests
- ✅ LocalStorage persistence tests
- ✅ Component integration tests
- ✅ Keyboard handling tests

### E2E Tests (Playwright)

Install Playwright browsers (first time only):

```bash
npx playwright install
```

Run E2E tests:

```bash
npm run e2e
```

Interactive UI mode (recommended for debugging):

```bash
npm run e2e:ui
```

Run with visible browser:

```bash
npm run e2e:headed
```

**Expected Results**:
- ✅ Door unlocks with correct password
- ✅ Error shown on wrong password
- ✅ Lockout after 5 failed attempts
- ✅ State persists after page refresh
- ✅ Keyboard shortcuts work (Enter, Escape)

## 🎯 Manual Testing Checklist

### Basic Functionality
- [ ] Door appears closed on load with "LOCKED" indicator
- [ ] Keypad is visible and focusable
- [ ] Password input accepts text
- [ ] "Clear" button clears password
- [ ] "Unlock" button is disabled when password < 4 chars

### Correct Password Flow
- [ ] Enter `OpenSesame123`
- [ ] Press Enter or click "Unlock"
- [ ] Door animates open (rotation + slide)
- [ ] Success screen appears with "Access Granted!"
- [ ] Confetti particles appear
- [ ] "Lock Door Again" button is visible
- [ ] Clicking lock button closes door

### Incorrect Password Flow
- [ ] Enter wrong password (e.g., "wrong")
- [ ] Submit
- [ ] Door shakes horizontally
- [ ] Error message "❌ Incorrect Password" appears
- [ ] Password field clears
- [ ] Attempt counter shows "⚠️ 4 attempts remaining"

### Lockout Behavior
- [ ] Make 5 failed password attempts
- [ ] "🚫 LOCKED OUT" message appears
- [ ] Countdown timer shows "0:30" and decrements
- [ ] Keypad is disabled (grayed out)
- [ ] Cannot enter password during lockout
- [ ] After 30 seconds, keypad re-enables
- [ ] Attempt counter resets

### Keyboard Support
- [ ] Focus password input with Tab
- [ ] Type password
- [ ] Press `Enter` to submit
- [ ] Press `Escape` to clear password
- [ ] Focus moves correctly between elements

### Accessibility
- [ ] Screen reader announces locked/unlocked state
- [ ] ARIA labels are present
- [ ] Focus indicators are visible
- [ ] Color contrast is sufficient
- [ ] All interactive elements are keyboard accessible

### Responsive Design
- [ ] Desktop: Door and keypad side-by-side
- [ ] Mobile: Door and keypad stacked vertically
- [ ] All buttons are tap-friendly (44x44px minimum)
- [ ] Animations work smoothly on mobile

### Persistence
- [ ] Unlock the door
- [ ] Refresh the page (F5)
- [ ] Door remains unlocked
- [ ] Lock the door
- [ ] Refresh the page
- [ ] Door is locked again

## 🔧 Configuration

### Change Password

**Option 1**: Environment Variable (recommended for production)

Create `.env` file in project root:

```env
VITE_DOOR_PASSWORD=YourNewPassword123
```

**Option 2**: Edit Config File

Edit `src/features/doorLock/config.js`:

```javascript
export const DOOR_LOCK_CONFIG = {
  correctPassword: 'YourNewPassword123',
  // ...
};
```

### Adjust Security Settings

Edit `src/features/doorLock/config.js`:

```javascript
export const DOOR_LOCK_CONFIG = {
  maxAttempts: 3,              // Default: 5
  lockoutDurationSeconds: 60,  // Default: 30
  // ...
};
```

**Note**: After changing security settings, update the tests to match!

### Customize Animations

Edit `src/features/doorLock/animations.js`:

```javascript
export const doorAnimations = {
  unlocked: {
    rotateY: -15,  // Rotation angle
    x: -320,       // Slide distance
    // Adjust spring values:
    transition: {
      stiffness: 100,  // Higher = faster
      damping: 25,     // Higher = less bounce
    },
  },
};
```

## 🐛 Troubleshooting

### Issue: Tests fail with "Cannot find module"

**Solution**: Install missing dependencies

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### Issue: E2E tests timeout

**Solution**: Ensure dev server is running

```bash
# Terminal 1
npm run dev

# Terminal 2 (after server starts)
npm run e2e
```

Or use the built-in web server (automatic):

```bash
npm run e2e
```

### Issue: Door animations are choppy

**Solution**: Check browser performance and reduce animation complexity

```javascript
// In animations.js, reduce particle count:
const particles = Array.from({ length: 10 }, ...); // Instead of 20
```

### Issue: Framer Motion warnings in console

**Solution**: This is normal. Framer Motion may show warnings about CSS transforms. These don't affect functionality.

### Issue: LocalStorage not persisting

**Possible Causes**:
- Private/Incognito mode
- Browser settings block localStorage
- Browser storage quota exceeded

**Solution**: Test in normal browsing mode, clear browser data

### Issue: Password not working

**Check**:
- Default password is case-sensitive: `OpenSesame123`
- No extra spaces before/after
- If using .env, restart dev server after changes

## 📁 Project Structure

```
MEF/
├── src/
│   ├── features/
│   │   └── doorLock/           # ⭐ Feature module
│   │       ├── components/
│   │       │   ├── Door.jsx
│   │       │   ├── Keypad.jsx
│   │       │   └── SuccessScreen.jsx
│   │       ├── __tests__/
│   │       │   ├── useDoorLock.test.js
│   │       │   └── DoorLockFeature.test.jsx
│   │       ├── animations.js
│   │       ├── config.js
│   │       ├── DoorLockContext.jsx
│   │       ├── DoorLockFeature.jsx
│   │       ├── useDoorLock.js
│   │       ├── .env.example
│   │       └── README.md
│   ├── App.jsx                 # Updated to use feature
│   ├── main.jsx
│   └── index.css
├── e2e/
│   └── doorLock.spec.js        # E2E tests
├── __mocks__/
│   └── fileMock.js
├── package.json                # Updated with test scripts
├── playwright.config.js        # Playwright config
├── jest.config.js              # Jest config
├── jest.setup.js               # Jest setup
├── babel.config.cjs            # Babel for Jest
└── DOOR_LOCK_SETUP.md         # This file
```

## 🎨 Customization Examples

### Change Door Color

Edit `src/features/doorLock/components/Door.jsx`:

```jsx
<div className="... bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950">
  {/* Change from-amber-900 to from-blue-900 */}
</div>
```

### Add Sound Effects

Install howler.js:

```bash
npm install howler
```

In `useDoorLock.js`:

```javascript
import { Howl } from 'howler';

const unlockSound = new Howl({ src: ['/sounds/unlock.mp3'] });
const errorSound = new Howl({ src: ['/sounds/error.mp3'] });

// In verifyPassword():
if (isCorrect) {
  unlockSound.play();
} else {
  errorSound.play();
}
```

### Add Loading State

In `Keypad.jsx`:

```jsx
const [isVerifying, setIsVerifying] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsVerifying(true);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  verifyPassword();
  setIsVerifying(false);
};
```

## 📊 Performance Optimization

### Reduce Bundle Size

The feature is already optimized, but you can:

1. **Tree-shake Framer Motion**: Import only what you need

```javascript
import { motion } from 'framer-motion/dom';
```

2. **Lazy load success screen**:

```jsx
const SuccessScreen = lazy(() => import('./components/SuccessScreen'));
```

### Improve Animation Performance

1. Use `will-change` CSS property
2. Reduce confetti particle count
3. Use `transform` instead of `left/top`
4. Enable GPU acceleration

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

### Deploy to Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

### Deploy to Vercel

```bash
npm run build
vercel --prod
```

### Environment Variables in Production

Set `VITE_DOOR_PASSWORD` in your hosting platform:

- **Netlify**: Site settings → Environment variables
- **Vercel**: Project settings → Environment variables
- **GitHub Pages**: Use repository secrets

## 📝 Git Commit History Suggestions

If integrating this into version control:

```bash
# 1. Initial feature structure
git add src/features/doorLock/config.js src/features/doorLock/animations.js
git commit -m "feat: add door lock feature config and animations"

# 2. Add core logic
git add src/features/doorLock/useDoorLock.js src/features/doorLock/DoorLockContext.jsx
git commit -m "feat: implement door lock state management and context"

# 3. Add UI components
git add src/features/doorLock/components/
git commit -m "feat: add Door, Keypad, and SuccessScreen components"

# 4. Add main feature component
git add src/features/doorLock/DoorLockFeature.jsx
git commit -m "feat: create main DoorLockFeature component"

# 5. Add tests
git add src/features/doorLock/__tests__/ e2e/doorLock.spec.js
git commit -m "test: add unit and E2E tests for door lock feature"

# 6. Add test configuration
git add jest.config.js jest.setup.js babel.config.cjs playwright.config.js
git commit -m "chore: configure Jest and Playwright for testing"

# 7. Update dependencies
git add package.json
git commit -m "chore: add testing dependencies"

# 8. Integrate with app
git add src/App.jsx
git commit -m "feat: integrate door lock feature into main app"

# 9. Add documentation
git add src/features/doorLock/README.md DOOR_LOCK_SETUP.md
git commit -m "docs: add comprehensive documentation for door lock feature"
```

## 🎓 Learning Resources

### Framer Motion
- [Official Docs](https://www.framer.com/motion/)
- [Animation Controls](https://www.framer.com/motion/animation/)
- [Gestures](https://www.framer.com/motion/gestures/)

### React Testing Library
- [Testing Best Practices](https://testing-library.com/docs/react-testing-library/intro/)
- [Queries](https://testing-library.com/docs/queries/about)
- [User Events](https://testing-library.com/docs/user-event/intro)

### Playwright
- [Getting Started](https://playwright.dev/docs/intro)
- [Writing Tests](https://playwright.dev/docs/writing-tests)
- [Best Practices](https://playwright.dev/docs/best-practices)

## ✨ Next Steps

1. **Run the app**: `npm run dev`
2. **Test it**: Try password `OpenSesame123`
3. **Run tests**: `npm test && npm run e2e`
4. **Customize**: Change colors, animations, or password
5. **Deploy**: Build and deploy to your hosting platform

## 🤝 Support

If you encounter issues:

1. Check this document's troubleshooting section
2. Review the feature README: `src/features/doorLock/README.md`
3. Check console for errors
4. Verify all dependencies are installed
5. Ensure dev server is running

---

**Enjoy your password-protected door! 🚪🔐✨**
