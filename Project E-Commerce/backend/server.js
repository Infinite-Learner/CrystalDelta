const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); 


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: "", 
  database: 'drcart'
});


db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database');
});

app.post('/register', (req, res) => {
  const { username,email, password } = req.body;

  if (!username||!email || !password) {
    return res.status(400).json({ message: 'Username and Email and password are required' });
  }
  const checkUserQuery = 'SELECT * FROM users WHERE User_Email = ?';
  db.query(checkUserQuery, [email], (err, result) => {
    if (err) return res.status(500).json({ message: 'Error querying the database' });
    
    if (result.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ message: 'Error hashing password' });

      // Insert new user into the database
      const insertUserQuery = 'INSERT INTO drcart_users (User_Name, User_Email,login_password) VALUES (?, ?,?)';
      db.query(insertUserQuery, [username,email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error inserting user' });
        
        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  });
});

// Start the server
const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});