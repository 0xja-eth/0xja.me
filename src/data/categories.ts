import { ProjectCategoryInfo } from './types';

export const categories: Record<string, ProjectCategoryInfo> = {
  Gaming: {
    name: {
      en: 'Game Development',
      zh: '游戏开发'
    },
    icon: '🎮',
    color: '#51cf66',
    description: {
      en: 'Games and interactive entertainment applications',
      zh: '游戏和互动娱乐应用'
    }
  },
  DeFi: {
    name: {
      en: 'DeFi Projects',
      zh: '去中心化金融'
    },
    icon: '💰',
    color: '#ffd43b',
    description: {
      en: 'Decentralized finance applications and protocols',
      zh: '去中心化金融应用和协议'
    }
  },
  Web3: {
    name: {
      en: 'Web3 Projects',
      zh: 'Web3 项目'
    },
    icon: '⛓️',
    color: '#845ef7',
    description: {
      en: 'Blockchain and decentralized applications',
      zh: '区块链和去中心化应用'
    }
  },
  AI: {
    name: {
      en: 'AI Projects',
      zh: '人工智能'
    },
    icon: '🤖',
    color: '#ff6b6b',
    description: {
      en: 'Artificial Intelligence and Machine Learning applications',
      zh: '人工智能和机器学习应用'
    }
  },
  Tool: {
    name: {
      en: 'Development Tools',
      zh: '开发工具'
    },
    icon: '🛠️',
    color: '#4dabf7',
    description: {
      en: 'Development tools and utilities',
      zh: '开发工具和实用程序'
    }
  }
};
