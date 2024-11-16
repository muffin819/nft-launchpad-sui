'use client'
import { checkMintStatus, checkWL, getArts, restoreArts } from "@/api/api";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import { SuiChainId, useAccountBalance, useWallet } from "@suiet/wallet-kit";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Input, Progress, Spinner } from "@nextui-org/react";
import Image from "next/image";
import { button } from "@/styles/button";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { truncateText } from "@/util/fasautil";
import Countdown from "react-countdown";


export interface IUserInfo {
  address: string;
  mintcount: number;
  mintlimit: number;
  price: number;
  status: number;
  type: string;
}

const Home = () => {
  // const { userInfo, setUserInfo } = useContext(ConnectionStatusContext)
  const [userInfo, setUserInfo] = useState<IUserInfo>()
  const [mintCount, setMintCount] = useState("1")
  const [totalMintCount, setTotalMintCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState<any>(undefined)
  const [timer, setTimer] = useState<any>()
  const sampleNft = new Map([
    [
      "sui:devnet",
      `${process.env.NEXT_PUBLIC_PACKAGEID}::nft::mint`,
    ],
    [
      "sui:testnet",
      `${process.env.NEXT_PUBLIC_PACKAGEID}::nft::mint`,
    ],
    [
      "sui:mainnet",
      `${process.env.NEXT_PUBLIC_PACKAGEID}::nft::mint`,
    ],
  ]);

  const wallet = useWallet();
  const { balance } = useAccountBalance();
  const nftContractAddr = useMemo(() => {
    if (!wallet.chain) return "";
    wallet.account?.publicKey
    return sampleNft.get(wallet.chain.id) ?? "";
  }, [wallet]);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });


  function uint8arrayToHex(value: Uint8Array | undefined) {
    if (!value) return "";
    // @ts-ignore
    return value.toString("hex");
  }

  async function getCoinIds(address: string, coinType: string = '0x2::sui::SUI') {
    try {
      const client = new SuiClient({
        url: process.env.NEXT_PUBLIC_RPC ? process.env.NEXT_PUBLIC_RPC : getFullnodeUrl('mainnet'), // Use the appropriate network
      });
      // Query to get all coins of the specific type
      const coins = await client.getCoins({
        owner: address,
        coinType: coinType,
      });
      const sortedCoins = coins.data.sort((a: any, b: any) => b.balance - a.balance);

      console.log("coins", sortedCoins)

      // Extract and return the coin IDs
      const coinIds = sortedCoins.map((coin) => coin.coinObjectId);
      return coinIds;
    } catch (error) {
      console.error('Error fetching coin IDs:', error);
      return [];
    }
  }

  async function handleExecuteMoveCall(target: string | undefined) {
    if (!target) return;
    let pendingArts: any
    fetchMintStatus()
    try {
      if (userInfo && wallet.address) {
        setLoading(true)
        if (timer)
          clearTimeout(timer)
        const result = await getArts(wallet.address, parseInt(mintCount))
        if (result?.success === false) {
          Swal.fire({
            title: "Mint Limit",
            text: result.error.message,
            icon: "error"
          })
          setLoading(false)
          return
        }
        pendingArts = result.data.arts
        const tx = new Transaction();
        const client = new SuiClient({
          url: process.env.NEXT_PUBLIC_RPC ? process.env.NEXT_PUBLIC_RPC : getFullnodeUrl('mainnet'), // Use the appropriate network
        });
        // Query to get all coins of the specific type
        const coinid = await getCoinIds(wallet.address)

        // if (coinid.length === 1) {
        //   Swal.fire({
        //     title: "Info",
        //     text: `You have only one Coin Object, Let's divide it to two and mint again`,
        //     icon: "info"
        //   })
        //   const [coins] = tx.splitCoins(tx.gas, [tx.pure.u64(100000000)]);
        //   tx.transferObjects([coins], tx.pure.address(wallet?.address));
        //   const resultdata = await signAndExecuteTransaction(wallet, tx, undefined)
        //   return
        // }

        console.log("clinid", coinid)
        // const coinsToPay = (await client.getAllCoins({ owner: wallet?.address + '' }))?.data as any;
        // const CoinObj = coinsToPay.coinObjectId;

        // console.log("CoinObj", coinsToPay)

        // const newcoins2 = tx.splitCoins(tx.gas, [tx.pure(300000000)]);


        let nameBuffer = ["name"]
        let valueBuffer = ["value"]
        for (const att of pendingArts.attributes) {
          nameBuffer.push(att.trait_type)
          valueBuffer.push(att.value)
        }
        // const newcoins1 = tx.splitCoins(tx.gas, [tx.pure.u32(3000000000)]);
        // // const newcoins2 = tx.splitCoins(tx.gas, [tx.pure(300000000)]);
        // tx.transferObjects(
        //   [
        //     newcoins1,
        //     // newcoins2
        //   ],
        //   tx.pure.address(wallet.address),
        // );

        // const buff = {
        //   objectId: coinsToPay[0].coinObjectId,
        //   version: coinsToPay[0].version,
        //   digest: coinsToPay[0].digest
        // }
        // const coinbuff = []
        // coinbuff.push(buff)
        // tx.setGasPayment(coinbuff);
        // tx.setGasBudget(100000000);
        // console.log("spilit", coins)
        // tx.transferObjects([coinWithBalance({ balance: 100, useGasCoin: true })], wallet.address);

        const [staking_contract_coin_object] = tx.splitCoins(tx.gas, [tx.pure.u64(userInfo.price > 0 ? userInfo.price * 1000000000 : 10000000)]);

        tx.moveCall({
          target: target as any,
          arguments: [
            tx.object(process.env.NEXT_PUBLIC_TREASURY ? process.env.NEXT_PUBLIC_TREASURY : "0x2585efbfefc26ac4c0eb76bd4404347e97df9990f15aa17d6f6a1c6d88f5ace8"),
            tx.object(staking_contract_coin_object),
            tx.object("0x6"),
            tx.pure.string(pendingArts.name),
            tx.pure.string(`QmcDxxA2N5KgC8XPAEAPUEhAVRQKhMGEEWyzPudeSBMVzy/Sui Lord %23${pendingArts.index}.png`),
            tx.pure.string(pendingArts.description),
            tx.pure.vector('string', nameBuffer),
            tx.pure.vector('string', valueBuffer),
          ],
        });
        tx.transferObjects([staking_contract_coin_object], tx.pure.address(wallet.address));
        // tx.setGasPayment(coinbuff)
        // tx.setGasPrice(1000000)
        tx.setGasBudget(10000000)
        // tx.setGasPrice(1000000)
        const resultdata = await signAndExecuteTransaction(wallet, tx, pendingArts)
      }
      else {
        Swal.fire({
          title: "Error",
          text: `Failed to getting user info. Please connect wallet again`,
          icon: "error"
        })
      }
    } catch (e) {
      console.log("Error", e)
      Swal.fire({
        title: "Error",
        text: `Transaction failed`,
        icon: "error"
      }).then(async () => {
        setLoading(false)
        const result = await restoreArts(pendingArts)
        console.log("restore result", result)
      })
    }
  }

  async function signAndExecuteTransaction(wallet: any, tx: any, pendingArts: any) {
    try {
      const response = await wallet.signAndExecuteTransaction({
        transaction: tx,
      });

      console.log("transaction response", response)
      // Check the transaction status
      if (!response.effects) {
        setLoading(false)
        console.error('Transaction failed:', response);
        Swal.fire({
          title: "Error!",
          text: `Transaction failed`,
          icon: "error"
        })
        if (pendingArts !== undefined) {
          const result = await restoreArts(pendingArts)
          console.log("restore result", result)
        }
        // Handle failure case here (e.g., show error message)
        return "error"
      } else {
        console.log('Transaction successful:', response);
        // Perform additional success operations here (e.g., update UI, database)
        Swal.fire({
          title: "Transaction sent!",
          icon: "info"
        })
        if (timer)
          clearTimeout(timer)
        setTimer(setTimeout(() => {
          fetchMintStatus()
          setLoading(false)
        }, 10000))
        return "success"
      }
    } catch (error) {
      console.error('Error during transaction:', error);
      setLoading(false)
      // Handle errors that may occur during the signing or execution process
      Swal.fire({
        title: "Error!",
        text: `Transaction failed ${error}`,
        icon: "error"
      })
      if (pendingArts !== undefined) {
        const result = await restoreArts(pendingArts)
        console.log("restore result", result)
      }
      return "error"
    }
  }

  // async function handleSignMsg() {
  //   if (!wallet.account) return;
  //   try {
  //     const msg = "Hello world!";
  //     const msgBytes = new TextEncoder().encode(msg);
  //     const result = await wallet.signPersonalMessage({
  //       message: msgBytes,
  //     });
  //     const verifyResult = await wallet.verifySignedMessage(
  //       result,
  //       wallet.account.publicKey
  //     );
  //     console.log("verify signedMessage", verifyResult);
  //     if (!verifyResult) {
  //       alert(`signMessage succeed, but verify signedMessage failed`);
  //     } else {
  //       alert(`signMessage succeed, and verify signedMessage succeed!`);
  //     }
  //   } catch (e) {
  //     console.error("signMessage failed", e);
  //     alert("signMessage failed (see response in the console)");
  //   }
  // }

  const chainName = (chainId: string | undefined) => {
    switch (chainId) {
      case SuiChainId.MAIN_NET:
        return "Mainnet";
      case SuiChainId.TEST_NET:
        return "Testnet";
      case SuiChainId.DEV_NET:
        return "Devnet";
      default:
        return "Unknown";
    }
  };


  useEffect(() => {
    if (userInfo && (userInfo?.mintlimit - userInfo?.mintcount) < parseInt(mintCount)) {
      Swal.fire({
        title: "Mint Limit reached",
        text: `There is mint limit. Only ${userInfo.mintlimit - userInfo.mintcount} available`,
        icon: "info"
      });
      setMintCount((userInfo.mintlimit - userInfo.mintcount).toString())
    }
  }, [mintCount])


  const fetchUserInfo = async () => {
    const result = await checkWL(wallet.address!!)
    console.log("result", result)
    if (result) {
      console.log("should set userinfo")
      setUserInfo(result.data)
    }
  }

  useEffect(() => {
    if (wallet.address) {
      fetchUserInfo()
    }
  }, [wallet])


  const fetchMintStatus = async () => {
    const result = await checkMintStatus()
    if (result?.data) {
      setTotalMintCount(result.data.mintCount)
      setStage(result.data.stage)
    }
    else {
      Toast.fire({
        icon: "error",
        title: "Connecting server failed!"
      });
    }
  }

  useEffect(() => {
    fetchMintStatus()
  }, [])

  useEffect(() => {
    // Create a new EventSource
    const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}api/events`); // Adjust the path to match your SSE endpoint
    // Event listener for incoming messages

    eventSource.onmessage = (event) => {
      console.log("event", event.data)
      try {
        const data = JSON.parse(event.data)
        if (data?.totalminted) {
          setTotalMintCount(data.totalminted)
          setStage(data.stage)
          if (data.newMint.owner === wallet.address) {
            setLoading(false)
          }
          Toast.fire({
            icon: "success",
            title: `${data.newMint.name} minted by ${truncateText(data.newMint.owner, 10)}`
          });
        }
      }
      catch (error) {
        console.log("Error", error)
      }
      // setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    // Handle connection errors
    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      eventSource.close(); // Close the connection on error
    };

    // Cleanup function to close the connection when the component unmounts
    return () => {
      eventSource.close();
    };
  }, [wallet]);

  useEffect(() => {
    console.log("userInfo", userInfo)
  }, [userInfo])

  useEffect(() => {
    console.log("mintcount", mintCount)
  }, [mintCount])

  return (
    <div className=" min-h-screen relative pt-28 bg-opacity-30 bg-repeat " >
    {/* <div className=" min-h-screen relative pt-28 bg-opacity-30 " > */}
      <Navbar />
      <section className="flex flex-col items-center text-center  text-white min-h-screen relative">
        <div className="absolute w-11/12 h-[87vh] xl:h-[90vh] 2xl:h-[87vh] bg-repeat bg-sui bg-bottom top-0 rounded-b-3xl" style={{ backgroundSize: "40px" }}>
          <p className="hidden ">Hero image</p>
        </div>
        <div className="z-10 flex flex-col items-center w-10/12 sm:w-3/5 lg:w-2/3 2xl:w-1/2 rounded-2xl bg-dark p-4 sm:p-12 mt-12 bg-modal bg-center  " >
        {/* <div className="z-10 flex flex-col items-center w-10/12 sm:w-3/5 lg:w-2/3 2xl:w-1/2 rounded-2xl bg-dark p-4 sm:p-12 mt-12 bg-center  " > */}
          {stage !== undefined && <div className="w-full flex items-center justify-center flex-col">
            {stage.stage === "No start yet" ? <div>
              <p>Mint begins in</p>
              <Countdown date={Date.now() - stage.timeleft} className="text-2xl text-primary font-bold font-neopixel" />
            </div> :
              <div className="items-center w-full justify-center flex flex-col">
                <Progress
                  size="lg"
                  radius="sm"
                  classNames={{
                    base: "max-w-md",
                    track: "drop-shadow-md",
                    indicator: "bg-gradient-to-r from-primary-100 to-primary",
                    label: "tracking-wider font-medium text-default-600",
                    value: "text-foreground/60",
                  }}
                  label="Mint Percentage"
                  value={(totalMintCount * 100 / 3333)}
                  showValueLabel={true}
                  valueLabel={`${(totalMintCount * 100 / 3333).toFixed(2)} %`}
                />
                <p className="text-2xl text-end mt-4">{`${totalMintCount} / 3333`}</p>
              </div>}
          </div>}
          <div className="flex items-center justify-center flex-col">
            <h1 className="text-white text-4xl md:text-6xl lg:text-6xl 2xl:text-8xl font-bold leading-tight tracking-widest font-neopixel">
              SUI Fashion
            </h1>
            {stage !== undefined && <div>
              <h2 className="text-primary text-xl md:text-2xl lg:text-3xl font-bold leading-tight tracking-widest font-neopixel">
                {stage.stage !== "No start yet" ? `We are in ${stage?.stage}` : `Comming Soon`}
              </h2>
              {stage.stage !== "No start yet" && <p className="text-lg md:text-xl lg:text-2xl text-white font-bold"><span className="text-green-600 font-bold text-xl md:text-2xl lg:text-3xl">{stage.price} </span>SUI / Mint</p>}
            </div>
            }
          </div>
          <p className="mt-2 text-lg opacity-60 w-2/3">
            Collection of 3,333 generative pfpNFT milady derivatives from the Society #VibesOrDie.
          </p>
          <Image src={`/assets/img/lord.webp`} width={200} height={200} alt="Sui Fashion" className="rounded-xl shadow-xl shadow-blue-400 mb-4 mt-2" />
          <p className="mt-2 text-lg opacity-60 w-2/3 mb-8 hidden">
            {userInfo?.type ? userInfo?.type === "No" ? "Not in WL" : `${userInfo?.type}` : ""}
          </p>
          <p className="hidden">Mint Count</p>
          <Input
            value={mintCount}
            onValueChange={setMintCount}
            type="number"
            placeholder="0"
            max={userInfo ? (userInfo.mintlimit - userInfo.mintcount) : 10}
            className="max-w-60 hidden"
            labelPlacement="outside"
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small"></span>
              </div>
            }
            endContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-sm">{(mintCount === '0' || !userInfo) ? 0 : parseInt(mintCount) * userInfo?.price}</span>
              </div>
            }
          />
          {userInfo && stage?.stage !== "No start yet" && (loading ? <Spinner color="primary" /> : <button className={`mt-4 px-6 py-3 min-w-60  bg-primary hover:bg-primary-100 hover:scale-101 rounded-lg active:scale-99 duration-100 ${button.default}`} onClick={() => handleExecuteMoveCall(nftContractAddr)}>Mint</button>)}
        </div>
      </section>
      {/* <Partner /> */}
      <div>
        <h3 className="text-white text-2xl 2xl:text-4xl font-bold uppercase mt-8 text-center">Whitelists</h3>
        <section className="flex justify-center flex-wrap gap-4 py-12  text-white text-center mx-2">
          <div className="rounded-xl border-dark border-solid p-2 border-1 w-80 min-h-56">
            <div className={`p-6 ${userInfo?.type === "team" ? "bg-primary" : "bg-dark hover:bg-opacity-20 hover:bg-primary"}  rounded-xl h-full flex flex-col  duration-75 cursor-pointer`}>
              <div className="flex flex-col items-center justify-center flex-1">
                <h3 className="text-3xl font-bold font-neopixel uppercase">Team</h3>
              </div>
              <div className="flex-1">
                <p className="text-lg">SUI 0</p>
                <p className="text-lg"><span className="text-xl font-bold">33</span>  Mint / Wallet</p>
              </div>
            </div>
          </div>
          {/* <div className="rounded-xl border-dark border-solid p-2 border-1 w-80 min-h-56">
            <div className={`p-6 ${userInfo?.type === "Dead y00ts x BMB" ? "bg-primary" : "bg-dark hover:bg-opacity-20 hover:bg-primary"}  rounded-xl h-full flex flex-col  duration-75 cursor-pointer`}>
              <div className="flex flex-col items-center justify-center flex-1">
                <h3 className="text-3xl font-bold font-neopixel uppercase">Dead y00t x BMB</h3>
              </div>
              <div className="flex-1">
                <p className="text-lg">SUI 0</p>
                <p className="text-lg"><span className="text-xl font-bold">1</span>  Mint / Wallet</p>
                <p></p>
              </div>
            </div>
          </div> */}
          <div className="rounded-xl border-dark border-solid p-2 border-1 w-80 min-h-56">
            <div className={`p-6 ${userInfo?.type === "Early X" ? "bg-primary" : "bg-dark hover:bg-opacity-20 hover:bg-primary"}  rounded-xl h-full flex flex-col  duration-75 cursor-pointer`}>
              <div className="flex flex-col items-center justify-center flex-1">
                <h3 className="text-3xl font-bold font-neopixel uppercase">Early X</h3>
              </div>
              <div className="flex-1">
                <p className="text-lg">SUI 5.55</p>
                <p className="text-lg"><span className="text-xl font-bold">1</span>  Mint / Wallet</p>
                <p></p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border-dark border-solid p-2 border-1 w-80 min-h-56">
            <div className={`p-6 ${userInfo?.type === "Main" ? "bg-primary" : "bg-dark hover:bg-opacity-20 hover:bg-primary"}  rounded-xl h-full flex flex-col  duration-75 cursor-pointer`}>
              <div className="flex flex-col items-center justify-center flex-1">
                <h3 className="text-3xl font-bold font-neopixel uppercase">Main</h3>
              </div>
              <div className="flex-1">
                <p className="text-lg">SUI 7.77</p>
                <p className="text-lg"><span className="text-xl font-bold">3</span>  Mint / Wallet</p>
                <p></p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border-dark border-solid p-2 border-1 w-80 min-h-56">
            <div className={`p-6 ${userInfo?.type === "No" ? "bg-primary" : "bg-dark hover:bg-opacity-20 hover:bg-primary"}  rounded-xl h-full flex flex-col  duration-75 cursor-pointer`}>
              <div className="flex flex-col items-center justify-center flex-1">
                <h3 className="text-3xl font-bold font-neopixel uppercase">Normal</h3>
              </div>
              <div className="flex-1">
                <p className="text-lg">SUI 11.11</p>
                <p className="text-lg"><span className="text-xl font-bold">10</span>  Mint / Wallet</p>
                <p></p>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* <Upload /> */}
      <Footer />
    </div>
  );
};

export default Home;
