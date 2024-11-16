'use client'
import { button } from "@/styles/button";
import Image from "next/image";

import {
  addressEllipsis,
  ConnectButton,
  ErrorCode,
  formatSUI,
  SuiChainId,
  useAccountBalance,
  useWallet,
} from "@suiet/wallet-kit";

const Navbar = () => {
  return (
    <nav className="flex justify-end items-center p-6 bg-black bg-opacity-50 text-white fixed w-full z-20 top-0 backdrop-blur-sm">
      <Image src={'/assets/logo.svg'} width={233} height={52} alt="logo" className="hidden"/>
      <ConnectButton />
    </nav>
  );
};

export default Navbar;