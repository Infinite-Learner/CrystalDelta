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
  const { name } = req.params;
  db.query("SELECT * FROM DRCART.DRCART_PRODUCTS WHERE product_name LIKE ?", [`%${name}%`], (error, result) => {
    if (error) {
      console.log('Error fetching product by name:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: `Product with name ${name} not found` });
    }
    res.status(200).json({products:result});
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
