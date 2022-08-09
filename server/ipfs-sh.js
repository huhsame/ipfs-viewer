const fs = require('fs');
const fp = require('filepath');
const { exec, execSync, spawnSync, spawn } = require('child_process');
const path = require('path');
// const Chart = require('chart.js');

exports.getCSIdatabyIPFS = function (hash, filename) {
  // 개짜증난다. 여기 일단 포기해
  // 그래프 부터 그려
  let CSI = {};
  downloadFileByCID(hash);
  let waiting = 5000;
  setTimeout(() => {
    let newPath = setFileName(hash, filename);
    CSI = getCSIfromCSV(newPath);
  }, waiting);

  return CSI;
  // { timestamp: date, data:[number, ... ]}
};

// for test
exports.getCSI = function () {
  let CSI = {};

  CSI = getCSIfromCSV(
    '/Users/huh/workspace/ipfs-viewer/files/S3_20220720_18_46_58.csv'
  );

  return CSI;
  // { timestamp: date, data:[number, ... ]}
};
function downloadFileByCID(cid) {
  // shell 명령어로 ipfs get 실행
  const cmd = spawn('ipfs', ['get', `${cid}`]);
  cmd.stdout.on('data', (output) => console.log(output.toString()));
}

// 다운로드가 완료되면 파일이름 변경하기
// 다운이 다 되었는지 어떻게 알지?
function setFileName(hash, filename) {
  const oldName = hash;
  const newName = filename;

  const fpOld = fp.newPath() + '/';
  const fpNew = fp.newPath() + '/files/';

  let oldPath = fpOld + oldName;
  let newPath = fpNew + newName;

  // console.log('oldFilePath: ' + oldPath);
  console.log('newFilePath: ' + newPath);

  try {
    fs.rename(oldPath, newPath, function (err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log('file is downloaded');
    });
  } catch (err) {
    // console.log(err);
  }

  // try {
  //   if (fs.existsSync(oldPath)) {
  //     const newFile = fs.renameSync(oldPath, newPath);
  //     // const data = fs.readFileSync(newPath, 'utf8');
  //     console.log('here');
  //   } else {
  //     console.log('not exist');
  //   }
  // } catch (err) {
  //   console.log(err);
  // }

  return newPath;
}

// function streamVideo(cid) {
//   const videoStream = fs.createReadStream(cid);
// }

// 원본 파일 삭제하기. - 왜자꾸 파일이없대? 폴더로 인식하는건가 확장자가 없어서 ?
// fs.unlink(oldPath, function (err) {
//   if (err) {
//     console.log('Error : ', err);
//   }
//   console.log('deleted');
// });

function getCSIfromCSV(path) {
  const csvfile = fs.readFileSync(path, 'utf8');
  const rows = csvfile.split('\n');
  let jsonArray = [];

  rows.forEach(function (currentRow, index, rowsArray) {
    let obj = {};
    let row = currentRow.split(','); // 한줄

    let data = row.slice(0, row.length - 7);

    data.forEach(function (value, index, dataArray) {
      dataArray[index] = Number(value);
    });
    obj['data'] = data;

    let time = row.slice(row.length - 7, row.length);
    // console.log(time);

    const timestamp = new Date(
      Number(time[0]), // year
      Number(time[1]), // month
      Number(time[2]), // day
      Number(time[3]), // hour
      Number(time[4]), // min
      Number(time[5]), // second
      Number(time[6]) // ms
    );
    console.log(timestamp);

    obj['timestamp'] = timestamp;

    jsonArray.push(obj);
    // console.log(obj);
  });
  return jsonArray;
}
