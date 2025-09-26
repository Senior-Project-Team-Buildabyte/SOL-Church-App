// Setup Jest mocks for React Native environment

// Mock AsyncStorage native module
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
