require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const mariadb = require('mariadb');

const PORT = process.env.PORT;

const corsOptions = {
  origin: 'http://localhost:3000', //client
  Credential: true,
};
app.use(cors(corsOptions));

async function connectMariadb() {
  let conn;
  try {
    // Create a new connection
    conn = await mariadb.createConnection({
      host: process.env.LDB_HOST,
      port: process.env.LDB_PORT,
      user: process.env.LDB_USER,
      password: process.env.LDB_PASS,
    });

    // Print connection thread
    console.log(`Maria DB is connected! (id=${conn.threadId})`);
  } catch (err) {
    // Print error
    console.log(err);
  } finally {
    // Close connection
    if (conn) await conn.close();
  }
}

connectMariadb();

app.get('/hello', (req, res) => {
  res.send({ hello: 'Hello Im from server' });
});
app.get('/', (req, res) => {
  res.send('Server Response Success');
});

app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}/`);
});
