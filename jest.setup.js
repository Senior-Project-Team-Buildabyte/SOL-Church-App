module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.js', // 👈 include your existing setup
    '@testing-library/jest-native/extend-expect', // 👈 testing-library matchers
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|expo(nent)?|@expo(nent)?/.*|@react-native|@react-navigation/.*))',
  ],
};
