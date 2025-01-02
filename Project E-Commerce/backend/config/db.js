//Required Modi
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
db.connect((err) => {
  if (err) throw err;
  else {
    console.log("Connected to MySQL database");
    db.query(`USE ${process.env.DB_NAME}`, (err) => {
      if (err){ 
      db.query(`CREATE DATABASE ${process.env.DB_NAME}`, (err) => {
        if (err) throw err; 
      })
      console.log("Database created");
      console.log("Creating tables...");
      }
    });
  }
});
const sqlFiles = [
  "products.sql",
  "usertable.sql",
  "OrderedItems.sql"
];
if (process.env.TABLES_EXISTS == "false") {
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
          if (count == sqlFiles.length){
            console.log(count);
            envUpdate('TABLES_EXISTS','true')
          }
        })
    });
      });
      
    }
       if(process.env.SAMPLE_DATA == "false"){
              count = 0;
              insertData = ['sampleUsers.sql','sampleProducts.sql'];
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
                        envUpdate('SAMPLE_DATA','true');                  
                      }
                    }});
              
                  });

          });
        }
function envUpdate(key,newValue){
  try {
    const ENV_FILE_PATH = path.join(__dirname, "../.env");
    let envContent = fs.readFileSync(ENV_FILE_PATH, "utf8");
    const regex = new RegExp(`^${key}=.*$`, "m");
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${newValue}`);
      }
     else {
      envContent += `\n${key}=${newValue}\n`;
    }
    fs.writeFileSync(ENV_FILE_PATH, envContent, "utf8");
  } catch (error) {
    console.error(`Error updating .env file: ${error}`);
  }
}
module.exports = db;
