import { blogCategories, projectCategories } from "./categories";

export interface LocalizedText {
  en: string;
  zh: string;
}

export interface Skill {
  name: LocalizedText;
  icon: any; // 由于图标是从 @phosphor-icons/react 导入，这里用 any
  level: number;
  description: LocalizedText;
  category?: string;
}

export interface Project {
  title: LocalizedText;
  description: LocalizedText;
  category: ProjectCategory;
  techStack: string[];
  startDate: string;
  endDate: string;
  demoUrl?: string;
  githubUrl?: string;
  imageUrl: string;
}

export type ProjectCategory = keyof typeof projectCategories; // 'Gaming' | 'DeFi' | 'Web3' | 'AI' | 'Tool';

export interface CategoryInfo {
  name: LocalizedText;
  icon: string;
  description: LocalizedText;
  color: string;
}

export interface Chain {
  name: string;
  icon: string | null;
  url: string;
  color: string;
  level?: number;
  description: LocalizedText;
  projects?: string[]; // 关联的项目标题列表
  achievements?: Achievement[];
}

export interface Achievement {
  title: LocalizedText;
  description: LocalizedText;
  date: string;
  icon?: string;
}

export type BlogCategory = keyof typeof blogCategories; // 'GameFi' | 'DeFi' | 'Technology';

export interface BlogPost {
  title: LocalizedText;
  slug: string;
  description: LocalizedText;
  content?: LocalizedText;
  date: string;
  tags: string[];
  blogUrl?: string;
  category: BlogCategory;
  coverImage?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: any; // 从 @phosphor-icons/react 导入的图标
}

export interface PersonalInfo {
  name: string;
  title: LocalizedText;
  bio: LocalizedText;
  avatar: string;
  email?: string;
  location?: string;
  socialLinks: SocialLink[];
}

export interface Stat {
  name: string;
  value: number;
  icon: string;
  color: string;
  description: LocalizedText;
}

export interface Equipment {
  id: string;
  name: LocalizedText;
  type: 'weapon' | 'armor' | 'accessory';
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  stats: number[];
  description: LocalizedText;
}
