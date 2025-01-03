const { getProductsByCategory } = require('./productsController');

describe('getProductsByCategory Function', () => {
  it('should return products for the given category', async () => {
    const mockProducts = [{ id: 1, name: 'Product1', category: 'Electronics' }];
    db.query.mockImplementation((query, values, callback) => callback(null, mockProducts));

    const req = { params: { category: 'Electronics' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getProductsByCategory(req, res);

    expect(db.query).toHaveBeenCalledWith("SELECT * FROM DRCART.DRCART_PRODUCTS WHERE product_category = ?", ['Electronics'], expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ products: mockProducts });
  });

  it('should handle error fetching products by category', async () => {
    db.query.mockImplementation((query, values, callback) => callback(new Error('DB Error')));

    const req = { params: { category: 'Electronics' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getProductsByCategory(req, res);

    expect(db.query).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });

  it('should return 404 if no products found for category', async () => {
    db.query.mockImplementation((query, values, callback) => callback(null, []));

    const req = { params: { category: 'Electronics' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getProductsByCategory(req, res);

    expect(db.query).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: `No products found for category Electronics` });
  });
});
