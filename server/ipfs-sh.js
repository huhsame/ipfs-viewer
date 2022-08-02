const fs = require('fs');
const fp = require('filepath');
const { exec } = require('child_process');
const path = require('path');
const Chart = require('chart.js');

const cid = 'QmWpjEsocoLxU19geETNhmprD7XvvxM72zSRbePGLMYwZM';
exec(`ipfs get ${cid}`, (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});

// function streamVideo(cid) {
//   const videoStream = fs.createReadStream(cid);
// }

const oldName = cid;
const newName = 'new.csv';

const fpOld = fp.newPath() + '/';
const fpNew = fp.newPath() + '/files/';

let oldPath = fpOld + oldName;
let newPath = fpNew + newName;

console.log('oldFilePath: ' + oldPath);
console.log('newFilePath: ' + newPath);

fs.rename(oldPath, newPath, function (err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('The file has been re-named to: ' + newPath);
});

// 원본 파일 삭제하기. - 왜자꾸 파일이없대? 폴더로 인식하는건가 확장자가 없어서 ?
// fs.unlink(oldPath, function (err) {
//   if (err) {
//     console.log('Error : ', err);
//   }
//   console.log('deleted');
// });
