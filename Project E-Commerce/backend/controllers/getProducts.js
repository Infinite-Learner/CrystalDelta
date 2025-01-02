const db = require("../config/db");

const getProducts = async (req, res) => {
  try {
    const products = await db.query("SELECT * FROM drcart_products");
    res.status(200).json(products.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await db.query("SELECT * FROM drcart_products WHERE product_id = $1", [id]);
    res.status(200).json(product.rows[0]);
  } catch (error) {
    console.log(error);
}
}
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await db.query("SELECT * FROM drcart_products WHERE product_category = $1", [category]);
    res.status(200).json(products.rows);
  } catch (error) {
    console.log(error);
}
}
module.exports = { getProducts, getProduct , getProductsByCategory };