require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const mariadb = require('mariadb');
const ipfssh = require('./ipfs-sh.js');

const PORT = 3001;

const corsOptions = {
  origin: 'http://localhost:3000', //client
  Credential: true,
};
app.use(cors(corsOptions));
app.use(express.json());
// app.use(express.urlencoded({ extends: true }));

const DB_MODE = 'huh'; // none, l1, l8, huh
let db;
const huhDb = {
  host: process.env.LDB_HOST,
  port: process.env.LDB_PORT,
  user: process.env.LDB_USER,
  password: process.env.LDB_PASS,
  database: process.env.LDB_DATABASE,
};
const l1Db = {
  host: process.env.L1DB_HOST,
  // port: process.env.L1DB_PORT, // 아ㅣ오 이거떄문에 시간낭비
  user: process.env.L1DB_USER,
  password: process.env.L1DB_PASS,
  database: process.env.L1DB_DATABASE,
  // protocol: 'tcp',
};
const l8Db = {
  host: process.env.L8DB_HOST,
  port: process.env.L8DB_PORT,
  user: process.env.L8DB_USER,
  password: process.env.L8DB_PASS,
  database: process.env.L8DB_DATABASE,
};

if (DB_MODE !== 'none') {
  async function connectMariaDB() {
    try {
      // Create a new connection
      const config = DB_MODE === 'l1' ? l1Db : DB_MODE === 'l8' ? l8Db : huhDb;
      // console.log(config);
      db = await mariadb.createConnection(config);

      // Print connection thread
      console.log(`${DB_MODE} DB is connected! (id=${db.threadId})`);
    } catch (err) {
      // Print error
      console.log(err);
    } finally {
      // Close connection
      // if (db) await db.close();
    }
  }

  connectMariaDB();
}

async function findAll() {
  let topic = 'esp';
  let date = '2022-07-20';
  let timeStart = '18:46:00';
  let timeEnd = '18:49:00';
  const valArr = [topic, date, timeStart, timeEnd];
  //   const sql = 'SELECT * FROM ? WHERE Date = ? and Time >= ? and Time <= ?';
  const sql = `SELECT * FROM esp WHERE Date = '${date}' AND Time >= '${timeStart}' AND Time <= '${timeEnd}' limit 1`;
  // 난 천재야

  const metas = await db.query(sql);
  // 배열.
  // 한개의 meta는 이렇게 구성
  // {
  //   Hash: 'QmWpjEsocoLxU19geETNhmprD7XvvxM72zSRbePGLMYwZM',
  //   Date: 2022-07-19T15:00:00.000Z ,
  //   Time: '18:46:58',
  //   Publisher: 'esp3',
  //   Pin_add: 'Y',
  //   Get: 'Y',
  //   File_name: 'S3_20220720_18_46_58.csv'
  // }

  const list = [];
  metas.forEach(function (value, index, array) {
    let CSI = ipfssh.getCSIdatabyIPFS(value.Hash, value.File_name);

    list.push(CSI);
  });

  console.log(list);
  return list;
}

// 아 그래서 그래프큐엘이 좋다는거였구나.
// 하나씩 다 만들기 귀찮네
async function findMetas({ date, startTime, endTime }) {
  // console.log(date, startTime, endTime);
  const topic = 'cam';
  const sql = `SELECT hash, file_name  FROM ${topic} WHERE Date = '${date}' AND Time >= '${startTime}' AND Time < '${endTime}' ORDER BY Time DESC`;

  let metas = await db.query(sql);
  console.log(metas.length);
  let hashes = [];

  if (metas.length > 0) {
    metas.forEach(function (item, index, array) {
      hashes.push(item.hash);
    });
  }

  // console.log(hashes);

  return hashes;
}

async function getSample() {
  let CSI = ipfssh.getCSI();
  return [CSI];
}

app.get('/getCSIs', async (req, res) => {
  // 해시 찾고, 여기에서 파일 받고 저장해서
  // 클라이언트가 그 파일 꺼내서 보여줄수잇게 파일이름하고 경로 보내

  const list = await findAll();
  res.send({ list: list });
});

app.get('/hello', async (req, res) => {
  const dataCSI = await getSample();
  res.send({ hello: 'Hello Im from server', dataCSI });
});
app.get('getMetas', async (req, res) => {
  // 아 인풋..
  const metas = findMetas({});
});
app.get('/video', async (req, res) => {
  // ㅋㅋㅋ 하하하.
  // 일단 테스트용으로 해시 때려박아. .
  let hash = 'Qmb3pTFGxTLacdbndnoFNNonyUeW3RiM65iuKSprSpRfLm';
  let filename = '327.video.20220824133635.h264';
  let videoPath = ipfssh.getVideoByIPFS(hash, filename);

  res.send({ videoPath });
});
app.post('/metas', async (req, res) => {
  console.log(req.body);
  const conditions = req.body;
  console.log(conditions);
  let hashes = await findMetas(conditions);

  const videoPath = await ipfssh.getVideo(hashes, conditions);

  res.send(videoPath);
});
app.get('/', (req, res) => {
  res.send('Server Response Success');
});

app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}/`);
});
