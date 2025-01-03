describe('OrderProducts Function', () => {
    it('should process orders successfully', async () => {
      const mockProducts = [
        { Product_Id: 1, Quantity: 2 },
        { Product_Id: 2, Quantity: 3 }
      ];
      const mockUserId = 101;
  
      db.query
        .mockImplementationOnce((query, values, callback) => {
          callback(null, [{ Product_Price: 100 }]); // First product price
        })
        .mockImplementationOnce((query, values, callback) => {
          callback(null, [{ Product_Price: 200 }]); // Second product price
        })
        .mockImplementationOnce((query, values, callback) => {
          callback(null, { insertId: 1 }); // Insert order for first product
        })
        .mockImplementationOnce((query, values, callback) => {
          callback(null, { insertId: 2 }); // Insert order for second product
        })
        .mockImplementationOnce((query, values, callback) => {
          callback(null, [{ order_id: 1, User_Id: mockUserId, Product_Id: 1, Quantity: 2 }]); // Retrieve first order
        })
        .mockImplementationOnce((query, values, callback) => {
          callback(null, [{ order_id: 2, User_Id: mockUserId, Product_Id: 2, Quantity: 3 }]); // Retrieve second order
        });
  
      const req = { body: { User_Id: mockUserId, products: mockProducts } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      await OrderProducts(req, res);
  
      expect(db.query).toHaveBeenCalledTimes(6);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { order_id: 1, User_Id: mockUserId, Product_Id: 1, Quantity: 2 },
        { order_id: 2, User_Id: mockUserId, Product_Id: 2, Quantity: 3 }
      ]);
    });
  
    it('should handle error while processing an order', async () => {
      db.query
        .mockImplementationOnce((query, values, callback) => callback(null, [{ Product_Price: 100 }]))
        .mockImplementationOnce((query, values, callback) => callback(new Error('DB Error')));
  
      const req = { body: { User_Id: 101, products: [{ Product_Id: 1, Quantity: 2 }] } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      await OrderProducts(req, res);
  
      expect(db.query).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error processing some orders" });
    });
  
    it('should handle invalid order data', async () => {
      const req = { body: { User_Id: null, products: [] } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      await OrderProducts(req, res);
  
      expect(db.query).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid order data. Please provide a valid User_Id and an array of products." });
    });
  });