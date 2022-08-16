import React, { useState, useEffect } from 'react';
import axios from './axios.js';
// import useIpfsFactory from './hooks/use-ipfs-factory.js';
// import useIpfs from './hooks/use-ipfs.js';
import ChartSampleLine from './components/chartSampleLine.js';

import './App.css';

function App() {
  // const { ipfs, ipfsInitError } = useIpfsFactory({ commands: ['id'] });
  // const id = useIpfs(ipfs, 'id');
  // const [version, setVersion] = useState(null);
  const [hello, setHello] = useState(null);
  const [dataCSI, setDataCSI] = useState([]);

  useEffect(() => {
    // if (!ipfs) return;

    // const getVersion = async () => {
    //   const nodeId = await ipfs.version();
    //   setVersion(nodeId);
    // };

    // getVersion();

    const getHello = async () => {
      const res = await axios.get('/hello');
      setHello(res.data.hello);
      setDataCSI(res.data.dataCSI[0]);
      // console.log(res.data.dataCSI[0]);
    };
    getHello();
  }, []);
  // }, [ipfs]); // ipfs 값이 변경될때마다 effect 재실행
  return (
    <div>
      <p>{hello}</p>
      <ChartSampleLine data={dataCSI}></ChartSampleLine>
    </div>
  );
}

export default App;
