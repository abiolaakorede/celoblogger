import './App.css';
import Head from "./components/Head"
import Hero from "./components/Hero"
import Main from './components/Main';

import { useState, useEffect } from "react";

import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";

import blog from "./contracts/blog.abi.json";
import IERC20 from "./contracts/ierc.abi.json";

const ERC20_DECIMALS = 18;

const contractAddress = "0x7FC3E6DaC1e7a58610c1f2B6C874Ba25103a198B";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

function App() {
  const [usdBalance, setUsdBalance] = useState(0);
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      return getUSDBalance();
    } else {
      console.log("no kit or address");
    }
  }, [kit, address]);

  useEffect(() => {
    if (contract) {
      getPosts();
    }
  }, [contract]);

  const connectWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        // notificationOff()
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];

        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        console.log("There is an error");
        console.log({ error });
      }
    } else {
      console.log("please install the extension");
    }
  };

  const getUSDBalance = async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);
      console.log(USDBalance);
      const contract = new kit.web3.eth.Contract(
        blog,
        contractAddress
      );
      setcontract(contract);
      setUsdBalance(USDBalance);
    } catch (error) {
      console.log(error);
    }
  };

  const createPost = async ({ title, image, author, content }) => {
    try {
      await contract.methods.createPost(author, image, title, content).send({ from: address });
      getPosts()
    } catch (error) {
      console.log(error)
    }
  }

  const tip = async({tip, index})=>{
    console.log(tip, index);
    const cUSDContract = new kit.web3.eth.Contract(IERC20, cUSDContractAddress);
    try {
      const _amount = new BigNumber(tip)
        .shiftedBy(ERC20_DECIMALS)
        .toString();
      await cUSDContract.methods
        .approve(contractAddress, _amount)
        .send({ from: address });
      await contract.methods.tipPost(index, _amount).send({from: address})
    } catch (error) {
      console.log(error);
    } finally{
      getPosts()
    }
  }

  const getPosts = async () => {
    try {
      const postCount = await contract.methods.getPostCount().call();
      const _posts = [];

      for (let index = 0; index < postCount; index++) {
        let _post = new Promise(async (resolve, reject) => {
          try {
            let post = await contract.methods.displayPost(index).call();
            resolve({
              index: index,
              owner: post[0],
              author: post[1],
              image: post[2],
              title: post[3],
              content: post[4],
              tippers: post[5]
            });
          } catch (error) {
            console.log(error);
            alert(error)
          }
        });
        _posts.push(_post);
      }
      const posts = await Promise.all(_posts);
      console.log(posts);
      setPosts(posts);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Head balance={usdBalance} />
      <Hero />
      <Main posts={posts} createPost={createPost} tipFunction = {tip}/>
    </>
  );
}

export default App;
