import React, { useState, useEffect, useRef } from "react";
import Tile from "./Tile";
import Cell from "./Cell";
import { Board } from "../helper";
import useEvent from "../hooks/useEvent";
import GameOverlay from "./GameOverlay";
import { ethers } from "ethers";
import { CONTRACT_ABI } from "./ABI";
import Modal from "./Modal";
import InfoCard from "./InfoCard";

const CONTRACT_ADDRESS = "0x1cf739eAe4e601c2be26298E40E91112c6FE0745";

const LineaSepoliaChainId = "0xe705";

const BoardView = () => {
  const [board, setBoard] = useState(new Board());
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [gameContract, setContract] = useState(null);
  const [signerContract, setSignerContract] = useState(null);
  const [address, setAddress] = useState(null);
  const [connected, setConnected] = useState(false);
  const [score, setScore] = useState(null); // In
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingLeaber, setIsLoadingLeaber] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState(null);
  const timerRef = useRef(null);

  // const leaderboardData = [
  //   { player: "Alice", score: 2000 },
  //   { player: "Bob", score: 1800 },
  //   { player: "Charlie", score: 1500 },
  //   // 添加更多数据
  // ];

  useEffect(() => {
    const initialize = async () => {
      if (window.ethereum) {
        try {
          // 创建 BrowserProvider 实例
          const newProvider = new ethers.BrowserProvider(window.ethereum);
          setProvider(newProvider);

          // 获取当前链 ID
          const currentChainId = await newProvider.send("eth_chainId", []);

          // 如果当前网络不匹配，则请求切换到 Linea Sepolia 网络
          if (currentChainId !== LineaSepoliaChainId) {
            await switchToLineaSepolia(newProvider);
          }

          // 请求用户账户
          const accounts = await newProvider.send("eth_requestAccounts", []);
          const account = accounts[0];
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
          // 创建合约实例
          const newContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            newProvider
          );
          setContract(newContract);

          //
          const signer = await newProvider.getSigner();
          // console.log("address:", accounts[0]);
          const sgContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            signer
          );
          setSignerContract(sgContract);

          // 调用合约的读取函数
          const getScore = async () => {
            try {
              const score = await newContract.accumulatedScores(account); // 假设合约中有一个名为 `score` 的函数
              setScore(score.toString());
            } catch (error) {
              console.error("Error fetching score:", error);
            }
          };

          // 调用函数
          getScore();
          // 设置加载状态为 false

          const getCurrentGameScore = async () => {
            try {
              const currScore = await newContract.scores(account);
              if (currScore > 0) {
                if (board.score === 0) {
                  board.score = parseInt(currScore, 10);
                }
                // console.log("进行中的游戏分数：", currScore.toString());

                // 加载棋盘
                // const currNums = await newContract.getGameBoard(account);
                // console.log("::", currNums);
                // if (currNums.length > 0) {
                //   console.log("进行中的棋盘：", currNums);
                //   // setCurrentNums(currNums);
                //   const size = currNums.length;
                //   const elements = board.cells;
                //   // 使用 for 循环遍历 cells
                //   for (let i = 0; i < size; i++) {
                //     for (let j = 0; j < size; j++) {
                //       const value = currNums[i][j];
                //       // 对 newArray 进行赋值，这里可以根据需要修改赋值逻辑
                //       // board.cells[i][j] = val/boaue;
                //       const tile = elements[i][j];
                //       tile.value = value;
                //       elements[i][j] = tile;
                //     }
                //   }

                //   console.log("sdfsdf:", elements);
                // setBoard((board) => ({
                //   ...board,
                //   cells: elements,
                // }));
                // }
              }
            } catch (error) {
              console.error("Error fetching score:", error);
            }
          };

          getCurrentGameScore();

          setIsLoading(false);
        } catch (error) {
          console.error("Initialization error:", error);
        }
      } else {
        alert("MetaMask is not installed");
      }
    };

    initialize();
  }, [board]);

  const switchToLineaSepolia = async (provider) => {
    try {
      const networkParams = {
        chainId: LineaSepoliaChainId,
        chainName: "Linea Sepolia",
        rpcUrls: ["https://sepolia.linea.build"],
        nativeCurrency: {
          name: "Ether",
          symbol: "ETH",
          decimals: 18,
        },
        blockExplorerUrls: ["https://sepolia.linea.build"],
      };

      // 请求切换到 Linea Sepolia 网络
      await provider.send("wallet_switchEthereumChain", [
        { chainId: LineaSepoliaChainId },
      ]);

      // 确保切换成功
      const newChainId = await provider.send("eth_chainId", []);
      if (newChainId === LineaSepoliaChainId) {
        console.log("Successfully switched to Linea Sepolia network.");
      } else {
        console.error("Failed to switch network.");
      }
    } catch (error) {
      if (error.code === 4902) {
        // 网络不存在，需要添加网络
        console.error("Network not found. Please add the network manually.");
      } else {
        console.error("Network switch error:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (provider) {
      try {
        const accounts = await provider.send("eth_requestAccounts", []);
        const newSigner = provider.getSigner();
        const newContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          newSigner
        );
        setSigner(newSigner);
        setContract(newContract);
        setAddress(accounts[0]);
        setConnected(true);
      } catch (error) {
        console.error("Connection error:", error);
      }
    }
  };

  const disconnectWallet = () => {
    setSigner(null);
    setContract(null);
    setAddress(null);
    setConnected(false);
  };

  const handleScoreQuery = async () => {
    if (gameContract && address) {
      try {
        // console.log(gameContract);
        // console.log(address);

        const score = await gameContract.accumulatedScores(address);
        // console.log("分数： ", score);
        // alert(`Your score: ${score.toString()}`);
        setScore(score.toString());
      } catch (error) {
        console.error("Error fetching score:", error);
      }
    }
  };

  const handleKeyDown = (event) => {
    if (board.hasWon()) {
      return;
    }

    if (event.keyCode >= 37 && event.keyCode <= 40) {
      let direction = event.keyCode - 37;
      let boardClone = Object.assign(
        Object.create(Object.getPrototypeOf(board)),
        board
      );
      let newBoard = boardClone.move(direction);
      setBoard(newBoard);
    }
  };

  useEvent("keydown", handleKeyDown);

  const cells = board.cells.map((row, rowIndex) => {
    return (
      <div key={rowIndex}>
        {row.map((col, colIndex) => {
          return <Cell key={rowIndex * board.size + colIndex} />;
        })}
      </div>
    );
  });

  const tiles = board.tiles
    .filter((tile) => tile.value !== 0)
    .map((tile, index) => {
      return <Tile tile={tile} key={index} />;
    });

  // reset game
  const resetGame = () => {
    setBoard(new Board());
  };

  const saveGame = async () => {
    setIsLoadingTransaction(true);
    const cells = board.cells;
    const size = cells.length;

    const elements = Array.from({ length: size }, () => Array(size).fill(null));

    // 使用 for 循环遍历 cells
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const tile = cells[i][j];
        // 对 newArray 进行赋值，这里可以根据需要修改赋值逻辑
        elements[i][j] = tile.value;
      }
    }

    const payEth = ethers.parseEther("0");

    // 保存棋盘和的当前分数
    if (signerContract && address) {
      try {
        const tx = await signerContract.updateBoard(elements, board.score, {
          value: payEth,
          gasLimit: 300000,
        });
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);
        setIsLoadingTransaction(false);
        // handleScoreQuery()
        // console.log(board.score);
      } catch (error) {
        console.error("Error update score:", error);
        setIsLoadingTransaction(false);
      }
    }
  };

  const overGame = async () => {
    setIsLoadingTransaction(true);
    const boardScore = board.score;
    setBoard(new Board());
    if (signerContract && address) {
      try {
        // console.log(signerContract);
        // console.log(board.score);
        const tx = await signerContract.endGame(boardScore, {
          gasLimit: 300000,
        });
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);
        setIsLoadingTransaction(false);

        handleScoreQuery();

        // console.log(board.score);
      } catch (error) {
        console.error("Error update score:", error);
        setIsLoadingTransaction(false);
      }
    }
    // setBoard(new Board());
  };
  // end game
  const endGame = async () => {
    setIsLoadingTransaction(true);
    // console.log(board);
    if (signerContract && address) {
      try {
        // console.log(signerContract);
        // console.log(board.score);
        const tx = await signerContract.endGame(board.score, {
          gasLimit: 300000,
        });
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);
        setBoard(new Board());
        handleScoreQuery();
        setIsLoadingTransaction(false);

        // console.log(board.score);
      } catch (error) {
        console.error("Error update score:", error);
        setIsLoadingTransaction(false);
      }
    }
  };

  // Function to format address with ellipsis
  const formatAddress = (addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // console.log(address);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  // console.log(board);

  const openLeaderboard = async () => {
    setShowLeaderboard(true);

    if (gameContract && address) {
      try {
        // console.log(gameContract);
        // console.log(address);

        const leaber = await gameContract.getTop10Players();
        const filteredData = leaber.filter(
          (item) => item[0] !== "0x0000000000000000000000000000000000000000"
        );
        setLeaderboardData(filteredData);
      } catch (error) {
        console.error("Error fetching topplayers:", error);
      }
    }
    setIsLoadingLeaber(false);
  };

  const closeLeaderboard = async () => {
    setShowLeaderboard(false);
    setLeaderboardData(null);
    setIsLoadingLeaber(true);
  };

  if (!timerRef.current) {
    // console.log(";;;;;")
    if (board.hasLost()) {
      // 设置延时操作
      timerRef.current = setTimeout(() => {
        console.log("gameover");
      }, 5000); // 延时 3 秒
    }
    // 清除定时器
    clearTimeout(timerRef.current);
  }

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <div className="game-button" onClick={openLeaderboard}>
            Leaerboard
          </div>
          {isLoadingTransaction && (
            <div className="spinner-modal">
              <div className="spinner"></div>
              <p>Processing, please wait...</p>
            </div>
          )}
          {showLeaderboard && (
            <Modal onClose={closeLeaderboard}>
              <h2>Leaerboard</h2>
              <table>
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingLeaber ? (
                    <tr>
                      <td>Loading...</td>
                    </tr>
                  ) : (
                    leaderboardData &&
                    leaderboardData.map((entry, index) => (
                      <tr key={index}>
                        <td>{formatAddress(entry[0])}</td>
                        <td>{entry[1].toString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </Modal>
          )}
          {/* <p>Wallet: {formatAddress(address)}</p> */}
          {/* <p>Score: {score !== null ? score : "Loading..."}</p> */}
          <InfoCard
            address={formatAddress(address)}
            score={score !== null ? score : "Loading..."}
          />
          {/* <button onClick={disconnectWallet}>Disconnect</button> */}
          {/* <button onClick={handleScoreQuery}>Get Score</button> */}
          <div className="details-box">
            <div
              className="resetButton"
              onClick={board.score > 0 ? null : resetGame}
            >
              New
            </div>
            <div
              className="saveButton"
              onClick={board.score > 0 ? saveGame : null}
            >
              Save
            </div>
            <div
              className="endButton"
              onClick={board.score > 0 ? endGame : null}
            >
              End
            </div>
            <div className="score-box">
              <div className="score-header">PUNTOS</div>
              <div>{board.score}</div>
            </div>
          </div>
          <div className="board">
            {cells}
            {tiles}
            <GameOverlay onRestart={overGame} board={board} />
          </div>
        </div>
      ) : (
        <p>Connecting to MetaMask...</p>
      )}
    </div>
  );
};

export default BoardView;
