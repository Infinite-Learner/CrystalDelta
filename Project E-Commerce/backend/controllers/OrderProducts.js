const db = require("../config/db");

const OrderProducts = (req, res) => {
  const { User_Id, products } = req.body; // Expecting User_Id and an array of products
  console.log(req.body);
  if (!User_Id || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: "Invalid order data. Please provide a valid User_Id and an array of products." });
  }

  let orderResults = [];
  let errorOccurred = false;
  let processedOrders = 0;

  // Function to insert a single order
  const insertOrder = (product, callback) => {
    const { Product_Id, Quantity } = product;

    // Fetch product price from the database
    db.query("SELECT * FROM DRCART.DRCART_Products WHERE Product_Id = ?", [Product_Id], (err, results) => {
      if (err) {
        return callback(err);
      }

      if (results.length === 0) {
        return callback(new Error(`Product with ID ${Product_Id} not found`));
      }

      const price = results[0].Product_Price;
      const totalPrice = price * Quantity;
      const orderedStatus = `ordered Delivered within ${Math.floor(Math.random() * (20 - 5 + 1)) + 5} days`;

      // Insert the order into the database
      db.query(
        "INSERT INTO DRCART.DRCART_OrderItems (User_Id, Product_Id, Quantity, Price, Order_Date, order_status) VALUES (?,?,?,?,NOW(),?)",
        [User_Id, Product_Id, Quantity, totalPrice, orderedStatus],
        (err, result) => {
          if (err) {
            return callback(err);
          }

          const order_id = result.insertId;

          // Fetch the inserted order using the order_id
          db.query(
            "SELECT * FROM DRCART.DRCART_OrderItems WHERE order_id = ?",
            [order_id],
            (err, rows) => {
              if (err) {
                return callback(err);
              }

              // Add the inserted order to the results
              orderResults.push(rows[0]);
              callback(null); // No error, proceed to next order
            }
          );
        }
      );
    });
  };

  // Process all products in the products array
  products.forEach((product) => {
    insertOrder(product, (err) => {
      processedOrders++;

      if (err) {
        errorOccurred = true;
        console.error('Error processing order:', err.message);
      }

      if (processedOrders === products.length) {
        if (errorOccurred) {
          return res.status(500).json({ message: "Error processing some orders" });
        }

        // Send the response with all successfully processed orders
        res.status(200).json(orderResults);
      }
    });
  });
};

module.exports = { OrderProducts };
