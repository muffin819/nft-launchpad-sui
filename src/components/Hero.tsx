"use client"
import Image from "next/image";
import Swal from 'sweetalert2'
import { checkMintStatus, checkWL } from "@/api/api";
import { button } from "@/styles/button";
import { Transaction } from "@mysten/sui/transactions";
import { Input, Progress } from "@nextui-org/react";
import { ConnectionStatus, SuiChainId, useAccountBalance, useWallet } from "@suiet/wallet-kit";
import { useContext, useEffect, useMemo, useState } from "react";
import { IUserInfo } from "@/app/page";



// components/Hero.tsx
const Hero = () => {

  // const { userInfo, setUserInfo } = useContext(ConnectionStatusContext)
  const [userInfo, setUserInfo] = useState<IUserInfo>()
  const [mintCount, setMintCount] = useState("0")
  const [totalMintCount, setTotalMintCount] = useState(0)
  const sampleNft = new Map([
    [
      "sui:devnet",
      "0xe146dbd6d33d7227700328a9421c58ed34546f998acdc42a1d05b4818b49faa2::nft::mint",
    ],
    [
      "sui:testnet",
      "0xfb78d3c42533a414451990c14a5b77af7ed4037bd46bb79e192d8550f65699a7::nft::mint",
    ],
    [
      "sui:mainnet",
      "0x5b45da03d42b064f5e051741b6fed3b29eb817c7923b83b92f37a1d2abf4fbab::nft::mint",
    ],
  ]);

  const wallet = useWallet();
  const { balance } = useAccountBalance();
  const nftContractAddr = useMemo(() => {
    if (!wallet.chain) return "";
    wallet.account?.publicKey
    return sampleNft.get(wallet.chain.id) ?? "";
  }, [wallet]);

  function uint8arrayToHex(value: Uint8Array | undefined) {
    if (!value) return "";
    // @ts-ignore
    return value.toString("hex");
  }

  async function handleExecuteMoveCall(target: string | undefined) {
    if (!target) return;

    try {
      if (userInfo) {
        const tx = new Transaction();
        tx.moveCall({
          target: target as any,
          arguments: [
            tx.pure.string("Suiet NFT"),
            tx.pure.string(
              "Qmf1JH64fDWRAWr11XknKoaqyY1RiXst6JiGBJmVY7gzei/katana2.png"
            ),
          ],
        });
        // tx.setGasPrice(3300000)
        tx.setGasBudget(userInfo?.price * parseInt(mintCount))
        const resData = await wallet.signAndExecuteTransaction({
          transaction: tx,
        });
        console.log("executeMoveCall success", resData);
        alert("executeMoveCall succeeded (see response in the console)");
        Swal.fire({
          title: "Success!",
          text: `Collection Minted`,
          icon: "success"
        })
      }
      else{
        Swal.fire({
          title: "Error",
          text: `Failed to getting user info. Please connect wallet again`,
          icon: "error"
        })
      }
    } catch (e) {
      Swal.fire({
        title: "Error",
        text: `Transaction failed`,
        icon: "error"
      })
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


  // async function getContractState(objectId: string) {
  //   try {
  //     // Fetch the contract state from the Sui network
  //     const contractState = await provider.getObject({
  //       id: objectId,
  //       options: { showContent: true },
  //     });

  //     console.log("Contract State:", contractState);
  //     return contractState;
  //   } catch (error) {
  //     console.error("Error fetching contract state:", error);
  //   }
  // }


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

  useEffect(() => {
    const fetchData = async () => {
      const result = await checkWL(wallet.address!!)
      if (result) {
        setUserInfo(result.data)
      }
    }
    if (wallet.address && !userInfo) {
      fetchData()
    }
  }, [wallet])

  useEffect(() => {

    const fetchData = async () => {
      const result = await checkMintStatus()
      if (result?.data?.mintCount) {
        setTotalMintCount(result.data.mintCount)
      }
    }
    fetchData()
  }, [])

  return (
    <section className="flex flex-col items-center text-center bg-black text-white min-h-screen relative">
      <div className="absolute bg-hero w-11/12 h-[87vh] bg-no-repeat bg-cover bg-bottom top-0 rounded-b-3xl">
        <p className="hidden ">Hero image</p>
      </div>
      <div className="z-10 flex flex-col items-center w-10/12 sm:w-3/5 lg:w-2/3 xl:w-1/2 rounded-2xl bg-black p-12 mt-12 bg-modal bg-center bg-opacity-45 ">
        <div className="w-full flex items-center justify-center flex-col">
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
        </div>
        <div className="flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-6xl lg:text-8xl font-bold leading-tight tracking-widest font-neopixel">
            SUI LODS
          </h1>
        </div>
        <p className="mt-2 text-lg opacity-60 w-2/3">
          Sui Fasions is a collection of 3,333 generative pfpNFT milady derivatives from the Society #VibesOrDie.
        </p>
        <Image src={`/assets/img/lord.webp`} width={200} height={200} alt="Sui Fashion" className="rounded-xl shadow-xl shadow-blue-400 mb-4 mt-2" />
        <p className="mt-2 text-lg opacity-60 w-2/3 mb-8">
          {userInfo?.type ? userInfo?.type === "No" ? "Not in WL" : `${userInfo?.type}` : ""}
        </p>
        <p>Mint Count</p>
        <Input
          value={mintCount}
          onValueChange={setMintCount}
          type="number"
          placeholder="0"
          max={userInfo ? (userInfo.mintlimit - userInfo.mintcount) : 10}
          className="max-w-60"
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
        {(userInfo && (userInfo.mintlimit - userInfo.mintcount > 0)) && <button className={`mt-4 px-6 py-3 min-w-60  bg-primary hover:bg-primary-100 hover:scale-101 rounded-lg active:scale-99 duration-100 ${button.default}`} onClick={() => handleExecuteMoveCall(nftContractAddr)}>Mint</button>}
      </div>
    </section>
  );
};

export default Hero;
