
import { ConnectButton } from "thirdweb/react";
import {client } from "../client";

import {
  createWallet,
} from "thirdweb/wallets";



const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];


const WalletInfo = ()=> {
    return (
        <ConnectButton
        client={client}
        wallets={wallets}
        connectModal={{ size: "compact" }}
      />
    );
};


export default WalletInfo;