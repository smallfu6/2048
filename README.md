# 2048 Web3 Game 🕹

This project is a Web3 integrated version of the classic 2048 game, accessible at [2048](https://2048linea.online). It allows players to connect their Web3 wallets and interact with blockchain features while enjoying the 2048 game. 

### Features

- **Web3 Wallet Integration**: Players can connect their Web3 wallets (e.g., MetaMask) to interact with the game.

- **Blockchain Interaction**: Game scores can be saved on the blockchain, and a leaderboard is available to compare scores with other players.

- **Game Persistence**: Players can save their game progress on the blockchain and resume later.


### Getting Started

#### Prerequisites
Before you begin, ensure you have the following installed on your machine:

- Node.js

- npm

#### Installation
1. Clone the repository:

   ```bash
   git clone https://github.com/smallfu6/2048.git
   cd 2048
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm start
   ```

Open your browser and navigate to http://localhost:3000 to play the game locally, or visit the live version at [2048linea.online](https://2048linea.online).

### Building for Production
To build the project for production, run:

```bash
npm run build
```


The production-ready files will be output to the build/ directory.

### Usage

1. **Connect Wallet**: Upon entering the game, you will be prompted to connect your Web3 wallet. If you are already logged in, the game will automatically connect to your wallet.

2. **Play the Game**: Use arrow keys (or swipe on mobile) to play the game.

3. **Save and Load Game**: You can save your game progress to the blockchain and load it at any time.

4. **Leaderboard**: Check the leaderboard to see how your score ranks against other players.


### Technologies Used

- **React**: For building the user interface.

- **Ethers.js**: For blockchain interactions.

- **SCSS**: For styling.

### Contribution
Contributions are welcome! Please open an issue or submit a pull request if you have any improvements or bug fixes.



