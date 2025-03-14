import { PersonalInfo } from './types';
import { GithubLogo, TwitterLogo, Globe, EnvelopeSimple } from '@phosphor-icons/react';
import { Stat } from './types';

export const stats: Stat[] = [
  { 
    name: 'HP', 
    value: 98, 
    icon: '❤️', 
    color: '#ff6b6b',
    description: {
      en: 'Represents endurance for long coding sessions and high-pressure deadlines. Higher HP means better stamina and faster recovery.',
      zh: '代表长时间编码和高压力截止日期下的耐力。HP越高，持久力越强，恢复越快。'
    }
  },
  { 
    name: 'Basic Dev', 
    value: 90, 
    icon: '💻', 
    color: '#4dabf7',
    description: {
      en: 'Core programming proficiency, including mastery of fundamental algorithms, data structures, and full-stack development skills.',
      zh: '核心编程能力，包括对基础算法、数据结构的掌握，以及全栈开发技能。'
    }
  },
  { 
    name: 'Game Dev', 
    value: 83, 
    icon: '🎮', 
    color: '#51cf66',
    description: {
      en: 'Aptitude for game development, including familiarity with game engines, gameplay mechanics, and performance optimization.',
      zh: '游戏开发领域的天赋，包括对游戏引擎、玩法机制和性能优化的熟悉程度。'
    }
  },
  { 
    name: 'Web3 Dev', 
    value: 88, 
    icon: '⛓️', 
    color: '#845ef7',
    description: {
      en: 'Proficiency in blockchain technologies, including smart contract development, on-chain bot development, and cryptographic principles.',
      zh: '区块链技术上的熟练度，包括智能合约开发、链上机器人开发以及对加密技术的了解。'
    }
  },
  { 
    name: 'AI Dev', 
    value: 70, 
    icon: '🤖', 
    color: '#ffd43b',
    description: {
      en: 'Understanding of AI tools and techniques, including prompt engineering and integration of AI capabilities into projects.',
      zh: '对AI工具和技术的理解，包括提示词工程和AI能力在项目中的整合。'
    }
  },
  { 
    name: 'Action', 
    value: 78, 
    icon: '⚡', 
    color: '#ff922b',
    description: {
      en: 'Speed and efficiency in learning new technologies, delivering results, and responding to market trends. Higher Action means faster adaptation and execution.',
      zh: '学习新技术、交付成果以及对市场热点的反应速度。Action越高，适应和执行速度越快。'
    }
  },
];

export const personalInfo: PersonalInfo = {
  name: '0xJA.eth',
  title: {
    en: 'Web3 Developer & Gaming Enthusiast',
    zh: 'Web3 开发者 & 游戏爱好者'
  },
  bio: {
    en: 'Full-stack developer focused on blockchain technology and game development. Passionate about exploring new technologies and creating interesting applications.',
    zh: '全栈开发者，专注于区块链技术和游戏开发。热衷于探索新技术，创造有趣的应用。'
  },
  avatar: '/avatar.png',
  email: '0xja.eth@gmail.com', // 请替换为您的邮箱
  location: 'China',
  socialLinks: [
    {
      platform: 'GitHub',
      url: 'https://github.com/0xja-eth',
      icon: GithubLogo
    },
    {
      platform: 'Twitter',
      url: 'https://x.com/JXiaoLoong',
      icon: TwitterLogo
    },
    {
      platform: 'Email',
      url: 'mailto:0xja.eth@gmail.com',
      icon: EnvelopeSimple
    }
  ]
};
