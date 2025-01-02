//Required Modi
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const bycrypt = require('bcryptjs');
const { Console } = require("console");
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database");
});
const sqlFiles = [
  "products.sql",
  "usertable.sql",
  "Orders.sql",
  "OrderedItems.sql"
];
if (process.env.TABLES_EXISTS == "false") {
  console.log(path.join(__dirname, "../.env"));
  let count = 0; 
  sqlFiles.forEach((file) => {
    let sqlFilePath = path.join(__dirname, "../db", file);
    fs.readFile(sqlFilePath, "utf8", (err, sql) => {
    
      if (err) {
        console.error(`Error reading SQL file ${file}: `, err);

        return;
      }
      db.query(sql, (err) => {

        if (err) { 
          console.error(`Error executing ${file}: `, err.sqlState);
          count --;
        } else {
            console.log(
              `Table ${file.split(".")[0].toUpperCase()} Created Successfully`
            );
            count++;
        }
        if (count == sqlFiles.length ) {
          const ENV_FILE_PATH = path.join(__dirname, "../.env");
            const key = "TABLES_EXISTS";
            const newValue = "true";
            if(process.env.SAMPLE_DATA == "false"){
              count = 0;
              insertData = ['sampleUsers.sql'];
              insertData.forEach(file => {
                let sqlFilePath = path.join(__dirname, "../db", file);
                fs.readFile(sqlFilePath, "utf8", (err, sql) => {
                  if (err) {
                    console.error(`Error reading SQL file ${file}: `, err);
                    return;
                  }
                  db.query(sql, (err) => {
                    if(err) console.log(err);
                    else count++;
                    if(count == insertData.length){
                      console.log('Sample Data Inserted Successfully');
                      if(count == insertData.length ){
                        try {
                      let envContent = fs.readFileSync(ENV_FILE_PATH, "utf8");
                      const key1 = "SAMPLE_DATA";
                      const regex1 = new RegExp(`^${key}=.*$`, "m");
                      const regex = new RegExp(`^${key1}=.*$`, "gm");
                      if (regex.test(envContent)) {
                        envContent = envContent.replace(regex, `${key}=${newValue}`);
                        envContent = envContent.replace(regex1, `${key1}=${newValue}`);
                      } else {
                        envContent += `\n${key1}=${newValue}\n`;
                        
                        envContent += `\n${key}=${newValue}\n`;
                      }
                      fs.writeFileSync(ENV_FILE_PATH, envContent, "utf8");
                    } catch (error) {
                      console.error(`Error updating .env file: ${error}`);
                    }
                  }
                      process.exit(0);
                    }
                    });

              });
              
          });
          }
        }
      });
    });
  });
}
module.exports = db;
