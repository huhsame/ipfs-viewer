require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const mariadb = require('mariadb');

const PORT = 3001;

const corsOptions = {
  origin: 'http://localhost:3000', //client
  Credential: true,
};
app.use(cors(corsOptions));

let db;

async function connectMariadb() {
  try {
    // Create a new connection
    db = await mariadb.createConnection({
      host: process.env.MDB_HOST,
      port: process.env.MDB_PORT,
      user: process.env.MDB_USER,
      password: process.env.MDB_PASS,
      database: process.env.MDB_DATABASE,
    });

    // Print connection thread
    console.log(`Maria DB is connected! (id=${db.threadId})`);
  } catch (err) {
    // Print error
    console.log(err);
  } finally {
    // Close connection
    // if (db) await db.close();
  }
}

connectMariadb();

// https://github.com/mariadb-corporation/mariadb-connector-nodejs/blob/master/documentation/promise-api.md
// query example
async function sdf() {
  const rows = await db.query('SELECT 1 as val');
  console.log(rows); //[ {val: 1}, meta: ... ]

  const res = await db.query('INSERT INTO someTable VALUES (?, ?, ?)', [
    1,
    Buffer.from('c327a97374', 'hex'),
    'mariadb',
  ]);
  //will send INSERT INTO someTable VALUES (1, _BINARY '.\'.st', 'mariadb')
}

async function findAll() {
  let topic = 'esp';
  let date = '2022-07-20';
  let timeStart = '18:46:00';
  let timeEnd = '18:49:00';
  const valArr = [topic, date, timeStart, timeEnd];
  //   const sql = 'SELECT * FROM ? WHERE Date = ? and Time >= ? and Time <= ?';
  const sql = `SELECT * FROM esp WHERE Date = '${date}' AND Time >= '${timeStart}' AND Time <= '${timeEnd}' limit 5`;

  // 아 왜틀렸대 문법이
  const rows = await db.query(sql);
  console.log(rows);

  return rows;
}

app.get('/hello', async (req, res) => {
  // 해시 찾고, 여기에서 파일 받고 저장해서
  // 클라이언트가 그 파일 꺼내서 보여줄수잇게 파일이름하고 경로 보내

  const list = await findAll();
  res.send({ hello: 'Hello Im from server', list });
});
app.get('/', (req, res) => {
  res.send('Server Response Success');
});

app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}/`);
});
