import './App.css';
import Header from './components/header/Header';
import {useState, useEffect} from 'react'
import Footer from './components/Footer/Footer';


function App() {
  // a flag for keeping track of whether or not a user is connected
  const [connected, setConnected] = useState(false);

  // connected user details
  const [userInfo, setUserInfo] = useState({
    matic_balance: 0,
    token_balance: 0,
    address: null,
  });

  // handler for when user switch from one account to another or completely disconnected
  const handleAccountChanged = async (accounts) => {
    if (!!accounts.length) {
      const networkId = await window.ethereum.request({
        method: "eth_chainId",
      });
      if (Number(networkId) !== 80001) return;
      const accountDetails = await getAccountDetails(accounts[0]);

      setUserInfo({
        matic_balance: accountDetails.userMaticBal,
        token_balance: accountDetails.userBRTBalance,
        address: accounts[0],
      });
      setConnected(true);
    } else {
      setConnected(false);
      setUserInfo({
        matic_balance: 0,
        token_balance: 0,
        address: null,
      });
    }
  };

  // handler for handling chain/network changed
  const handleChainChanged = async (chainid) => {
    if (Number(chainid) !== 80001) {
      setConnected(false);
      setUserInfo({
        matic_balance: 0,
        token_balance: 0,
        address: null,
      });

      return alert(
        "You are connected to the wrong network, please switch to polygon mumbai"
      );
    } else {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (!accounts.length) return;
      const accountDetails = await getAccountDetails(accounts[0]);
      setUserInfo({
        matic_balance: accountDetails.userMaticBal,
        token_balance: accountDetails.userBRTBalance,
        address: accounts[0],
      });
      setConnected(true);
    }
  };

  // an handler to eagerly connect user and fetch their data
  const eagerConnect = async () => {
    const networkId = await window.ethereum.request({ method: "eth_chainId" });
    if (Number(networkId) !== 80001) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    if (!accounts.length) return;
    const accountDetails = await getAccountDetails(accounts[0]);
    setUserInfo({
      matic_balance: accountDetails.userMaticBal,
      token_balance: accountDetails.userBRTBalance,
      address: accounts[0],
    });
    setConnected(true);
  };

  // a function for fetching necesary data from the contract and also listening for contract event when the page loads
  const init = async () => {
    const customProvider = new ethers.providers.JsonRpcProvider(
      process.env.REACT_APP_RPC_URL
    );
    const BRTContractInstance = new Contract(
      BRTTokenAddress,
      BRTTokenAbi,
      customProvider
    );
  
  return (
    <div className="App">
      <Header
        connectWallet={connectWallet}
        connected={connected}
        userInfo={userInfo}
      />
      <Footer />
    </div>
  );
}}

export default App;
