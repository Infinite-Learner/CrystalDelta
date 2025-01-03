// setupTests.js
const bcrypt = require("bcrypt");
const db = require("../config/db");

// Mock bcrypt
jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn()
}));

// Mock db
jest.mock("../config/db", () => ({
  query: jest.fn()
}));

// Export mocks for use in tests
module.exports = { bcrypt, db };