import { Chain } from './types';

export const chains: Chain[] = [
  {
    name: 'Bitcoin',
    icon: '/chains/btc.svg',
    url: 'https://bitcoin.org',
    color: '#F7931A',
    level: 99,
    description: {
      en: 'Bitcoin mainnet development',
      zh: '比特币主网开发'
    },
    position: { x: 20, y: 20 },
    achievements: [
      {
        title: {
          en: 'BTC Development',
          zh: 'BTC 开发'
        },
        description: {
          en: 'Bitcoin network development experience',
          zh: '比特币网络开发经验'
        },
        date: '2023'
      }
    ]
  },
  {
    name: 'Ethereum',
    icon: '/chains/eth.svg',
    url: 'https://ethereum.org',
    color: '#627EEA',
    level: 95,
    description: {
      en: 'Smart contract development',
      zh: '智能合约开发'
    },
    position: { x: 40, y: 30 },
    achievements: [
      {
        title: {
          en: 'DeFi Expert',
          zh: 'DeFi 专家'
        },
        description: {
          en: 'Developed multiple DeFi projects',
          zh: '开发过多个 DeFi 项目'
        },
        date: '2023'
      }
    ]
  },
  {
    name: 'zkSync',
    icon: '/chains/zksync.svg',
    url: 'https://zksync.io',
    color: '#8C8DFC',
    level: 90,
    description: {
      en: 'Layer2 scaling solution',
      zh: 'Layer2 扩展解决方案'
    },
    position: { x: 60, y: 20 }
  },
  {
    name: 'Base',
    icon: '/chains/base.svg',
    url: 'https://base.org',
    color: '#0052FF',
    level: 88,
    description: {
      en: "Coinbase's Layer2 network",
      zh: 'Coinbase 的 Layer2 网络'
    },
    position: { x: 75, y: 40 }
  },
  {
    name: 'Zircuit',
    icon: null,
    url: 'https://zircuit.com',
    color: '#FF4D4D',
    level: 85,
    description: {
      en: 'Zero-knowledge proof technology',
      zh: '零知识证明技术'
    },
    position: { x: 25, y: 60 }
  },
  {
    name: 'Solana',
    icon: '/chains/solana.svg',
    url: 'https://solana.com',
    color: '#14F195',
    level: 92,
    description: {
      en: 'High-performance public chain',
      zh: '高性能公链'
    },
    position: { x: 45, y: 70 }
  },
  {
    name: 'Aptos',
    icon: '/chains/aptos.svg',
    url: 'https://aptoslabs.com',
    color: '#2DD8A7',
    level: 87,
    description: {
      en: 'Move language development',
      zh: 'Move 语言开发'
    },
    position: { x: 65, y: 65 }
  },
  {
    name: 'Sui',
    icon: '/chains/sui.svg',
    url: 'https://sui.io',
    color: '#6FBCF0',
    level: 86,
    description: {
      en: 'Parallel execution smart contract platform',
      zh: '并行执行的智能合约平台'
    },
    position: { x: 80, y: 75 }
  },
  {
    name: 'CKB',
    icon: null,
    url: 'https://www.nervos.org',
    color: '#3CC68A',
    level: 89,
    description: {
      en: 'Universal public chain platform',
      zh: '通用公链平台'
    },
    position: { x: 30, y: 85 }
  },
  {
    name: 'Cosmos',
    icon: '/chains/cosmos.svg',
    url: 'https://cosmos.network',
    color: '#2E3148',
    level: 91,
    description: {
      en: 'Cross-chain interoperability network',
      zh: '跨链互操作性网络'
    },
    position: { x: 50, y: 50 }
  },
  {
    name: 'Celestia',
    icon: '/chains/celestia.svg',
    url: 'https://celestia.org',
    color: '#7B2BF9',
    level: 84,
    description: {
      en: 'Modular blockchain network',
      zh: '模块化区块链网络'
    },
    position: { x: 70, y: 45 }
  },
  {
    name: 'Sonic',
    icon: null,
    url: 'https://sonic.ooo',
    color: '#FF6B4A',
    level: 83,
    description: {
      en: 'Innovative blockchain gaming platform',
      zh: '创新链游平台'
    },
    position: { x: 35, y: 40 }
  }
];
