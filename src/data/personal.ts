import { PersonalInfo } from './types';
import { GithubLogo, TwitterLogo, Globe, EnvelopeSimple } from '@phosphor-icons/react';

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
  email: 'your-email@example.com', // 请替换为您的邮箱
  location: '中国',
  socialLinks: [
    {
      platform: 'GitHub',
      url: 'https://github.com/yourusername',
      icon: GithubLogo
    },
    {
      platform: 'Twitter',
      url: 'https://twitter.com/yourusername',
      icon: TwitterLogo
    },
    {
      platform: 'Website',
      url: 'https://your-website.com',
      icon: Globe
    },
    {
      platform: 'Email',
      url: 'mailto:your-email@example.com',
      icon: EnvelopeSimple
    }
  ]
};
