const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

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
  "usertable.sql",
  "products.sql",
  "Orders.sql",
  "OrderedItems.sql",
];
if (process.env.TABLES_EXISTS == "false") {
  console.log(path.join(__dirname, "../.env"));
  sqlFiles.forEach((file) => {
    const sqlFilePath = path.join(__dirname, "../db", file);
    console.log(process.env.TABLES_EXISTS);
    fs.readFile(sqlFilePath, "utf8", (err, sql) => {
      if (err) {
        console.error(`Error reading SQL file ${file}: `, err);
        return;
      }
      db.query(sql, (err, results) => {
        if (err) {
          console.error(`Error executing ${file}: `, err.sqlState);
        } else {
          if (!results.affectedRows == 0) {
            console.log(
              `Table ${file.split(".")[0].toUpperCase()} Created successfully: `
            );
          } else {
            console.log(
              `Table ${file.split(".")[0].toUpperCase()} already exists`
            );
          }
          const ENV_FILE_PATH = path.join(__dirname, "../.env");
            const key = "TABLES_EXISTS";
            const newValue = "true";
            try {
              let envContent = fs.readFileSync(ENV_FILE_PATH, "utf8");

              const regex = new RegExp(`^${key}=.*$`, "m");
              if (regex.test(envContent)) {
                envContent = envContent.replace(regex, `${key}=${newValue}`);
              } else {
                envContent += `\n${key}=${newValue}\n`;
              }
              fs.writeFileSync(ENV_FILE_PATH, envContent, "utf8");
            } catch (error) {
              console.error(`Error updating .env file: ${error}`);
            }
        }
      });
    });
  });
}
module.exports = db;
