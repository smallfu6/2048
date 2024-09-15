import { ThirdwebProvider } from "thirdweb/react";

import BoardView from "./components/Board";
import WalletInfo from "./components/WalletInfo";

const App = () => {
  return (
    <ThirdwebProvider>
      <WalletInfo />
      <BoardView />
    </ThirdwebProvider>
  );
};

export default App;
