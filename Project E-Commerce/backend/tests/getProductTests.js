const { getProduct } = require('./productsController');

describe('getProduct Function', () => {
  it('should return the product by name', async () => {
    const mockProduct = { id: 1, name: 'Product1' };
    db.query.mockImplementation((query, values, callback) => callback(null, [mockProduct]));

    const req = { params: { name: 'Product1' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getProduct(req, res);

    expect(db.query).toHaveBeenCalledWith("SELECT * FROM DRCART.DRCART_PRODUCTS WHERE product_name LIKE ?", [`%Product1%`], expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ products: [mockProduct] });
  });

  it('should handle error fetching product by name', async () => {
    db.query.mockImplementation((query, values, callback) => callback(new Error('DB Error')));

    const req = { params: { name: 'Product1' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getProduct(req, res);

    expect(db.query).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });

  it('should return 404 if product is not found', async () => {
    db.query.mockImplementation((query, values, callback) => callback(null, []));

    const req = { params: { name: 'Product1' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getProduct(req, res);

    expect(db.query).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: `Product with name Product1 not found` });
  });
});
