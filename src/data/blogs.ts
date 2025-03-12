import { BlogPost } from './types';

export const blogs: BlogPost[] = [
  {
    title: {
      en: "Building Next-Gen Blockchain Games",
      zh: "构建下一代区块链游戏"
    },
    slug: "building-next-gen-blockchain-games",
    description: {
      en: "Exploring how to combine blockchain technology with game development to create truly engaging and sustainable blockchain games.",
      zh: "探讨如何将区块链技术与游戏开发相结合，创造真正有趣且可持续的链游。"
    },
    date: "2024-03-01",
    tags: ["Blockchain", "Gaming", "Web3", "Game Development"],
    category: "GameFi",
    featured: true,
    coverImage: "/blogs/blockchain-gaming.jpg"
  },
  {
    title: {
      en: "ZK-Proofs in DeFi Applications",
      zh: "零知识证明在DeFi中的应用"
    },
    slug: "zk-proofs-in-defi",
    description: {
      en: "An in-depth analysis of how zero-knowledge proofs can enhance privacy and scalability in DeFi projects.",
      zh: "深入解析零知识证明技术如何提升DeFi项目的隐私性和可扩展性。"
    },
    date: "2024-02-15",
    tags: ["ZK-Proofs", "DeFi", "Privacy", "Scaling"],
    category: "DeFi",
    featured: true,
    coverImage: "/blogs/zk-defi.jpg"
  },
  {
    title: {
      en: "Comparing Cross-chain Interoperability Solutions",
      zh: "跨链互操作性解决方案比较"
    },
    slug: "cross-chain-interoperability",
    description: {
      en: "A comprehensive comparison of current cross-chain solutions, analyzing their strengths and limitations.",
      zh: "比较当前主流的跨链解决方案，分析其优势与局限性。"
    },
    date: "2024-01-30",
    tags: ["Cross-chain", "Interoperability", "Blockchain"],
    category: "Technology",
    featured: false,
    coverImage: "/blogs/cross-chain.jpg"
  }
];
