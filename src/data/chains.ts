import { Chain } from './types';

export const chains: Chain[] = [
  {
    name: 'Bitcoin',
    icon: '/chains/btc.svg',
    url: 'https://bitcoin.org',
    color: '#F7931A',
    level: 60,
    description: {
      en: 'The pioneer of decentralized digital currency, operating on Proof-of-Work consensus with unparalleled security and network stability',
      zh: '去中心化数字货币先驱，基于工作量证明共识机制，具有无与伦比的安全性和网络稳定性'
    }
  },
  {
    name: 'Ethereum',
    icon: '/chains/eth.svg',
    url: 'https://ethereum.org',
    color: '#627EEA',
    level: 92,
    description: {
      en: 'Leading smart contract platform enabling decentralized applications, DeFi ecosystem and NFT innovations through EVM compatibility',
      zh: '领先的智能合约平台，通过 EVM 兼容性支持去中心化应用、DeFi 生态和 NFT 创新'
    }
  },
  {
    name: 'zkSync',
    icon: '/chains/zksync.svg',
    url: 'https://zksync.io',
    color: '#8C8DFC',
    level: 68,
    description: {
      en: 'ZK-Rollup based Layer2 scaling solution providing Ethereum-level security with low gas fees and instant finality',
      zh: '基于 ZK-Rollup 的 Layer2 扩容方案，在保持以太坊级安全性的同时实现低 gas 费和即时确定性'
    }
  },
  {
    name: 'Base',
    icon: '/chains/base.svg',
    url: 'https://base.org',
    color: '#0052FF',
    level: 88,
    description: {
      en: 'Coinbase-backed Ethereum L2 built on OP Stack, offering secure and developer-friendly environment for mass adoption',
      zh: 'Coinbase 支持的以太坊 Layer2 网络，基于 OP Stack 构建，为大规模采用提供安全友好的开发环境'
    }
  },
  {
    name: 'Zircuit',
    icon: '/chains/zircuit.svg',
    url: 'https://zircuit.com',
    color: '#4DC159',
    level: 90,
    description: {
      en: 'AI-enhanced zkEVM chain combining zero-knowledge proofs with machine learning for optimized smart contract execution',
      zh: '融合零知识证明与机器学习的 AI 增强型 zkEVM 链，优化智能合约执行效率'
    }
  },
  {
    name: 'Solana',
    icon: '/chains/solana.svg',
    url: 'https://solana.com',
    color: '#E669B8',
    level: 73,
    description: {
      en: 'High-performance blockchain using Proof-of-History consensus to achieve 50k+ TPS for web-scale applications',
      zh: '采用历史证明共识的高性能区块链，支持 5 万+ TPS，满足 Web 级应用需求'
    }
  },
  {
    name: 'Aptos',
    icon: '/chains/aptos.svg',
    url: 'https://aptoslabs.com',
    color: '#DDDDDD',
    level: 55,
    description: {
      en: 'Next-gen Layer1 with Move language and parallel execution engine, delivering secure and scalable blockchain infrastructure',
      zh: '采用 Move 语言和并行执行引擎的新一代公链，提供安全可扩展的区块链基础设施'
    }
  },
  {
    name: 'Sui',
    icon: '/chains/sui.svg',
    url: 'https://sui.io',
    color: '#6FBCF0',
    level: 65,
    description: {
      en: 'Object-centric blockchain adopting the Move language with parallel transaction processing, enabling high-throughput decentralized applications',
      zh: '采用 Move 语言的以对象为中心的区块链，支持并行交易处理，为高吞吐量去中心化应用而生'
    }
  },
  {
    name: 'CKB',
    icon: '/chains/ckb.jpg',
    url: 'https://www.nervos.org',
    color: '#AABBCC',
    level: 72,
    description: {
      en: 'Layer1 platform with Cell model design, providing state storage and verification layer for layered blockchain architecture',
      zh: '采用 Cell 模型设计的底层公链，为分层区块链架构提供状态存储和验证层'
    }
  },
  {
    name: 'Cosmos',
    icon: '/chains/cosmos.svg',
    url: 'https://cosmos.network',
    color: '#2E3148',
    level: 71,
    description: {
      en: 'Internet of Blockchains ecosystem with IBC protocol enabling cross-chain interoperability and sovereign appchains',
      zh: '区块链互联网生态系统，通过 IBC 协议实现跨链互操作性和主权应用链'
    }
  },
  {
    name: 'Celestia',
    icon: '/chains/celestia.svg',
    url: 'https://celestia.org',
    color: '#7B2BF9',
    level: 76,
    description: {
      en: 'Modular blockchain network pioneering data availability sampling for scalable and customizable rollups',
      zh: '模块化区块链网络，通过数据可用性采样技术为可扩展的定制化 Rollup 提供支持'
    }
  },
  {
    name: 'Polygon',
    icon: '/chains/polygon.svg',
    url: 'https://polygon.technology',
    color: '#CD10D8',
    level: 92,
    description: {
      en: 'Scalable multi-chain network providing sidechains and Layer2-like solutions for Ethereum, enhancing speed and reducing fees',
      zh: '可扩展的多链网络，为以太坊提供侧链和类 Layer2 解决方案，提升交易速度并降低费用'
    }
  }
];
