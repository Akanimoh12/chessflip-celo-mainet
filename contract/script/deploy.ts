import { ethers } from "hardhat";

const CUSD_MAINNET = "0x765DE816845861e75A25fCA122bb6898B8B1282a";
const CUSD_TESTNET = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying ChessFlip with account:", deployer.address);

  const chainId = await deployer.getChainId();
  const isTestnet = chainId === 44787;
  const cUsdAddress = isTestnet ? CUSD_TESTNET : CUSD_MAINNET;

  const ChessFlip = await ethers.getContractFactory("ChessFlip");
  const contract = await ChessFlip.deploy(cUsdAddress, deployer.address);

  await contract.deployed();
  console.log(`ChessFlip deployed to ${contract.address}`);
  console.log(`cUSD used: ${cUsdAddress}`);
}

async function run() {
  try {
    await main();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

void run();
