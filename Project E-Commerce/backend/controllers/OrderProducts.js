const db = require("../config/db");
const OrderProducts = (req, res) => {
  const { User_Id, Product_Id, Quantity, price } = req.body;
  db.query("select * from DRCART_Products where Product_Id = ?",[Product_Id], (err,results) => {
    if(err) throw err;
    const price = results[0].Product_Price;
     console.log(price);
     console.log(Quantity);
      console.log(price);
  const orderedStatus = `ordered Delivered within ${Math.floor(Math.random() * (20 - 5 + 1)) + 5} days`;

  // Use callback for database query
  db.query(
    "INSERT INTO DRCART_OrderItems (User_Id, Product_Id, Quantity, Price, Order_Date, order_status) VALUES (?,?,?,?,NOW(),?)",
    [User_Id, Product_Id, Quantity, price, orderedStatus],
    (err, result) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Server Error");
      }
      const order_id = result.insertId;

      // Fetch the inserted order using the order_id
      db.query(
        "SELECT * FROM DRCART_OrderItems WHERE order_id = ?",
        [order_id],
        (err, rows) => {
          if (err) {
            console.error(err.message);
            return res.status(500).send("Server Error");
          }

          // Send the response with the inserted order data
          res.status(200).json(rows[0]); // Assuming the order data is in the first row
        }
      );

    }
  );
});
};

module.exports = {OrderProducts};