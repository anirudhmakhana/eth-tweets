import * as React from "react";
import { ethers } from "ethers";
import { Spinner } from "./Component/Spinner";
import './App.css';

import abi from "./utils/TwitterAccount.json"

function TweetLogger({waver, timestamp, message}) {
  return (
    <div className="w-full border-2 border-purple-400 flex justify-between my-4">
      <div className="flex flex-col p-4">
        <p className="text-xl font-bold">
          Tweeted By
        </p>
        <a className="text-lg text-blue-600 p-2" href={`https://rinkeby.etherscan.io/address/${waver}`} target="_blank" rel="noopener noreferrer">
          {waver.slice(0,4) + "..." + waver.slice(-4)}
        </a>
      </div>

      <div className="flex flex-col p-4">
        <p className="text-xl font-bold max-w-md">
          Tweeted at
        </p>
        <p className="text-lg p-2">
          {`${new Date(timestamp * 1000)}`}
        </p>
      </div>

      <div className="flex flex-col p-4 min-w-lg w-64">
        <p className="text-xl font-bold">
          Message
        </p>
        <p className="text-lg p-2">
          {message.length > 20 ? message.slice(0, 20) + "..." : message}
        </p>
      </div>
    </div>
  )
}

export default function App() {
  // User input
  const [waveMessage, setWaveMessage] = React.useState("");
  
  // State updated by listeners
  const [currentAccount, setCurrentAccount] = React.useState('');
  const [allTweets, sestAllTweets] = React.useState([]);
  const [loading, setLoading] = React.useState(false)

  // Contract variables
  const contractAddress = " 0x633d1c17A8D17f0dCc67B285684e060056FB6027"
  const contractABI = abi;

  async function getAllTweets() {

    const externalProvider = new ethers.providers.JsonRpcProvider(
      `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_KEY_PRIVATE_ID}`,
      "rinkeby"
    );
    const twitterAccountContract = new ethers.Contract(contractAddress, contractABI, externalProvider);
    

    const filter = twitterAccountContract.filters.NewTweet()
    const startBlock = 10186022; // Contract creation block.
    const endBlock = await externalProvider.getBlockNumber();
    
    console.log("hello", endBlock)

    const queryResult = await twitterAccountContract.queryFilter(filter, startBlock, endBlock);
    
    const tweetsUptilNow = queryResult.map(matchedEvent => {
      return (
        {
          waver: matchedEvent.args[0],
          timestamp: matchedEvent.args[1],
          message: matchedEvent.args[2]
        }
      )        
    })

    console.log(queryResult)

    sestAllTweets(tweetsUptilNow.reverse())
  }

  // Initialize listeners and check if already connected to Metamask.
  React.useEffect(() => {

    if(typeof window.ethereum !== undefined) {

      const { ethereum } = window;

      const externalProvider = new ethers.providers.JsonRpcProvider(
        `https://eth-rinkeby.alchemyapi.io/v2/${process.env.REACT_APP_ALCHEMY_KEY}`,
        "rinkeby"
      );
      //const waveportalContract = new ethers.Contract(contractAddress, contractABI, externalProvider);
      
      // Check if already connected with metamask
      ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if(!!accounts.length) {
            const account = accounts[0];
            setCurrentAccount(account);
          }
        })      

      // Initialize listeners

      ethereum.on("chainChanged", (chainId) => {
        // Only Rinkeby
        if(chainId != 4) {
          alert("Please switch to the Rinkeby network to use the webapp.");
        }
      })

      ethereum.on("accountsChanged", (accounts) => {

        if(accounts.length == 0) {
          setCurrentAccount('')
        } else {
          const account = accounts[0];
          setCurrentAccount(account);
        }        
      })
  
    }

  }, [])

  // Connect to metamask
  async function connectToMetamask() {
    const { ethereum } = window;

    if(!ethereum) {
      alert("Please install Metamask to continue using the webapp.");
    }

    setLoading(true)

    ethereum.request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        console.log(accounts[0])
        setLoading(false)
      })
      .catch(err => alert(
        err.message
      ));
  }


  const waveButtonActive = !!currentAccount
  return (
    <div className="m-auto flex justify-center my-4" style={{maxWidth: "800px"}}>
    <div className="flex flex-col">

      <p className="text-5xl text-center font-black text-gray-900 py-8 font-sans">
        Hey👋 I'm Anirudh.
      </p>

      <p className="font-sans text-xl text-center font-light text-gray-700 py-8">
        Tweet at me on the Ethereum blockchain! <br /> Connect your wallet,
        write your message, and then tweet .  
      </p>

      <div className="m-auto">
        {!currentAccount
          ? (
            <button onClick={connectToMetamask} className="font-sans border border-black p-4">
              Connect to Metamask
            </button>
          )

          : (
            <div className="flex flex-col justify-center font-sans">
              <textarea
              placeholder="Enter your message here :)" 
              className="resize-none w-96 h-48 border-2 p-2 my-4" 
              value={waveMessage} 
              onChange={e => setWaveMessage(e.target.value)}

              />

              <button
                disabled={!waveButtonActive}
                className={`p-2 border ${!waveButtonActive ? "border-gray-300 text-gray-300" : "border-black"}`}
                onClick={""}
              >
                {loading && (
                  <div className="m-auto flex justify-center">
                    <Spinner
                      color={"black"}
                      style={{ height: "25%", marginLeft: "-1rem" }}
                    />
                  </div>
                )}

                {!loading && (
                  <p>
                    Tweet at me!
                  </p>
                )}
              </button>
            </div>
          )
        }
      </div>

      <div className="m-auto flex flex-col justify-center py-8">
        <p className="font-sans text-4xl font-extrabold text-gray-800 py-4">
          Tweet log 👀
        </p>
        <p className="font-sans center">
          {"Check out all these people out here waving!"}
        </p>

      </div>
    </div>
  </div>
  )
}
