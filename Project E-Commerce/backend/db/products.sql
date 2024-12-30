CREATE TABLE IF NOT EXISTS DRCART_PRODUCTS(
Product_Id VARCHAR(255) NOT NULL ,
Product_Name VARCHAR(255) UNIQUE,
Product_Price BIGINT ,
Product_Discount INT,
Product_Description VARCHAR(255),
Product_Specifications VARCHAR(255),
Product_Ratings FLOAT ,
Product_Images VARCHAR(255),
PRIMARY KEY(Product_ID)
);