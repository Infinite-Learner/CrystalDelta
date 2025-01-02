const db = require("../config/db");

// Get all products
const getProducts = (req, res) => {
  db.query("SELECT * FROM DRCART.DRCART_PRODUCTS", (error, products) => {
    if (error) {
      console.log('Error fetching products:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json({products:products});
  });
};

// Get a specific product by ID
const getProduct = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM DRCART.DRCART_PRODUCTS WHERE product_id = ?", [id], (error, result) => {
    if (error) {
      console.log('Error fetching product by ID:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: `Product with ID ${id} not found` });
    }
    res.status(200).json({products:result[0]});
  });
};

// Get products by category
const getProductsByCategory = (req, res) => {
  const { category } = req.params;
  db.query("SELECT * FROM DRCART.DRCART_PRODUCTS WHERE product_category = ?", [category], (error, result) => {
    if (error) {
      console.log('Error fetching products by category:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: `No products found for category ${category}` });
    }
    res.status(200).json({products:result});
  });
};

module.exports = { getProducts, getProduct, getProductsByCategory };
