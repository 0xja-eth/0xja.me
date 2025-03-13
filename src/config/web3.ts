'use client';

import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { mainnet, base, arbitrum, optimism } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

// 配置支持的链
export const chains = [mainnet, base, arbitrum, optimism];

const { chains: configuredChains, publicClient } = configureChains(
  chains,
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: '0xJA.eth',
  projectId: 'a41b88209221382ffe588d812d5e6201', // 如果需要 WalletConnect，填入项目 ID
  chains: configuredChains,
});

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
