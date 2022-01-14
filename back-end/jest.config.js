module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/tests/jestSetup.ts'],
  verbose: true,
};

// globalSetup: './src/tests/globalSetup.ts',
