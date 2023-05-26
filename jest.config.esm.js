module.exports = {
    // Specifies the preset configuration for Jest, combining TypeScript and Babel.
    preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  
    // Maps the "@" alias used in imports to the "src" directory.
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1'
    },
  
    // Specifies patterns for files to be ignored during transformation by Jest.
    transformIgnorePatterns: [
      '/node_modules/(?!vuetify)/'
    ],
  
    // Enables code coverage collection during tests.
    collectCoverage: true,
  
    // Specifies the files from which coverage should be collected.
    collectCoverageFrom: [
      'src/**/*.{js,ts,vue}',    // Include all JavaScript, TypeScript, and Vue files in the "src" directory.
      '!src/main.ts',            // Exclude the main.ts file from coverage.
      '!src/router/index.ts',    // Exclude the router/index.ts file from coverage.
      '!src/store/index.ts'      // Exclude the store/index.ts file from coverage.
    ],
  
    // Specifies the reporters to use for coverage reports.
    coverageReporters: [
      'lcov',         // Generates an lcov.info file.
      'text-summary' // Prints a summary to the console.
    ],
  
    // Specifies the file extensions to consider when running tests.
    moduleFileExtensions: [
      'js',
      'ts',
      'vue'
    ],
  
    // Specifies the patterns to match test files.
    testMatch: [
      '**/tests/**/*.spec.[jt]s?(x)',  // Match files in the tests directory with a .spec.js, .spec.ts, .spec.jsx, or .spec.tsx extension.
      '**/__tests__/*.[jt]s?(x)'            // Match files in the __tests__ directory with a .js, .ts, .jsx, or .tsx extension.
    ],
  
    // Specifies the serializers to use for snapshot testing.
    snapshotSerializers: [
      'jest-serializer-vue'
    ],
  
    // Enables verbose output during test runs.
    verbose: true
  };
  