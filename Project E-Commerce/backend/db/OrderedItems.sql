CREATE TABLE IF NOT EXISTS DRCART.DRCART_OrderItems ( 
    Order_id INT PRIMARY KEY AUTO_INCREMENT, 
    Product_id VARCHAR(255), 
    User_id INT,
    Quantity INT, 
    Order_Date DATETIME,
    Price DECIMAL(10, 2), 
    Order_status Varchar(255),
    FOREIGN KEY (product_id) REFERENCES drcart_products(product_id),
    FOREIGN KEY (User_id) REFERENCES drcart_users(User_id)
);