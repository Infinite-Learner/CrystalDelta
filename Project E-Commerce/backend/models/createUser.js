const db = require('../config/db');
const createUser = (username, email, password, callback) => {
    const query = 'INSERT INTO drcart_users (User_Name, User_Email, login_password) VALUES (?, ?, ?)';
    db.query(query, [username, email, password], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, result);
    });
  };
  
  module.exports = { createUser };