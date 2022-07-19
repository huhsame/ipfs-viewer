import { create } from 'ipfs-http-client';
import { useEffect, useState } from 'react';
let ipfs = null;
const nodeAddr = '/ip4/127.0.0.1/tcp/5001';

export default function useIpfsFactory() {
  const [isIpfsReady, setIpfsReady] = useState(Boolean(ipfs));
  const [ipfsInitError, setIpfsInitError] = useState(null);

  useEffect(() => {
    connectIpfsDaemon();
    return function cleanup() {
      if (ipfs && ipfs.stop) {
        // console.log('Stopping IPFS');
        // ipfs.stop().catch((err) => console.error(err));
        ipfs = null;
        setIpfsReady(false);
      }
    };
  }, []);

  async function connectIpfsDaemon() {
    if (ipfs) {
      console.log('IPFS daemon already connected');
    } else if (ipfs && ipfs.enable) {
      console.log('Found ipfs');
      ipfs = await ipfs.enable({ commands: ['id'] });
      console.log(ipfs);
      const version = await ipfs.version();
      console.log('Version:', version.version);
    } else {
      try {
        console.time('IPFS Daemon Connected');
        ipfs = create(nodeAddr);
        const res = await ipfs.id();
        console.timeEnd('IPFS Daemon Connected');
        console.log(`Daemon active\nID: ${res.id}`);
      } catch (error) {
        console.error('Failed to connect to daemon: ', error);

        ipfs = null;
        setIpfsInitError(error);
      }
    }
    setIpfsReady(Boolean(ipfs));
  }

  return { ipfs, isIpfsReady, ipfsInitError };
}
