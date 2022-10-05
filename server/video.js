const ffmpeg = require('fluent-ffmpeg');

exports.convertToMP4 = function (inFilename) {
  //   const inExtension = '.h264';
  const outExtension = '.mp4';
  const outFilename = inFilename.split('.').pop() + outExtension;

  ffmpeg(inFilename).outputOptions('-c:v', 'copy').save(outFilename);

  return outFilename;
};
