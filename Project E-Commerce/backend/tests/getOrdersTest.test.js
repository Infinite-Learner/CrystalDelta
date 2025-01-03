
  const { getOrders } = require('../controllers/OrderProducts');

  describe('getOrders Function', () => {
    it('should return user orders successfully', async () => {
      const mockUserId = 101;
      const mockOrders = [
        { order_id: 1, User_Id: mockUserId, Product_Id: 1, Quantity: 2 },
        { order_id: 2, User_Id: mockUserId, Product_Id: 2, Quantity: 3 }
      ];
  
      db.query.mockImplementation((query, values, callback) => {
        callback(null, mockOrders);
      });
  
      const req = { params: { id: mockUserId } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      await getOrders(req, res);
  
      expect(db.query).toHaveBeenCalledWith("SELECT * FROM `drcart`.`drcart_orderItems` WHERE user_id = ?", [mockUserId], expect.any(Function));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ orders: mockOrders });
    });
  
    it('should handle error while getting orders', async () => {
      db.query.mockImplementation((query, values, callback) => {
        callback(new Error('DB Error'));
      });
  
      const req = { params: { id: 101 } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      await getOrders(req, res);
  
      expect(db.query).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error getting orders" });
    });
  });
  