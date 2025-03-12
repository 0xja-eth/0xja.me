import { Skill } from './types';
import { GameController, Code, Wallet, Database, Globe, Robot } from '@phosphor-icons/react';

export const skills: Skill[] = [
  {
    name: {
      en: "Web3 Development",
      zh: "Web3 开发"
    },
    icon: Wallet,
    level: 90,
    description: {
      en: "Smart contract development, DApp development, blockchain integration",
      zh: "智能合约开发、DApp开发、区块链集成"
    },
    category: "Blockchain"
  },
  {
    name: {
      en: "Game Development",
      zh: "游戏开发"
    },
    icon: GameController,
    level: 85,
    description: {
      en: "Unity development, WebGL games, blockchain gaming",
      zh: "Unity开发、WebGL游戏、链游开发"
    },
    category: "Gaming"
  },
  {
    name: {
      en: "Full Stack Development",
      zh: "全栈开发"
    },
    icon: Code,
    level: 88,
    description: {
      en: "Frontend, backend development, system architecture",
      zh: "前端开发、后端开发、系统架构"
    },
    category: "Development"
  },
  {
    name: {
      en: "Database & Backend",
      zh: "数据库与后端"
    },
    icon: Database,
    level: 85,
    description: {
      en: "Database design, API development, server management",
      zh: "数据库设计、API开发、服务器管理"
    },
    category: "Development"
  },
  {
    name: {
      en: "Web Development",
      zh: "Web开发"
    },
    icon: Globe,
    level: 92,
    description: {
      en: "Modern frontend frameworks, responsive design, performance optimization",
      zh: "现代前端框架、响应式设计、性能优化"
    },
    category: "Development"
  },
  {
    name: {
      en: "AI Integration",
      zh: "AI集成"
    },
    icon: Robot,
    level: 82,
    description: {
      en: "AI model integration, intelligent algorithm development, data analysis",
      zh: "AI模型集成、智能算法开发、数据分析"
    },
    category: "AI"
  }
];
