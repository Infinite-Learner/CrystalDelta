CREATE TABLE IF NOT EXISTS DRCART_Orders ( 
    order_id INT PRIMARY KEY AUTO_INCREMENT, 
    User_id INT, 
    Product_Id VARCHAR(255),
    order_date DATETIME, 
    total_amount DECIMAL(10, 2), 
    FOREIGN KEY (User_id) REFERENCES drcart_users(User_id),
    FOREIGN KEY (Product_Id) REFERENCES drcart_products(Product_Id)
);