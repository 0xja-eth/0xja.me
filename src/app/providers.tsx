"use client"

import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@rainbow-me/rainbowkit/styles.css';
import {
  darkTheme,
  getDefaultConfig,
  lightTheme,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  base,
} from 'wagmi/chains';

const queryClient = new QueryClient();

export const config = getDefaultConfig({
  appName: 'Axon AI',
  projectId: 'a1fc63f578160e84914e2f3788fc6c58',
  chains: [
    base,
  ],
  ssr: true,
});

export const RainbowProvider = ({ children }: { children: React.ReactNode }) => {
  return (
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={lightTheme({
            accentColor: '#000000',
            borderRadius: 'small',
            fontStack: 'system',
            overlayBlur: 'small',
          })}>
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
  );
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RainbowProvider >
      <QueryClientProvider client={queryClient}>
        <NextUIProvider>
          {children}
        </NextUIProvider>
      </QueryClientProvider>
    </RainbowProvider>
  );
}
