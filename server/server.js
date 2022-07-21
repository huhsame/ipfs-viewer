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

let conn;

async function connectMariadb() {
  try {
    // Create a new connection
    conn = await mariadb.createConnection({
      host: process.env.MDB_HOST,
      port: process.env.MDB_PORT,
      user: process.env.MDB_USER,
      password: process.env.MDB_PASS,
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

// https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/master/documentation/promise-api.md
// query example
async function query() {
  const rows = await conn.query('SELECT 1 as val');
  console.log(rows); //[ {val: 1}, meta: ... ]

  const res = await conn.query('INSERT INTO someTable VALUES (?, ?, ?)', [
    1,
    Buffer.from('c327a97374', 'hex'),
    'mariadb',
  ]);
  //will send INSERT INTO someTable VALUES (1, _BINARY '.\'.st', 'mariadb')
}

app.get('/hello', (req, res) => {
  res.send({ hello: 'Hello Im from server' });
});
app.get('/', (req, res) => {
  res.send('Server Response Success');
});

app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}/`);
});
