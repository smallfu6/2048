import { getContract } from "thirdweb";
import { linea } from "thirdweb/chains";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "../client";
import { CONTRACT_ABI } from "./ABI";

const GameContractAddress = "0x2a065C09B91b1a4fc2F3f26bf3893338700BB36a";
const MethodGetScore =
  "function accumulatedScores(address wallet) returns (uint256)";
const MethodGetLevelAndMintStatus =
  "function getUserTierAndMintStatus(address wallet) returns (uint256, bool)";
const MethodGetBadges =
  "function getPlayerAllNFT(address wallet) returns (string[])";
const MethodGetLeaderboard = "function getTop10Players() returns (tuple[10])";

const contract = getContract({
  client,
  address: GameContractAddress,
  chain: linea,
});

export const GetScore = () => {
  const account = useActiveAccount();
  const address = account?.address;
  console.log("sdfsdf", address);
  const { data, isLoading } = useReadContract({
    contract,
    method: MethodGetScore,
    params: [address],
  });

  const score = data;
  console.log(score, isLoading);
  return score;
};

export const GetLevelAndEnableMint = () => {
  const account = useActiveAccount();
  const address = account?.address;
  const { data, isLoading } = useReadContract({
    contract,
    method: MethodGetLevelAndMintStatus,
    params: [address],
  });

  let level, status;
  if (data?.length > 1) {
    level = data[0].toString();
    status = data[1];
  }

  console.log(level, status, isLoading);
  return level, status;
};

export const GetBadgeList = () => {
  const account = useActiveAccount();
  const address = account?.address;
  const { data, isLoading } = useReadContract({
    contract,
    method: MethodGetBadges,
    params: [address],
  });

  const bages = data;
  console.log(bages, isLoading);
  return bages;
};

export const MintBage = () => {};


export const GetLeaderBoard = () => {};
