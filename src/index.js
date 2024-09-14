import React from "react";
import ReactDOM from "react-dom/client";
import { ThirdwebProvider } from "thirdweb/react";


import BoardView from "./components/Board";
import "./main.scss";
import "./styles.scss";

const App = () => {
  return (<ThirdwebProvider>
    <BoardView />
  </ThirdwebProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <h1 className="main-title"><strong className="title-2048">2048</strong> Season1</h1>
    <App />
  </>
);
