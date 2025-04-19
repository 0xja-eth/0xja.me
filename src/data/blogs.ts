import { BlogPost } from './types';

export const blogs: BlogPost[] = [
  {
    title: {
      en: "[Weekly Blog] A Weekly Blog Challenge Contract! (Part 1)",
      zh: "【每周博客】做一个每周博客挑战合约！（一）"
    },
    slug: "a-weekly-blog-challenge-contract",
    description: {
      en: `# **0x00 Introduction**

To enhance the constraints and sense of ritual for this challenge, we need to ensure that the challenge rules and penalties are effectively enforced. Smart contracts are an excellent technology to achieve this goal. By writing a smart contract, we can ensure the execution of rules at the code level, guaranteeing enforceability and credibility.

This article is the first in the series, so let's try writing such a contract! We will use Solidity to write a weekly blog challenge smart contract and deploy it on Polygon. Recently, Sui has just launched, and I personally enjoy the development experience on Sui, so I may create a Sui version later.`,
      zh: `# **0x00 前言**

为了增强该挑战的约束力和仪式感，我们要确保挑战规则和惩罚的落实，智能合约就是一个很好能够实现这一目标的技术。通过编写智能合约，我们可以在代码层面上确保规则的执行，保证规则的强制性和可信度。

这篇文章是该系列的第一篇，就让我们来尝试一下写一个这样的合约吧！我们将使用Solidity编写一个每周博客挑战智能合约，并部署到Polygon上。最近Sui刚上线，我个人也很喜欢Sui上的开发体验，后续可能还会做一个Sui版本的。`
    },
    date: "2023-05-08",
    tags: ["Blockchain", "Blog Challenge", "Solidity", "Hardhat", "Foundry"],
    category: "Blockchain",
    blogUrl: "https://exermon-blog.notion.site/1bde5693e0a349d98a22507d64f123f7"
  },
  {
    title: {
      en: "[Weekly Blog] A Weekly Blog Challenge Contract! (Part 2)",
      zh: "【每周博客】做一个每周博客挑战合约！（二）"
    },
    slug: "a-weekly-blog-challenge-contract-part-2",
    description: {
      en: `# **0x00 Introduction**
      
In the previous article, we implemented a weekly blog challenge contract. However, the contract has not been debugged or tested yet, and upon further consideration, I realized that there are still some features that need to be improved. In this article, I will continue to complete these aspects~`,
      zh: `# **0x00 前言**

上一篇文章里，我们实现了一个每周博客挑战合约，但是该合约仍未调试和测试，并且经过思考，我认为还有一点功能还未完善。在这篇文章里，我将继续完成这些内容~`
    },
    date: "2023-05-15",
    tags: ["Blockchain", "Blog Challenge", "Solidity", "Hardhat", "Foundry"],
    category: "Blockchain",
    blogUrl: "https://exermon-blog.notion.site/969fb37861c4439e9786d570294d5805"
  },
  {
    title: {
      en: "[Weekly Blog] Exermon-React-Redux: Improvements and Implementation (Part 1)",
      zh: "【每周博客】Exermon-React-Redux：对React-Redux的改进与实现（一）"
    },
    slug: "exermon-react-redux-improvements-and-implementation-part-1",
    description: {
      en: `# **0x00 Introduction**

This week has been extremely busy, so I decided to take an old project and start a new topic with it. But don't worry—the content is still very valuable 🤩🤩

Before diving in, I want to share some exciting news: our contract has been deployed and fully configured!`,
      zh: `# **0x00 前言**

这周实在太忙了，只能偷懒拿旧项目开个新题目，但含金量绝对不低🤩🤩

在正式开始之前，我先宣布一个好消息，我们的合约已经部署，并且配置好了：`
    },
    date: "2023-05-22",
    tags: ["Frontend", "Blog Challenge", "React", "Redux", "Typescript"],
    category: "Frontend",
    blogUrl: "https://exermon-blog.notion.site/Exermon-React-Redux-React-Redux-8ec7b58875e54645b7a19ef2e91692da"
  },
  {
    title: {
      en: "[Weekly Blog] ZKSync Development Experience",
      zh: "【每周博客】ZKSync开发初体验"
    },
    slug: "zk-sync-development-experience",
    description: {
      en: `# **0x00 Introduction**

The last two weeks have been extremely busy as I worked on a project to deploy an open-source project on ZKSync. This marked the beginning of a tough two-week debugging journey.

The project is very complex, with over 100 Solidity files. Including tests and scripts, there are nearly 300 code files. Moreover, ZKSync is different from other EVMs, making direct deployment impossible, which added to the workload.

**As a result, I failed my challenge last week and lost $30!**  

So, this week, I can't afford to lose more money. Instead, I wrote this article as part of my work summary for the past two weeks.`,
      zh: `# 0x00 前言

这两周非常忙，因为在做一个项目，要将某个开源项目部署到ZKSync上，于是开启了两周的艰难踩坑之路~

该项目合约非常多非常复杂，光Solidity文件就有100多个，加上测试和脚本，可能得有三四百个代码文件……而且ZKSync又不同于其他EVM，它比较特殊，我们没法直接部署，可见工作量巨大。

**也因此直接导致我上周挑战失败，痛失30刀！**

所以，这周不能再扣钱了，于是写下本文，就当作是这两周的一部分工作总结~`
    },
    date: "2023-06-12",
    tags: ["Blockchain", "Blog Challenge", "ZKSync", "Solidity", "Hardhat", "Foundry"],
    category: "Blockchain",
    blogUrl: "https://exermon-blog.notion.site/ZKSync-230026c7777745f7a8619edb22e5f429"
  },
  {
    title: {
      en: "[Weekly Blog] GMX Source Code Interpretation (Part 1)",
      zh: "【每周博客】GMX源码解读（一）"
    },
    slug: "gmx-source-code-interpretation-part-1",
    description: {
      en: `# **0x00 Introduction**

GMX is a decentralized spot and perpetual exchange that supports low swap fees and zero price impact trades.

GMX is deployed on the Arbitrum and Avalanche networks and has been one of the best-performing DeFi protocols over the past six months.

Recently, due to a project requirement, I had to study the GMX source code. For someone like me, who has never worked in DeFi and knows nothing about finance, reading GMX's code was quite a struggle!

This article aims to analyze the GMX source code and help everyone understand its underlying technology, avoiding unnecessary pitfalls.`,
      zh: `# 0x00 前言

GMX是一个支持低交换费和零价格冲击交易的去中心化现货和永续合约交易所。

> GMX is a decentralized spot and perpetual exchange that supports low swap fees and zero price impact trades.

GMX部署在Arbitrum和Avalanche网络上，是过去半年表现最好的DeFi协议之一。

这两天因为项目需要，一直在研究GMX源码，对于我这种从来没搞过DeFi，对金融一窍不通的人，看GMX真的看吐了！

本文将尝试对GMX源码进行解读，帮助大家提高对GMX底层技术的理解，少走一些弯路。`
    },
    date: "2023-06-19",
    tags: ["Blockchain", "Blog Challenge", "GMX", "DeFi", "Solidity", "Hardhat", "Foundry"],
    category: "Blockchain",
    blogUrl: "https://exermon-blog.notion.site/GMX-079ab98b985241a0b30e6aaf66d7839d"
  },
  {
    title: {
      en: "[Weekly Blog] Solidity Contract Code Completion in TypeScript (Part 1)",
      zh: "【每周博客】Solidity合约在TypeScript中的代码补全方案（一）"
    },
    slug: "solidity-contract-code-completion-in-typescript-part-1",
    description: {
      en: `# **0x00 Introduction**

If you have ever developed a DApp using JavaScript/TypeScript, you have probably used web3.js or ethers.js. Personally, I am more familiar with web3.js but have recently started using ethers.js as well. In terms of development experience, the two libraries do not differ much.

However, when writing contract interactions in JavaScript/TypeScript, whether using web3.js or ethers.js, there is one major inconvenience—they both lack **code completion**!`,
      zh: `# 0x00 前言

相信大家在使用JavaScript/TypeScript开发DApp时应该都有使用web3.js或ethers.js。笔者用web3.js更多更熟练，最近也有使用ethers.js，但从开发体验上来说两者其实也没太大差别。

实际上，在JavaScript/TypeScript上写合约调用的时候，无论是用web3.js还是ethers.js，都非常不方便——因为它们都缺少一个功能：**代码补全！**`
    },
    date: "2023-06-26",
    tags: ["Blockchain", "Blog Challenge", "TypeScript", "Web3.js", "Ethers.js"],
    category: "Blockchain",
    blogUrl: "https://exermon-blog.notion.site/Solidity-TypeScript-865c6071df9e4fab8fac8d6bd490c523"
  },
  {
    title: {
      en: "[Weekly Blog][10k+ words] GMX Source Code Interpretation (Part 2)",
      zh: "【每周博客】【万字长文】GMX源码解读（二）"
    },
    slug: "gmx-source-code-interpretation-part-2",
    description: {
      en: `# **0x00 Introduction**
  
  In the previous article:  
  
  [GMX Source Code Interpretation (Part 1)](https://www.notion.so/GMX-079ab98b985241a0b30e6aaf66d7839d)  
  
  we analyzed some fundamental aspects of GMX.  
  
  This week, we will take a deeper look at key contracts from the previous GMX article: **Vault, VaultPriceFeed, and FastPriceFeed**.
  
  ## **This article will provide a line-by-line analysis, diving into the code in great detail**  
  
  Although Notion doesn't support "like, follow, and share," this is definitely a hardcore technical deep dive!`,
      zh: `# 0x00 前言
  
  上一篇文章：  
  
  [【GMX源码解读（一）】](https://www.notion.so/GMX-079ab98b985241a0b30e6aaf66d7839d)  
  
  我们对GMX的一些基础部分进行了分析。  
  
  这周我们详细解析一下上次GMX文章的几个关键合约：**Vault、VaultPriceFeed 和 FastPriceFeed**。
  
  ## **本文将会对代码进行以行为单位的解读，逐行讲解，非常硬核，建议一键三连**  
  
  虽然 Notion 没有一键三连😆`
    },
    date: "2023-06-26",
    tags: ["Blockchain", "Blog Challenge", "GMX", "DeFi", "Solidity", "Hardhat", "Foundry"],
    category: "Blockchain",
    blogUrl: "https://exermon-blog.notion.site/GMX-af5abc5e658348b493eabb1b82f54dd2"
  },  
  {
    title: {
      en: "[Weekly Blog][10k+ words] LangChain Source Code Interpretation (Part 1)",
      zh: "【每周博客】【万字长文】LangChain踩坑记录和源码解读"
    },
    slug: "langchain-source-code-interpretation-part-1",
    description: {
      en: `# **0x00 Introduction**

Initially, I planned to continue from my third article:  

[Part 3: **[10k+ Words]** Sismo Interpretation Series: Sismo Badge](https://www.notion.so/Sismo-Sismo-Badge-2798fbce5838483599ef9f9013cd452d?pvs=21)

While reviewing the Sismo documentation, I had an idea—could I feed all the docs into GPT and let AI generate this week's blog for me?  

This led me to build a small tool called **Doc2Blog**, which takes all the documentation of a project and generates blog content on a specific topic.  

This process essentially involves creating a local knowledge base (the documentation) and allowing GPT to answer based on it.  

While working on this, I ran into numerous issues. Ironically, I barely read much of the Sismo documentation but ended up debugging and exploring parts of LangChain's source code instead. So, I decided to write about my LangChain debugging experience this week!`,
      zh: `# 0x00 前言

本来这周想接着第三篇的进度 ↓

[第三篇：**【万字长文】**Sismo解读系列：Sismo Badge](https://www.notion.so/Sismo-Sismo-Badge-2798fbce5838483599ef9f9013cd452d?pvs=21)

写一下Sismo Connect的，在看Sismo文档时，突发奇想：能不能把文档全部丢给GPT，让AI帮我写这周的博客？——做一个小工具Doc2Blog：给定一个项目的全部文档，生成指定题目的博客。

这个工作相当于构造一个本地的知识库（文档），让GPT基于这个知识库来回答，于是在网上搜了一些资料，开始着手实现。

然后，不断踩坑，到最后，Sismo文档没看几句，反而为了Debug把LangChain的一些源码看了一遍，于是，这周干脆写一下LangChain的踩坑体验吧！`
    },
    date: "2023-07-08",
    tags: ["AI", "LangChain", "TypeScript"],
    category: "AI",
    blogUrl: "https://exermon-blog.notion.site/LangChain-419bb08264ed48be8f312501f5a797ea"
  },  
  {
    title: {
      en: "Submit Git Repo with Specific Private Key",
      zh: "使用特定私钥提交特定 Git Repo"
    },
    slug: "submit-git-repo-with-specific-private-key",
    description: {
      en: `This article will show you how to use a specific private key to submit a specific Git repository. This is particularly useful when working with multiple GitHub accounts for collaboration.`,
      zh: `本文用最直观的方式实现使用特定私钥提交特定 Git Repo，当使用多 Github 账号进行协作时将非常有用`
    },
    date: "2025-01-05",
    tags: ["Git"],
    category: "General",
    blogUrl: "https://www.notion.so/exermon-blog/Git-Repo-17248ee5ba8d8099bd1dffbf68555e92"
  },  
  {
    title: {
      en: "[Weekly Blog][10k+ words] Cosmos + EVM Blockchain Setup (Part 1)",
      zh: "【每周博客】【万字长文】Cosmos + EVM 区块链搭建（一）"
    },
    slug: "cosmos-evm-blockchain-setup-part-1",
    description: {
      en: `# **0x00 Introduction**

If Bitcoin represents Blockchain 1.0 and Ethereum represents Blockchain 2.0, then Cosmos has the potential to become the representative of Blockchain 3.0. The core concept of Cosmos is application chaining -- each application can build its own proprietary blockchain on a unified underlying architecture, with each chain focusing on a specific application. Each chain is focused on a specific application, and at the same time, each chain can be connected to each other to form an Internet of blockchain. This interconnected ecosystem is the blockchain 3.0 that Cosmos aims to build.

Due to project requirements, I recently needed to delve deeper into Cosmos and actually apply it to build multiple blockchains for different scenarios. Therefore, one of the topics of this round of blogging challenge is Cosmos! I will record my experience and study notes on Cosmos in the following blogs, so as to provide some help to other newcomers who are interested in Cosmos~`,
      zh: `# **0x00 前言**

如果说比特币代表着区块链 1.0，以太坊代表着区块链 2.0，那么 Cosmos 有潜力成为区块链 3.0 的代表。Cosmos 的核心理念是应用链 —— 每个应用都可以在统一的底层架构上构建自己的专属区块链，每条链专注于某个特定应用，同时各链之间可以相互连接，形成一个区块链的互联网。这种互联互通的生态系统，就是 Cosmos 所要构建的区块链 3.0。

由于项目需求，最近需要深入研究 Cosmos，并实际应用它来搭建多条区块链，用于不同的场景。因此，本轮博客挑战其中一个主题就是 Cosmos！我会在后续的博客中记录下我学习 Cosmos 的心得体会和学习笔记，给其他对 Cosmos 感兴趣的新人提供一些帮助~`
    },
    date: "2025-04-19",
    tags: ["Blockchain", "Blog Challenge", "Cosmos", "Ignite"],
    category: "Blockchain",
    blogUrl: "https://www.notion.so/exermon-blog/Cosmos-EVM-1d548ee5ba8d806c99efd286a98dcde0"
  }
];
