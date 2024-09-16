import { ThirdwebProvider } from "thirdweb/react";

import BoardView from "./components/Board";
import WalletInfo from "./components/WalletInfo";
import DetailView from "./components/Detail";

const App = () => {
  return (
    <div className="container">
      <ThirdwebProvider>
        <WalletInfo />
        <BoardView />
        <DetailView />
      </ThirdwebProvider>
    </div>
  );
};

export default App;
