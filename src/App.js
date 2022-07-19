import React, { useState, useEffect } from 'react';
import useIpfsFactory from './hooks/use-ipfs-factory.js';
import useIpfs from './hooks/use-ipfs.js';

import './App.css';

function App() {
  const { ipfs, ipfsInitError } = useIpfsFactory({ commands: ['id'] });
  const id = useIpfs(ipfs, 'id');
  const [version, setVersion] = useState(null);

  useEffect(() => {
    if (!ipfs) return;

    const getVersion = async () => {
      const nodeId = await ipfs.version();
      setVersion(nodeId);
    };

    getVersion();
  }, [ipfs]); // ipfs 값이 변경될때마다 effect 재실행
  return (
    <div className='App'>
      <header className='App-header'>
        <p>what should i do</p>
      </header>
    </div>
  );
}

export default App;
