import { getDefaultWallets } from '@rainbow-me/rainbowkit';

export type TokenSymbols = keyof typeof TOKEN_ADDRESSES

// Base 链上的代币合约地址
export const TOKEN_ADDRESSES = {
  ETH: '0x0000000000000000000000000000000000000000', // ETH 原生代币
  USDT: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
  USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  WBTC: '0x236aa50979D5f3De3Bd1Eeb40E81137F22ab794b'
} as const;

// 打赏合约地址
export const TIP_CONTRACT_ADDRESS = '0x...'; // 替换为您的合约地址
