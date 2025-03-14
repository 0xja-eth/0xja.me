import { Project } from './types';

export const projects: Project[] = [
  {
    title: {
      en: "C10-548 Adventure",
      zh: "C10-548 历险记"
    },
    description: {
      en: `One-Month Crash Course! From "Hello World" to a Console ASCII Action Game in C++—No Third-Party Libraries, Pure and Unfiltered! The development process utilizes the open-source tool ASCII Generator, with some assets sourced from RPG Maker MV.

Time: May 7, 2018, 4:00 AM  
Location: Dormitory C10-548, a certain school  
Event: The rhythmic sounds from Room 548 had been echoing through the night for over four hours—relentless keyboard clacking, the friction of a mouse against the desk, the groans of error messages, and the silent agony of falling hair. The entire C10 dormitory was kept awake, their patience worn thin. In a collective act of frustration, armed with whatever they could find, the residents of C10 gathered at the door of Room 548…`,
      zh: `一个月速成！用 C++ 从 \"Hello World\" 到控制台字符画动作游戏，无任何第三方库——绝对清真！开发过程使用到开源工具 ASCII Generator，部分素材来源：RPG Maker MV。

时间：公元2018年5月7日，凌晨4:00。
地点：某学校C10-548宿舍
事件：548宿舍内的啪啪声已经持续了4个多小时。键盘的敲击声，鼠标的摩擦声，报错的呻吟声，还有头发的掉落声，深深困扰着整个C10宿舍楼。C10的各位彻夜难眠，为了表达内心的愤怒，大家拿着身边的武器，来到C10-548门前……`
    },
    imageUrl: "/projects/project1.png",
    techStack: ["C++", "Game", "Console", "ASCII"],
    githubUrl: "https://gitee.com/jyanon/hkk",
    demoUrl: "https://www.bilibili.com/video/BV1DV411E7xp",
    category: "Game",
    startDate: "2018-04",
    endDate: "2018-05"
  },
  {
    title: {
      en: "[Game Jam] Wane-Wax",
      zh: "【Game Jam】Wane-Wax"
    },
    description: {
      en: "Starting from the theme of Lost&Found, we think of the corresponding relationship between gain and loss. Everything in the world develops under the constant repetition and circulation of \"gain\" and \"lost\", which reminds us of a Chinese idiom \"this ebbs and the other grows\", and the similar English expression is \"Wane & wax\".  From this we made this game against our own \"reflection\".  In the game, both sides create their own terrain by placing blocks in their own area while creating corresponding vacancies in the opponent's terrain.  Once the game character falls, it will cause a decrease in the value of life. When it falls to the bottom of the map corresponding to the character or loses all the value of life, the game ends.",
      zh: "从 Lost&Found 的主题出发，我们思考了得失之间的对应关系。世间万物在“得”与“失”的不断重复循环下发展，这让我们想起了一句成语“此消彼长”，而类似的英文表达则是“Wane & wax”，由此我们制作了这款与自己“对抗”的游戏。在游戏中，双方通过在自己的区域放置方块来创造自己的地形，同时在对手的地形中创造相应的空缺。一旦游戏角色掉落，将导致生命值的减少。当它掉落到与角色对应的地图底部或失去所有生命值时，游戏结束。"
    },
    imageUrl: "/projects/project2.png",
    techStack: ["Unity", "C#", "Game", "Game Jam"],
    githubUrl: "https://github.com/0xja-eth/Wane-Wax",
    demoUrl: "https://www.bilibili.com/video/BV1Cy4y117Bw",
    category: "Game",
    startDate: "2021-01",
    endDate: "2021-01"
  },
  {
    title: {
      en: "Exermon",
      zh: "艾瑟萌特训"
    },
    description: {
      en: "Exermon is a kind of creature that lives on learning. In the world of Exermon, there is an Exermon Academy, where Exermons are trained in learning. They can only become stronger by constantly learning. One day, a teenager with Chuunibyou appeared in the Exermon Academy. He mastered a lot of knowledge and left the academy, using this knowledge to transform the Exermons, creating many strange creatures, posing a huge threat to the academy. You are an Exermon in the Exermon Academy, and you have accepted a special mission to explore the truth of the matter...",
      zh: "艾瑟萌是一类以学习为生的生物。在艾瑟萌的世界里，有一座艾瑟萌学院，艾瑟萌们在里面培养学习，它们只有不断学习才能变强。某天，艾瑟萌学院里出现了一位中二少年，他掌握了大量知识离开了学院，并使用这些知识对艾瑟萌进行改造，制造出许多奇奇怪怪的生物，给学院形成了巨大的威胁。你是艾瑟萌学院中的一名艾瑟萌，接受了一个特别任务，出发去探索事情的真相……"
    },
    imageUrl: "/projects/project3.png",
    techStack: ["Unity", "C#", "Game", "Serious Game"],
    githubUrl: "https://github.com/0xja-eth/Exermon",
    demoUrl: "https://www.bilibili.com/video/BV1754y1G7CN",
    category: "Game",
    startDate: "2023-07",
    endDate: "2023-12"
  },
  {
    title: {
      en: "Data2.cash",
      zh: "Data2.cash"
    },
    description: {
      en: "Data2.cash aims to break down data silos, put users back in control of their data, generate passive income from their data and maximise the efficiency of their data assets.",
      zh: "Data2.cash旨在打破数据孤岛，让用户重新掌握数据控制权，从数据中获得被动收入，并最大化数据资产的效率。"
    },
    imageUrl: "/projects/project4.png",
    techStack: ["Web3", "ZKP", "DataFi", "Solidity"],
    githubUrl: "https://github.com/data2-cash/Data2Cash",
    demoUrl: "https://data2.cash",
    category: "Web3",
    startDate: "2023-04",
    endDate: "Now"
  },
  {
    title: {
      en: "[ETH Global] Tag Trove",
      zh: "【ETH Global】Tag Trove"
    },
    description: {
      en: "Transitioning Web2 user data to Web3 through a user-centric, privacy preserving way, with a precise marketing channel as data trading use case.",
      zh: "通过以用户为中心、隐私保护的方式，将 Web2 用户数据迁移到 Web3，以精准营销渠道作为数据交易用例。"
    },
    imageUrl: "/projects/project5.jpg",
    techStack: ["Web3", "ETH Global", "ZKP", "DataFi", "Solidity"],
    githubUrl: "https://github.com/0xhardman/tag-trove",
    demoUrl: "https://ethglobal.com/showcase/tagtrove-kvtma",
    category: "Web3",
    startDate: "2023-11",
    endDate: "2023-11"
  },
  {
    title: {
      en: "[ETH Global] Lazy Peggy",
      zh: "【ETH Global】Lazy Peggy"
    },
    description: {
      en: "Passive position management plugin for pegged assets on Zircuit",
      zh: "Zircuit 上的 pegged 资产的被动持仓管理插件"
    },
    imageUrl: "/projects/project6.jpg",
    techStack: ["Web3", "ETH Global", "Zircuit", "DeFi", "Uniswap", "Solidity"],
    githubUrl: "https://github.com/ETHGlobal2024",
    demoUrl: "https://ethglobal.com/showcase/lazy-peggy-snz2v",
    category: "Web3",
    startDate: "2024-6",
    endDate: "2024-6"
  }, 
  {
    title: {
      en: "[ETH Global] Bangkok On Time",
      zh: "【ETH Global】Bangkok On Time"
    },
    description: {
      en: "BOT is a cell phone web app that allows users to check the estimated travel time between two locations and purchase insurance for the travel time.",
      zh: "BOT 是一个手机 Web 应用，允许用户检查两个地点之间的估计行程时间并购买行程时间保险。"
    },
    imageUrl: "/projects/project7.png",
    techStack: ["Web3", "ETH Global", "vLayer", "Solidity"],
    githubUrl: "https://github.com/0xhardman/BOT",
    demoUrl: "https://ethglobal.com/showcase/bangkokontime-bot-08k39",
    category: "Web3",
    startDate: "2024-11",
    endDate: "2024-11"
  }, 
  {
    title: {
      en: "Eliza Fiber Plugin",
      zh: "Eliza Fiber 插件"
    },
    description: {
      en: "Fiber is a type of Lightning Network that enables AI Agents to make stablecoin payments using the Lightning Network. This PR introduces a new plugin: the CKB Fiber Plugin, enabling the Eliza agent to interact with the Fiber Network by managing a Fiber node. We implemented a standalone Fiber Network RPC client and developed a series of actions within the Eliza framework. These actions leverage the RPC client to send RPC requests and facilitate communication with the Fiber node.",
      zh: "Fiber 是一种 Lightning Network 变体，使 AI 代理能够通过闪电网络进行稳定币支付。此 PR 引入了一个新插件：CKB Fiber 插件，使 Eliza 代理能够通过管理一个 Fiber 节点与 Fiber 网络交互。我们实现了一个独立运行的 Fiber Network RPC 客户端，并在 Eliza 框架内开发了一系列操作。这些操作利用 RPC 客户端发送 RPC 请求，以促进与 Fiber 节点的通信。"
    },
    imageUrl: "/projects/project8.jpeg",
    techStack: ["Web3", "Eliza", "Fiber Network", "CKB"],
    githubUrl: "https://github.com/FiberInEliza/eliza/tree/plugin-ckb-fiber",
    demoUrl: "https://github.com/FiberInEliza/eliza/tree/plugin-ckb-fiber",
    category: "Utility",
    startDate: "2025-1",
    endDate: "2025-1"
  }
];
