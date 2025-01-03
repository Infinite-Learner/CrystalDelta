const { logout } = require('./authController');

describe('Logout Function', () => {
  it('should destroy session and respond with success', async () => {
    const req = { session: { destroy: jest.fn((callback) => callback(null)) } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await logout(req, res);

    expect(req.session.destroy).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ success: true, message: "Logged out successfully" });
  });

  it('should handle session destroy error', async () => {
    const req = { session: { destroy: jest.fn((callback) => callback(new Error('Session destroy error'))) } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await logout(req, res);

    expect(req.session.destroy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: "Logout failed" });
  });
});
