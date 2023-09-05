const tsconfig = require('./tsconfig.json');
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig);

module.exports = {
  preset: "ts-jest",
  moduleDirectories: [
    "node_modules",
    "src"
  ],
  moduleNameMapper: {
    ...moduleNameMapper,
    "^src/(.*)$": "<rootDir>/src/$1"
  },
  testPathIgnorePatterns: [
    "<rootDir>/src/testFixtures/*"
  ],
  reporters: [
    "default",
    "jest-junit"
  ]
}
