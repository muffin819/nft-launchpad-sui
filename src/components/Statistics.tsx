"use client"
import { IUserInfo } from "@/app/page";
import { useContext, useEffect, useState } from "react";

// components/Statistics.tsx
const Statistics = () => {

  const [userInfo, setUserInfo] = useState<IUserInfo>()


  return (
    <div>
      <h3 className="text-white text-2xl font-bold uppercase  text-center">Whitelists</h3>
      <section className="flex justify-center flex-wrap gap-4 py-12 bg-black text-white text-center mx-2">
        <div className="rounded-xl border-dark border-solid p-2 border-1 w-80 min-h-56">
          <div className={`p-6 ${userInfo?.type === "team" ?"bg-primary":"bg-dark hover:bg-opacity-20 hover:bg-primary"}  rounded-xl h-full flex flex-col  duration-75 cursor-pointer`}>
            <div className="flex flex-col items-center justify-center flex-1">
              <h3 className="text-3xl font-bold font-neopixel uppercase">Team</h3>
            </div>
            <div className="flex-1">
              <p className="text-lg">SUI 0</p>
              <p className="text-lg"><span className="text-xl font-bold">33</span>  Mint / Wallet</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border-dark border-solid p-2 border-1 w-80 min-h-56">
          <div className={`p-6 ${userInfo?.type === "Dead y00ts x BMB" ?"bg-primary":"bg-dark hover:bg-opacity-20 hover:bg-primary"}  rounded-xl h-full flex flex-col  duration-75 cursor-pointer`}>
            <div className="flex flex-col items-center justify-center flex-1">
              <h3 className="text-3xl font-bold font-neopixel uppercase">Dead y00t x BMB</h3>
            </div>
            <div className="flex-1">
              <p className="text-lg">SUI 0</p>
              <p className="text-lg"><span className="text-xl font-bold">1</span>  Mint / Wallet</p>
              <p></p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border-dark border-solid p-2 border-1 w-80 min-h-56">
          <div className={`p-6 ${userInfo?.type === "Early X" ?"bg-primary":"bg-dark hover:bg-opacity-20 hover:bg-primary"}  rounded-xl h-full flex flex-col  duration-75 cursor-pointer`}>
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
          <div className={`p-6 ${userInfo?.type === "Main" ?"bg-primary":"bg-dark hover:bg-opacity-20 hover:bg-primary"}  rounded-xl h-full flex flex-col  duration-75 cursor-pointer`}>
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
          <div className={`p-6 ${userInfo?.type === "No" ?"bg-primary":"bg-dark hover:bg-opacity-20 hover:bg-primary"}  rounded-xl h-full flex flex-col  duration-75 cursor-pointer`}>
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
  );
};

export default Statistics;
