const db = require("../config/db");

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await db.query("SELECT * FROM drcart_products");
    if (products.rows.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json(products.rows);
  } catch (error) {
    console.log('Error fetching products:', error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get a specific product by ID
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT * FROM drcart_products WHERE product_id = ?", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: `Product with ID ${id} not found` });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.log('Error fetching product by ID:', error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const result = await db.query("SELECT * FROM drcart_products WHERE product_category = ?", [category]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: `No products found for category ${category}` });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    console.log('Error fetching products by category:', error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getProducts, getProduct, getProductsByCategory };
