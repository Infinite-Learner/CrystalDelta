const { login } = require('../controllers/authController');
const bcrypt = require('bcrypt');
const db = require('../config/db');

describe('Login Function', () => {
  it('should return an error if email or password is missing', async () => {
    const req = { body: { email: 'test@example.com' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Email and password are required." });
  });

  it('should authenticate user successfully', async () => {
    const req = { body: { email: 'test@example.com', password: 'password' } };
    const mockUser = { User_Name: 'test', User_Id: 1, User_Email: 'test@example.com', login_password: 'hashedPassword' };
    bcrypt.compare.mockResolvedValue(true);
    db.query.mockImplementation((query, values, callback) => callback(null, [mockUser]));

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    await login(req, res);

    expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
    expect(req.session.username).toBe(mockUser.User_Name);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "Login successful", username: mockUser.User_Name });
  });

  it('should handle invalid credentials', async () => {
    const req = { body: { email: 'invalid@example.com', password: 'password' } };
    db.query.mockImplementation((query, values, callback) => callback(null, []));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Invalid email or password" });
  });

  it('should handle database errors', async () => {
    const req = { body: { email: 'test@example.com', password: 'password' } };
    db.query.mockImplementation((query, values, callback) => callback(new Error('DB Error')));

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Internal server error" });
  });
});
