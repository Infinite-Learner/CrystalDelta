CREATE TABLE IF NOT EXISTS DRCART_Orders ( 
    order_id INT PRIMARY KEY AUTO_INCREMENT, 
    User_id INT, 
    order_date DATETIME, 
    total_amount DECIMAL(10, 2), 
    FOREIGN KEY (User_id) REFERENCES drcart_users(User_id) 
); 