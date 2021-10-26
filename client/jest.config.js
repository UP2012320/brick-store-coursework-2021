/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

const {pathsToModuleNameMapper} = require('ts-jest/utils');
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const {compilerOptions} = require('./tsconfig.json');

let mapping = pathsToModuleNameMapper(compilerOptions.paths, { prefix: `${__dirname}/src` });
mapping = {...mapping, ...{'^(\\.{1,2}/.*)\\.js$': '$1'}};

module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  moduleNameMapper: mapping,
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  extensionsToTreatAsEsm: ['.ts'],
  collectCoverage: true,
  globals: {
    'ts-jest': {
      useESM: true
    }
  }
};
