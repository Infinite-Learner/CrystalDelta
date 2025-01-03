const { signup } = require('./authController');
const bcrypt = require('bcrypt');
const db = require('../config/db');

describe('Signup Function', () => {
  it('should return an error if username, email, or password is missing', async () => {
    const req = { body: { username: 'test', password: 'password' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    await signup(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Email and password are required." });
  });

  it('should hash password and insert new user', async () => {
    const req = { body: { username: 'test', email: 'test@example.com', password: 'password' } };
    bcrypt.hash.mockResolvedValue('hashedPassword');
    db.query.mockImplementation((query, values, callback) => callback(null, []));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await signup(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO'), ['test', 'test@example.com', 'hashedPassword']);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "User registered successfully" });
  });

  it('should handle database errors', async () => {
    const req = { body: { username: 'test', email: 'test@example.com', password: 'password' } };
    db.query.mockImplementation((query, values, callback) => callback(new Error('DB Error')));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await signup(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Failed to create user" });
  });
});
