import { getDefaultWallets } from '@rainbow-me/rainbowkit';

export type TokenSymbols = keyof typeof TOKEN_ADDRESSES

// Base 链上的代币合约地址
export const TOKEN_ADDRESSES = {
  ETH: '0x0000000000000000000000000000000000000000', // ETH 原生代币
} as const;

// 打赏合约地址
export const TIP_CONTRACT_ADDRESS = '0x...'; // 替换为您的合约地址

export const TIP_ACCOUNT_ADDRESS = "0x614aa2314b5b84a5F64337B21d92fF80Da816883"