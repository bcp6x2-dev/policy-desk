const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors({
origin: ['https://pd-crm.netlify.app', 'http://localhost:3000', 'http://localhost:3001'],
credentials: true
}));
app.use(express.json());
const contactsRouter = require('./routes/contacts');
app.use('/api/contacts', contactsRouter);
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);
const importRouter = require('./routes/import');
app.use('/api/import', importRouter);
const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);
app.get('/', (req, res) => {
  res.json({ message: 'PolicyDesk API is running!' });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});