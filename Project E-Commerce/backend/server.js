const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');


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

const PORT = 3000;
app.listen(PORT,() => {
  console.log(`Server running on port ${PORT}`);
  
}
); 