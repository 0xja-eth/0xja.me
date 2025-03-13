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
