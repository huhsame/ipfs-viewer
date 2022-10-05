import React, { useState, useEffect } from 'react';
import axios from './axios.js';
// import useIpfsFactory from './hooks/use-ipfs-factory.js';
// import useIpfs from './hooks/use-ipfs.js';
import ChartSampleLine from './components/chartSampleLine.js';
import SearchView from './views/searchView';
import ReactPlayer from 'react-player';

import './App.css';

import Link from '@mui/material/Link';
import ProTip from './ProTip';

function App() {
  // const { ipfs, ipfsInitError } = useIpfsFactory({ commands: ['id'] });
  // const id = useIpfs(ipfs, 'id');
  // const [version, setVersion] = useState(null);
  const [value, setValue] = useState(null);
  const [dataCSI, setDataCSI] = useState([]);

  useEffect(() => {
    // if (!ipfs) return;
    // const getVersion = async () => {
    //   const nodeId = await ipfs.version();
    //   setVersion(nodeId);
    // };
    // getVersion();
    // const getHello = async () => {
    //   const res = await axios.get('/hello');
    //   setHello(res.data.hello);
    //   setDataCSI(res.data.dataCSI[0]);
    //   // console.log(res.data.dataCSI[0]);
    // };
    // const getVideo = async () => {
    //   const res = await axios.get('/video');
    // };
    // getHello();
  }, []);
  // }, [ipfs]); // ipfs 값이 변경될때마다 effect 재실행
  return (
    <div>
      <SearchView></SearchView>
      <ReactPlayer
        playing
        controls
        url={[{ src: '327.video.20220824133635.mp4', type: 'video/mp4' }]}
      />
      <ChartSampleLine data={dataCSI}></ChartSampleLine>
    </div>
  );
}

export default App;
