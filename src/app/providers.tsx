'use client';

import { NextUIProvider } from "@nextui-org/react";
import { WagmiConfig } from "wagmi";
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import {chains, config} from '@/config/web3';
import '@rainbow-me/rainbowkit/styles.css';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider chains={chains} modalSize="compact">
        <NextUIProvider>
          {children}
        </NextUIProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
