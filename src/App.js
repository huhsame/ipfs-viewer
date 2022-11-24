import React, { useState, useEffect, useRef } from 'react';
import axios from './axios.js';
// import useIpfsFactory from './hooks/use-ipfs-factory.js';
// import useIpfs from './hooks/use-ipfs.js';
import ChartSampleLine from './components/chartSampleLine.js';
import ChartLineTooltip from './components/chartLineTooltip.js';

import SearchView from './views/searchView';
import ReactPlayer from 'react-player';

import './App.css';

import Link from '@mui/material/Link';
import ProTip from './ProTip';

function App() {
  // ipfs 연결시 주석 해제
  // const { ipfs, ipfsInitError } = useIpfsFactory({ commands: ['id'] });
  // const id = useIpfs(ipfs, 'id');
  // const [version, setVersion] = useState(null);

  const playerRef = useRef(null);

  const [value, setValue] = useState(null);
  const [conditions, setConditions] = useState(null);
  const [seekAmount, setSeekAmount] = useState(null);
  const [dataCSI, setDataCSI] = useState([]);
  const [dataVideo, setDataVideo] = useState('');

  async function onConditions(conditions) {
    console.log(conditions);
    setConditions(conditions);
    const res = await axios.post('/metas', conditions); // 서버로 전달해야함.
    console.log(res.data);

    setDataCSI(res.data.dataCSI[0]);

    setDataVideo(res.data.video);
  }

  function clickCallback(timestamp) {
    console.log(timestamp);
    // timestamp를 동영상에서 몇초지점인지 변환해주어야 함.
    // setAmount( timestamp - 검색시작시간)
    // console.log(conditions.timestamp);

    let testCondition = {};
    testCondition.timestamp = new Date(
      'Sat Aug 20 2022 18:45:36 GMT+0900 (Korean Standard Time)'
    );
    setConditions(testCondition);
    // setSeekAmount((timestamp - conditions.timestamp) / 1000);
    playerRef.current.seekTo(10, 'seconds');
  }

  useEffect(() => {
    // ipfs 연결시 주석 해제, 밑에 [ipfs] 이것도
    // if (!ipfs) return;
    // const getVersion = async () => {
    //   const nodeId = await ipfs.version();
    //   setVersion(nodeId);
    // };
    // getVersion();

    // 테스트 코드.
    const getHello = async () => {
      const res = await axios.get('/hello');
      // setHello(res.data.hello);
      let dataCSI = res.data.dataCSI[0];
      // let data = dataCSI;
      let s = new Date(dataCSI[0].timestamp);
      let e = new Date(dataCSI[0].timestamp);

      e.setMinutes(s.getMinutes() + 1);
      console.log(s, e);
      const data = dataCSI.filter((item) => new Date(item.timestamp) < e);
      console.log(data);
      setDataCSI(data);
      // console.log(res.data.dataCSI[0]);
    };
    // const getVideo = async () => {
    //   const res = await axios.get('/video');
    // };
    getHello();
  }, []);
  // }, [ipfs]); // ipfs 값이 변경될때마다 effect 재실행
  return (
    <div>
      <SearchView onConditions></SearchView>
      <ReactPlayer
        ref={playerRef}
        playing
        controls
        url={[{ src: 'HhomeTemp.mp4', type: 'video/mp4' }]} // public폴더
      />
      <ChartLineTooltip
        data={dataCSI}
        clickCallback={clickCallback}
      ></ChartLineTooltip>
    </div>
  );
}

export default App;
