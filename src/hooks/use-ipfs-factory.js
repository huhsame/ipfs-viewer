import ipfsHttp from 'ipfs-http-client';
import { useEffect, useState } from 'react';
let ipfs = null;
const nodeAddr = '/ip4/127.0.0.1/tcp/5002/http';

export default function useIpfsFactory() {
  const [isIpfsReady, setIpfsReady] = useState(Boolean(ipfs));
  const [ipfsInitError, setIpfsInitError] = useState(null);

  useEffect(() => {}, []);

  async function connectIpfsDaemon() {
    if (ipfs) {
      console.log('IPFS daemon already connected');
    } else {
      try {
        console.time('IPFS Daemon Connected');
        ipfs = ipfsHttp.create(nodeAddr);
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
}
