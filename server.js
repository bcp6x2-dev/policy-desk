const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
const contactsRouter = require('./routes/contacts');
app.use('/api/contacts', contactsRouter);
app.get('/', (req, res) => {
  res.json({ message: 'PolicyDesk API is running!' });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});