const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');


app.use(cors());
app.use(bodyParser.json());
express.static(path.join(__dirname, 'frontend','assets','styles'));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}
); 