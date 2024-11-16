"use client";

import { WalletProvider } from "@suiet/wallet-kit";

interface SuiWalletProviderProps {
  children: React.ReactNode;
}

const SuiWalletProvider = (pros: SuiWalletProviderProps) => {
  return (
    <>
      <WalletProvider>{pros.children}</WalletProvider>
    </>
  );
};

export default SuiWalletProvider;