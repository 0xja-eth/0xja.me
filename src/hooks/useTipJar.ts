'use client';

import { useState } from 'react';
import { 
  useContractRead,
  useAccount, 
  useBalance,
  useContractEvent,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { parseUnits } from 'viem';

const TIP_JAR_ADDRESS = ''; // TODO: 替换为你的合约地址
const TIP_JAR_ABI = [
  {
    "inputs": [],
    "stateMutability": "payable",
    "type": "function",
    "name": "tip"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "tipToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "isTokenSupported",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "TipReceived",
    "type": "event"
  }
] as const;

export function useTipJar(tokenAddress: string, amount: string, decimals: number) {
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();

  // 检查代币是否支持
  const { data: isSupported } = useContractRead({
    address: TIP_JAR_ADDRESS as `0x${string}`,
    abi: TIP_JAR_ABI,
    functionName: 'isTokenSupported',
    args: [tokenAddress as `0x${string}`],
  });

  // 获取代币余额
  const { data: balance } = useBalance({
    address,
    token: tokenAddress === '0x0000000000000000000000000000000000000000' ? undefined : tokenAddress as `0x${string}`,
  });

  // 发送 ETH
  const { 
    writeAsync: tipEth,
    data: tipEthData,
    isLoading: isTipEthLoading,
  } = useContractWrite({
    address: TIP_JAR_ADDRESS as `0x${string}`,
    abi: TIP_JAR_ABI,
    functionName: 'tip',
  });

  // 发送代币
  const {
    writeAsync: tipToken,
    data: tipTokenData,
    isLoading: isTipTokenLoading,
  } = useContractWrite({
    address: TIP_JAR_ADDRESS as `0x${string}`,
    abi: TIP_JAR_ABI,
    functionName: 'tipToken',
  });

  // 等待交易确认
  const { isLoading: isWaitingForTx } = useWaitForTransaction({
    hash: tipEthData?.hash || tipTokenData?.hash,
  });

  // 监听交易事件
  useContractEvent({
    address: TIP_JAR_ADDRESS as `0x${string}`,
    abi: TIP_JAR_ABI,
    eventName: 'TipReceived',
    listener(log) {
      setError(null);
    },
  });

  // 发送打赏
  const sendTip = async () => {
    try {
      setError(null);

      if (!isSupported) {
        throw new Error('Token not supported');
      }

      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Invalid amount');
      }

      if (balance && parseFloat(amount) > parseFloat(balance.formatted)) {
        throw new Error('Insufficient balance');
      }

      const parsedAmount = parseUnits(amount, decimals);

      if (tokenAddress === '0x0000000000000000000000000000000000000000') {
        // 发送 ETH
        const tx = await tipEth({
          value: parsedAmount,
        });
        return tx.hash;
      } else {
        // 发送代币
        const tx = await tipToken({
          args: [tokenAddress as `0x${string}`, parsedAmount],
        });
        return tx.hash;
      }
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
      throw err;
    }
  };

  return {
    sendTip,
    isLoading: isTipEthLoading || isTipTokenLoading || isWaitingForTx,
    error,
    balance
  };
}
