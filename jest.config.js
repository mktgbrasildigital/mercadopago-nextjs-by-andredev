const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Caminho para o app Next.js para carregar next.config.js e .env
  dir: "./",
});

// Configurações customizadas do Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "!app/**/*.d.ts",
    "!app/**/_*.{ts,tsx}",
    "!**/*.config.{ts,js}",
  ],
  coveragePathIgnorePatterns: ["/node_modules/", "/.next/"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
};

// createJestConfig é exportado dessa forma para garantir que next/jest possa carregar a configuração do Next.js de forma assíncrona
module.exports = createJestConfig(customJestConfig);
