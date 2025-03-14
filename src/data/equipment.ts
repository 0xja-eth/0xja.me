import { Equipment } from "./types";

export const RARITY_COLORS = {
  common: '#95a5a6',
  rare: '#3498db',
  epic: '#9b59b6',
  legendary: '#f1c40f'
} as const;

export const equipments: Equipment[] = [
  {
    id: 'keyboard',
    name: {
      en: 'Mechanical Keyboard',
      zh: '机械键盘'
    },
    type: 'weapon',
    icon: '⌨️',
    rarity: 'rare',
    stats: [0, 3, 0, 0, 0, 2],
    description: {
      en: 'A high-performance mechanical keyboard designed to enhance coding efficiency and accuracy.',
      zh: '高性能机械键盘，旨在提升编码效率和准确性。'
    }
  },
  {
    id: 'ide',
    name: {
      en: 'Windsurf IDE',
      zh: 'Windsurf IDE'
    },
    type: 'weapon',
    icon: '🛡️',
    rarity: 'legendary',
    stats: [0, 8, 3, 3, 3, 15],
    description: {
      en: 'The world\'s first agentic IDE powered by AI, revolutionizing the way developers write and debug code.',
      zh: '全球首个由AI驱动的智能IDE，彻底改变了开发者编写和调试代码的方式。'
    }
  },
  {
    id: 'coffee',
    name: {
      en: 'Energy Coffee',
      zh: '充能咖啡'
    },
    type: 'accessory',
    icon: '☕',
    rarity: 'rare',
    stats: [10, 0, 0, 0, 0, 3],
    description: {
      en: 'Essential fuel for developers, providing the energy needed for long coding sessions.',
      zh: '开发者的必备燃料，为长时间编码提供所需能量。'
    }
  },
  {
    id: 'monitor',
    name: {
      en: '4K Ultra Monitor',
      zh: '4K超清显示器'
    },
    type: 'armor',
    icon: '🖥️',
    rarity: 'epic',
    stats: [0, 2, 3, 0, 0, 6],
    description: {
      en: 'A high-resolution display that enhances productivity and reduces eye strain during long coding sessions.',
      zh: '高分辨率显示器，提升工作效率，减少长时间编码带来的眼疲劳。'
    }
  },
  {
    id: 'gaming_chair',
    name: {
      en: 'Ergo Throne',
      zh: '人体工学王座'
    },
    type: 'armor',
    icon: '🪑',
    rarity: 'rare',
    stats: [9, 0, 0, 0, 0, 0],
    description: {
      en: 'An ergonomic chair designed for comfort during extended periods of coding.',
      zh: '专为长时间编码设计的符合人体工学的舒适座椅。'
    }
  },
  {
    id: 'cat',
    name: {
      en: 'CTO (Cat Technology Officer)',
      zh: '喵星技术官'
    },
    type: 'accessory',
    icon: '🐱',
    rarity: 'legendary',
    stats: [10, 3, 1, 1, 1, 0],
    description: {
      en: 'A perfect companion for developers, providing stress relief and endless entertainment, even occasionally helping you debug code.',
      zh: '开发者的完美伙伴，提供减压、无尽的娱乐，它甚至偶尔会帮你调试代码。'
    }
  },
  {
    id: 'network',
    name: {
      en: '100G Network',
      zh: '100G网络'
    },
    type: 'accessory',
    icon: '🌐',
    rarity: 'epic',
    stats: [0, 0, 0, 10, 0, 8],
    description: {
      en: 'A high-speed network connection that ensures seamless development and fast data transfers.',
      zh: '高速网络连接，确保无缝开发和快速数据传输。'
    }
  },
];