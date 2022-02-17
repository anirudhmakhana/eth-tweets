import * as React from "react";
import { ethers } from "ethers";
import { Spinner } from "./Component/Spinner";
import './App.css';

export default function App() {
  // User input
  const [waveMessage, setWaveMessage] = React.useState("");
  
  // State updated by listenersz`
  const [currentAccount, setCurrentAccount] = React.useState('');
  const [allWaves, setAllWaves] = React.useState([]);
  const [loading, setLoading] = React.useState(false)


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
            <button onClick={""} className="font-sans border border-black p-4">
              Connect to Metamask
            </button>
          )

          : (
            <div className="flex flex-col justify-center font-sans">
              <textarea
              placeholder="Enter your message here :)" 
              className="resize-none w-96 h-48 border-2 p-2 my-4" 
              value={""} 
              onChange={""}

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
                    Wave at me!
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
