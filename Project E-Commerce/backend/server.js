const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');
const session = require('express-session');

app.use(session({
  secret: 'drcartforbestshopping2025', 
  resave: false, 
  saveUninitialized: true, 
  cookie: { secure: false }, // Set secure: true if you're using HTTPS
}));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/styles', express.static(path.join(__dirname, '../styles')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.get(['/home','/'], (req, res) => {
  res.sendFile(path.join(__dirname,'../frontend','homepage.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/loginpage.html'));
});
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/signuppage.html'));
});

const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);
app.listen(process.env.ENV_PORT,() => {
  console.log(`Server running on port ${process.env.ENV_PORT}`);
  
}
); 