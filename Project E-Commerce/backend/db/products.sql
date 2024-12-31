CREATE TABLE IF NOT EXISTS DRCART_PRODUCTS(
Product_Id VARCHAR(255) NOT NULL ,
Product_Name VARCHAR(255) UNIQUE NOT NULL,
Product_Price BIGINT NOT NULL,
Product_Discount INT NOT NULL,
Product_Description VARCHAR(255) NOT NULL,
Product_Specifications VARCHAR(255) NOT NULL,
Product_Ratings FLOAT  NOT NULL,
Product_Images VARCHAR(255) NOT NULL,
Product_Catogory VARCHAR(255) NOT NULL,
Product_Quantity INT NOT NULL,
PRIMARY KEY(Product_ID)
);