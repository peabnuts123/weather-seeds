// See jest docs for config options: https://jestjs.io/docs/en/configuration
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  clearMocks: true,
  verbose: true,
  testURL: "http://localhost:8080",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  // @TODO
  // setupFilesAfterEnv: [
  //   '<rootDir>/tests/setup/mock-fetch.ts',
  //   '<rootDir>/tests/setup/configure-logger.ts',
  // ],
  testMatch: [
    "tests/**/*\.test.[jt]s(x)"
  ],
  moduleNameMapper: {
    // "@app/test" import alias for test project
    '^@app/test/(.*)$': '<rootDir>/tests/$1',
    // "@app" import alias for regular app files
    '^@app/(.*)$': '<rootDir>/src/js/app/$1',
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx,ts,tsx}',
  ],
}
