const fs = require('fs');
const fp = require('filepath');
const { exec, execSync, spawnSync, spawn } = require('child_process');
const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const { KeyboardReturnOutlined } = require('@mui/icons-material');
ffmpeg.setFfmpegPath(ffmpegPath);

exports.getCSIdatabyIPFS = function (hash, filename) {
  // 개짜증난다. 여기 일단 포기해
  // 그래프 부터 그려

  let CSI = {};
  downloadFileByHashes(hash);
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
  let dataCSI = getCSIfromCSV(
    '/Users/huh/workspace/ipfs-viewer/files/S3_20220720_18_46_58.csv'
  );

  return dataCSI;
};

exports.getVideo = async function (hashes, conditions) {
  const videoName = `${conditions.date} ${conditions.startTime}~${conditions.endTime}`;
  const video = await downloadFileByHashes(hashes, videoName);
  // const video = await concatVideos(hashes, conditions);

  // [condition  구조]
  // conditions = {
  //   date: date.format('YYYY-MM-DD'),
  //   startTime: startTime.format('HH:mm:ss'),
  //   endTime: endTime.format('HH:mm:ss'),
  // }

  // Check if the file exists in the current directory.
  fs.access(video, fs.constants.F_OK, (err) => {
    if (err) {
      console.log('the video does not exist');
      return false;
    } else {
      console.log('the video exists');
      return video;
    }
  });
};

// https://sakeoflearning.com/run-multiple-shell-commands-using-node-js/
function downloadFileByHashes(hashes) {
  // shell 명령어로 ipfs get 실행

  let cmd = 'ipfs get ' + hashes.join(' && ipfs get ');

  const shell = exec(cmd);
  // 하나의 애기에서 계속 할 수 있도록

  shell.stdout.on('data', (output) => {
    console.log(output.toString());
    if (output.toString().includes(hashes[hashes.length - 1])) {
      console.log('finished file downloading');
      const video = concatVideos(hashes);
      console.log('어찌되나 보자 여기는 콘캣비디오 부른 다음줄');

      return video;
    }
  });
}

function concatVideos(hashes, videoName) {
  const videoPath = 'videos/';
  const videoTempPath = videoPath + 'tempDir';

  let merger = ffmpeg(videoPath + hashes[0]);

  // 비디오의 개수를 알아야함
  const numberOfVideos = hashes.length;

  // 위에서 하나는 인풋 넣었으니까 0부터 말고 1부터.
  for (let i = 1; i < numberOfVideos; i++) {
    merger = merger.input(videoPath + hashes[i]);
  }

  merger
    .on('error', function (err) {
      console.log('An error occurred: ' + err.message);
    })
    .on('end', function () {
      console.log('Merging finished !');

      return videoPath + videoName;
    })
    .mergeToFile(videoPath + videoName + '.mp4', videoTempPath);
}

// 다운로드가 완료되면 파일이름 변경하기
// 다운이 다 되었는지 어떻게 알지?
function setFileName(hash, filename) {
  const oldName = hash;
  const newName = filename;

  const fpOld = fp.newPath() + '/';
  const fpNew = fp.newPath() + '/public/';

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
      console.log('file is moved in public directory');
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

function getCSIfromCSV(path) {
  const csvfile = fs.readFileSync(path, 'utf8');
  const rows = csvfile.split('\n');
  const length = 52; // the number of columns
  let data = [];

  rows.forEach(function (currentRow, index, rowsArray) {
    const row = currentRow.split(','); // 한줄
    const valuesOfRow = row.slice(0, row.length - 7 - 2);
    // 뒤에 이상한값 2개가 더 있어서 빼버림

    const time = row.slice(row.length - 7, row.length);
    const timestamp = new Date(
      Number(time[0]), // year
      Number(time[1]), // month
      Number(time[2]), // day
      Number(time[3]), // hour
      Number(time[4]), // min
      Number(time[5]), // second
      Number(time[6]) // ms
    );

    valuesOfRow.forEach(function (value, index, array) {
      if (index < length - 1) {
        let rowData = {};

        rowData['subcarrier'] = index;
        rowData['timestamp'] = Date.parse(timestamp);
        rowData['value'] = Number(value);

        data.push(rowData);
      }
    });
    data.sort(function (a, b) {
      return a.timestamp - b.timestamp;
    });
  });
  return [...new Set(data)]; // 왤케 중복이 돼 ...? 중복제거
}
