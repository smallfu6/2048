import { ConnectButton, useActiveAccount, useActiveWalletConnectionStatus } from "thirdweb/react";
import { linea } from "thirdweb/chains";
import { createWallet } from "thirdweb/wallets";

import { client } from "../client";

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

const WalletInfo = () => {
  const account = useActiveAccount();
  console.log("address", account);
  console.log("status", useActiveWalletConnectionStatus());


  return (
    <div className="wallet-info-container">
      <ConnectButton
        client={client}
        chain={linea}
        wallets={wallets}
        connectModal={{ size: "compact" }}
      />
    </div>
  );
};

export default WalletInfo;
