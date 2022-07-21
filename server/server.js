const express = require('express');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: 'http://localhost:3000',
  Credential: true,
};

app.use(cors(corsOptions));

app.get('/hello', (req, res) => {
  res.send({ hello: 'Hello Im from server' });
});
app.get('/', (req, res) => {
  res.send('Server Response Success');
});

app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}/`);
});
