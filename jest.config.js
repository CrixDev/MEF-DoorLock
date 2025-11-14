/**
 * Jest Configuration for Unit Tests
 * 
 * Configured for React + Vite project with JSX support
 */
export default {
  testEnvironment: 'jsdom',
  
  // Transform files with babel-jest
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './babel.config.cjs' }],
  },
  
  // Module name mapper for CSS and assets
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.(test|spec).(js|jsx)',
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/**/__tests__/**',
    '!src/main.jsx',
  ],
  
  // Module directories
  moduleDirectories: ['node_modules', 'src'],
  
  // Ignore patterns
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  
  // Transform ignore patterns for ESM modules
  transformIgnorePatterns: [
    'node_modules/(?!(framer-motion)/)',
  ],
};
