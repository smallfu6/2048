import { getContract } from "thirdweb";
import { linea } from "thirdweb/chains";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "../client";

const GameContractAddress = "0x2a065C09B91b1a4fc2F3f26bf3893338700BB36a";
const MethodGetScore =
  "function accumulatedScores(address wallet) returns (uint256)";
const MethodGetLevelAndMintStatus =
  "function getUserTierAndMintStatus(address wallet) returns (uint256, bool)";

const contract = getContract({
  client,
  address: GameContractAddress,
  chain: linea,
});

let address;

export const GetScore = () => {
  const { score, isLoading } = useReadContract({
    contract,
    method: MethodGetScore,
    params: [address],
  });

  console.log(score, isLoading);
  return score;
};

export const GetLevelAndEnableMint = () => {
  const account = useActiveAccount();
  address = account?.address;
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

export const GetBadgeList = () => {};

export const MintBage = () => {};

export const GetLeaderBoard = () => {};
