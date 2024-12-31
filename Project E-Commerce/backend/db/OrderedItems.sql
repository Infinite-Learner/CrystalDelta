CREATE TABLE IF NOT EXISTS DRCART_OrderItems ( 
    order_item_id INT PRIMARY KEY AUTO_INCREMENT, 
    order_id INT, 
    product_id VARCHAR(255), 
    User_id INT,
    quantity INT, 
    price DECIMAL(10, 2), 
    FOREIGN KEY (order_id) REFERENCES drcart_orders(order_id),
    FOREIGN KEY (product_id) REFERENCES drcart_products(product_id),
    FOREIGN KEY (User_id) REFERENCES drcart_users(User_id)
);