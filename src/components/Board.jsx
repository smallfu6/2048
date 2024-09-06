import React, { useState, useEffect } from "react";
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Tile from "./Tile";
import Cell from "./Cell";
import { Board } from "../helper";
import useEvent from "../hooks/useEvent";
import GameOverlay from "./GameOverlay";
import { ethers } from "ethers";
import { CONTRACT_ABI } from "./ABI";
import LeaderboardModal from "./LeaderboardModal";
import InfoCard from "./InfoCard";
import SpinnerModal from "./SpinnerModal";
import Season from "./Season";

const CONTRACT_ADDRESS = "0xb339921d60C1d093341Ff20578b0077a7BFF3632";

const LineaSepoliaChainId = "0xe705";

const BoardView = () => {
  const [board, setBoard] = useState(new Board());
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [gameContract, setContract] = useState(null);
  const [signerContract, setSignerContract] = useState(null);
  const [address, setAddress] = useState(null);
  const [connected, setConnected] = useState(false);
  const [score, setScore] = useState(null);
  const [level, setLevel] = useState(null);
  const [badgeList, setBadgeList] = useState(null);

  const [isMint, setIsMint] = useState(null); // I
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);


  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingLeaber, setIsLoadingLeaber] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState(null);

  let isOver = false;

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
              // console.log(score.toString());
            } catch (error) {
              console.error("Error fetching score:", error);
            }
          };

          // 调用函数
          getScore();
          // 设置加载状态为 false

          // 调用合约的读取函数
          const getLevel = async () => {
            try {
              const level = await newContract.getUserTierAndMintStatus(account);
              setLevel(level[0].toString());
              setIsMint(level[1]);
            } catch (error) {
              console.error("Error fetching level:", error);
            }
          };
          // 调用函数
          getLevel();
          // 设置加载状态为 false

          const getBadgeList = async () => {
            try {
              const badges = await newContract.getPlayerAllNFT(account);
              setBadgeList(badges);
            } catch (error) {
              console.error("Error fetching badge list:", error);
            }
          };

          getBadgeList();

          const getCurrentGameScore = async () => {
            try {
              const currScore = await newContract.scores(account);
              if (currScore > 0) {
                if (board.score === 0) {
                  board.score = parseInt(currScore, 10);
                }
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

    try {
      // 请求切换到 Linea Sepolia 网络
      await provider.send("wallet_switchEthereumChain", [
        { chainId: LineaSepoliaChainId },
      ]);

      // 确保切换成功
      const newChainId = await provider.send("eth_chainId", []);
      if (newChainId === LineaSepoliaChainId) {
        console.log("Successfully switched to Linea Sepolia network.");
      } else {
        console.log("Failed to switch network.");
        toast.error("Failed to switch network.");
      }
    } catch (error) {
      if (error.code === 4902) {
        // 网络不存在，需要添加网络
        try {
          await provider.send("wallet_addEthereumChain", [networkParams]);
          console.log("Network added successfully.");
        } catch (addError) {
          console.log("Failed to add network:", addError);
          toast.error("Network added successfully.");
        }
        console.log("Network not found. Please add the network manually.");
        toast.error("Network not found. Please add the network manually.");

      } else {
        console.log("Network switch error:", error);
        toast.error("Network switch error:", error);
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

  const updateLevel = async () => {
    if (gameContract && address) {
      try {
        const level = await gameContract.getUserTierAndMintStatus(address);
        setLevel(level[0].toString());
        setIsMint(level[1]);
      } catch (error) {
        console.error("Error fetching score:", error);
      }
    }
  };

  const updateBadgeList = async () => {
    if (gameContract && address) {
      try {
        const badges = await gameContract.getPlayerAllNFT(address);
        setBadgeList(badges);
      } catch (error) {
        console.error("Error fetching score:", error);
      }
    }
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
    setIsProcessing(true);
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

    // 保存棋盘和的当前分数
    if (signerContract && address) {
      try {
        const tx = await signerContract.updateBoard(elements, board.score);
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);
        setIsSuccess(true);

        handleScoreQuery();
        // toast.success("Score saved successfully!");
        // console.log(board.score);
      } catch (error) {
        console.error("Error update score:", error);
        setIsSuccess(false);
        setIsFailed(true);
        // toast.error("Failed to save score. Please try again.");
      } finally {
        setTimeout(() => setIsProcessing(false), 2000);
      }
    }

    setTimeout(() => setIsSuccess(false), 2100);
    setTimeout(() => setIsFailed(false), 2100);
  };

  const overGame = async () => {
    setBoard(new Board());
  };

  // end game
  const endGame = async () => {
    setIsProcessing(true);
    // console.log(board);
    if (signerContract && address) {
      try {
        // console.log(signerContract);
        // console.log(board.score);
        const tx = await signerContract.endGame(board.score);
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);
        setBoard(new Board());
        handleScoreQuery();
        setIsSuccess(true);

        // toast.success("Score saved successfully!");
        // console.log(board.score);
      } catch (error) {
        console.error("Error update score:", error);
        setIsSuccess(false);
        setIsFailed(true);
        // toast.error("Failed to save score. Please try again.");
      } finally {
        setTimeout(() => setIsProcessing(false), 2000);
      }
    }
    setTimeout(() => setIsSuccess(false), 2100);
    setTimeout(() => setIsFailed(false), 2100);

  };

  const mintNft = async () => {
    setIsProcessing(true);
    // console.log(board);
    if (signerContract && address) {
      try {
        // console.log(signerContract);
        // console.log(board.score);
        const tx = await signerContract.mintNFT(level);
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);

        // 更新勋章

        updateBadgeList();
        updateLevel();
        setIsSuccess(true);
        // toast.success("NFT badge minted successfully!");
        // console.log(board.score);
      } catch (error) {
        console.error("Error mint nft:", error);
        setIsSuccess(false);
        setIsFailed(true);


        // toast.error("Failed to mint NFT badge. Please try again.");
      } finally {
        setTimeout(() => setIsProcessing(false), 2000);
      }
    }
    setTimeout(() => setIsSuccess(false), 2100);
    setTimeout(() => setIsFailed(false), 2100);

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

  const overAndEnd = async () => {
    if (board.hasLost() && !isOver) {
      // 设置延时操作
      setTimeout(async () => {
        console.log("gameover");
        setIsProcessing(true);
        isOver = true;
      }, 5000); // 延时 3 秒
    }
  };
  // overAndEnd();

  return (
    <div className="container">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Zoom}
      />
      {isLoggedIn ? (
        <div className="game-container">
          <SpinnerModal isProcessing={isProcessing} isSuccess={isSuccess} isFailed={isFailed} />
          <div className="details-box">
            <div
              className={`resetButton ${board.score > 0 ? "disabled" : ""}`}
              onClick={board.score > 0 ? null : resetGame}
            >
              New
            </div>
            <div
              className={`saveButton ${board.score === 0 ? "disabled" : ""}`}
              onClick={board.score > 0 ? saveGame : null}
            >
              Save
            </div>
            <div
              className={`endButton ${board.score === 0 ? "disabled" : ""}`}
              onClick={board.score > 0 ? endGame : null}
            >
              End
            </div>
            <div className="score-box">
              <div className="score-header">PIONTS</div>
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

      <div className="info-container">
        <div className="game-button" onClick={openLeaderboard}>
          Leaderboard
        </div>
        {showLeaderboard && (
          <LeaderboardModal onClose={closeLeaderboard}>
            <h2>Leaderboard</h2>
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
          </LeaderboardModal>
        )}
        <InfoCard
          address={formatAddress(address)}
          score={score !== null ? score : "Loading..."}
          level={level !== null ? level : "Loading..."}
          isMint={isMint}
          onClick={mintNft}
          thumbnails={badgeList}
        />
        <Season />
      </div>
    </div>
  );
};

export default BoardView;
