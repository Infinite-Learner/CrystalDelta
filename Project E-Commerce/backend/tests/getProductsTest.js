const { getProducts } = require('./productsController');

describe('getProducts Function', () => {
  it('should return all products', async () => {
    const mockProducts = [{ id: 1, name: 'Product1' }, { id: 2, name: 'Product2' }];
    db.query.mockImplementation((query, callback) => callback(null, mockProducts));

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getProducts(req, res);

    expect(db.query).toHaveBeenCalledWith("SELECT * FROM DRCART.DRCART_PRODUCTS", expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ products: mockProducts });
  });

  it('should handle error fetching products', async () => {
    db.query.mockImplementation((query, callback) => callback(new Error('DB Error')));

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getProducts(req, res);

    expect(db.query).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });

  it('should return 404 if no products found', async () => {
    db.query.mockImplementation((query, callback) => callback(null, []));

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getProducts(req, res);

    expect(db.query).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "No products found" });
  });
});
