import { CategoryInfo } from './types';

export const projectCategories: Record<string, CategoryInfo> = {
  Game: {
    name: {
      en: 'Game Projects',
      zh: '游戏项目'
    },
    icon: '🎮',
    color: '#51cf66',
    description: {
      en: 'Games and interactive entertainment applications',
      zh: '游戏和互动娱乐应用'
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
      zh: 'AI 项目'
    },
    icon: '🤖',
    color: '#ff6b6b',
    description: {
      en: 'Artificial Intelligence and Machine Learning applications',
      zh: '人工智能和机器学习应用'
    }
  },
  Utility: {
    name: {
      en: 'Utility Tools',
      zh: '实用工具'
    },
    icon: '🛠️',
    color: '#4dabf7',
    description: {
      en: 'Development tools and utilities',
      zh: '开发工具和实用程序'
    }
  },
  Others: {
    name: {
      en: 'Others',
      zh: '其他'
    },
    icon: '💻️',
    color: '#4dabf7',
    description: {
      en: 'Other projects and utilities',
      zh: '其他项目和实用程序'
    }
  }
};

// 'GameFi', 'DeFi', 'Technology'
export const blogCategories: Record<string, CategoryInfo> = {
  Frontend: {
    name: {
      en: 'Frontend Development',
      zh: '前端开发'
    },
    icon: '🖥️',
    color: '#51cf66',
    description: {
      en: 'Frontend development blogs',
      zh: '前端开发相关博客'
    }
  },
  Backend: {
    name: {
      en: 'Backend Development',
      zh: '后端开发'
    },
    icon: '🎛️',
    color: '#ffd43b',
    description: {
      en: 'Backend development blogs',
      zh: '后端开发相关博客'
    }
  },
  Blockchain: {
    name: {
      en: 'Blockchain Development',
      zh: '区块链开发',
    },
    icon: '⛓️',
    color: '#845ef7',
    description: {
      en: 'Blcokchain development blogs',
      zh: '区块链开发相关博客'
    }
  },
  AI: {
    name: {
      en: 'AI Development',
      zh: 'AI 开发'
    },
    icon: '🤖',
    color: '#ff6b6b',
    description: {
      en: 'AI development blogs',
      zh: 'AI 开发相关博客'
    }
  },
  General: {
    name: {
      en: 'General',
      zh: '通用'
    },
    icon: '⚙️',
    color: '#4dabf7',
    description: {
      en: 'General development blogs',
      zh: '通用开发博客'
    }
  },
  Others: {
    name: {
      en: 'Others',
      zh: '其他'
    },
    icon: '📝',
    color: '#4dabf7',
    description: {
      en: 'Other blogs',
      zh: '其他博客'
    }
  }
}