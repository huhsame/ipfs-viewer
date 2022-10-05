const fs = require('fs');
const fp = require('filepath');
const { exec, execSync, spawnSync, spawn } = require('child_process');
const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const { KeyboardReturnOutlined } = require('@mui/icons-material');
ffmpeg.setFfmpegPath(ffmpegPath);

// 내가 지금 하고 싶은거는 동영상을 합치는거.
// 그리고 그래프 보여주는거.
// 합치는거 먼저 해보자.
//

//
console.log('test started');

// 해시로 하면 디비에서 배열을 가져와서, foreach로 파일을 불러와야겠군
// 그냥 한다면, 미리 파일명을 변경 시켜놔야함.
//
function concatVideosTest() {
  const videoPath = 'videos/';
  const videoTempPath = videoPath + 'tempDir';

  let videoName = 'apple'; // 뭐 그때 조건검색했을때 있는 애로 해두면 나중에 볼때 편할듯

  let merger = ffmpeg('videos/videotest1.mp4');

  // 비디오의 개수를 알아야함
  const numberOfVideos = 10;

  //   for (let i = 0; i < numberOfVideos; i++) {
  //     merger.input(videoPath + videoName + i);
  //   }

  merger
    .input(videoPath + 'QmcEHfMMWE7rLmdNkbA2da974XbhGgmAGebTMNNJkfLe2g')
    .input(videoPath + 'QmcT3rnEcHBsPUEVbi52XoTJNYyzWkrTiAA6oRSSapD7nM');
  merger
    .on('error', function (err) {
      console.log('An error occurred: ' + err.message);
    })
    .on('end', function () {
      console.log('Merging finished !');
    })
    .mergeToFile('videos/merged.mp4', videoTempPath);
}

function concatVideos(hashes) {
  const videoPath = 'videos/';
  const videoTempPath = videoPath + 'tempDir';

  let videoName = 'apple'; // 뭐 그때 조건검색했을때 있는 애로 해두면 나중에 볼때 편할듯

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
    })
    .mergeToFile(videoPath + videoName + '.mp4', videoTempPath);
}

concatVideos();
