import { Project } from './types';

export const projects: Project[] = [
  {
    title: {
      en: "C++ Console ASCII Action Game",
      zh: "C++ 控制台ASCII动作游戏"
    },
    description: {
      en: "A one-month project! From 'Hello World' to a console ASCII action game in C++, no third-party libraries — pure C++! Development process used the open-source tool ASCII Generator, with some assets from RPG Maker MV.",
      zh: "一个月速成！用 C++ 从 \"Hello World\" 到控制台字符画动作游戏，无任何第三方库——绝对清真！开发过程使用到开源工具 ASCII Generator，部分素材来源：RPG Maker MV"
    },
    imageUrl: "/projects/project1.png",
    techStack: ["C++", "Game", "Console", "ASCII"],
    githubUrl: "https://gitee.com/jyanon/hkk",
    demoUrl: "https://www.bilibili.com/video/BV1DV411E7xp",
    category: "Gaming",
    featured: true,
    startDate: "2018-04",
    endDate: "2018-05"
  },
  {
    title: {
      en: "Wane-Wax",
      zh: "此消彼长"
    },
    description: {
      en: "GameJam：Starting from the theme of Lost&Found, we think of the corresponding relationship between gain and loss. Everything in the world develops under the constant repetition and circulation of \"gain\" and \"lost\", which reminds us of a Chinese idiom \"this ebbs and the other grows\", and the similar English expression is \"Wane & wax\".  From this we made this game against our own \"reflection\".  In the game, both sides create their own terrain by placing blocks in their own area while creating corresponding vacancies in the opponent's terrain.  Once the game character falls, it will cause a decrease in the value of life. When it falls to the bottom of the map corresponding to the character or loses all the value of life, the game ends.",
      zh: "GameJam作品：从 Lost&Found 的主题出发，我们思考了得失之间的对应关系。世间万物在“得”与“失”的不断重复循环下发展，这让我们想起了一句成语“此消彼长”，而类似的英文表达则是“Wane & wax”，由此我们制作了这款与自己“对抗”的游戏。在游戏中，双方通过在自己的区域放置方块来创造自己的地形，同时在对手的地形中创造相应的空缺。一旦游戏角色掉落，将导致生命值的减少。当它掉落到与角色对应的地图底部或失去所有生命值时，游戏结束。"
    },
    imageUrl: "/projects/project2.png",
    techStack: ["Unity", "C#", "Game", "Game Jam"],
    githubUrl: "https://github.com/0xja-eth/Wane-Wax",
    demoUrl: "https://www.bilibili.com/video/BV1Cy4y117Bw",
    category: "Gaming",
    featured: true,
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
    category: "DeFi",
    featured: true,
    startDate: "2023-07",
    endDate: "2023-12"
  }
];
