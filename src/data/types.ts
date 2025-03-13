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
  title: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
  imageUrl: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  category: ProjectCategory;
  featured: boolean;
  startDate: string;
  endDate: string;
}

export type ProjectCategory = 'Gaming' | 'DeFi' | 'Web3' | 'AI' | 'Tool';

export interface ProjectCategoryInfo {
  name: {
    en: string;
    zh: string;
  };
  icon: string;
  color: string;
  description: {
    en: string;
    zh: string;
  };
}

export interface Chain {
  name: string;
  icon: string | null;
  url: string;
  color: string;
  level?: number;
  description: LocalizedText;
  position: {
    x: number;
    y: number;
  };
  projects?: string[]; // 关联的项目标题列表
  achievements?: Achievement[];
}

export interface Achievement {
  title: LocalizedText;
  description: LocalizedText;
  date: string;
  icon?: string;
}

export interface BlogPost {
  title: LocalizedText;
  slug: string;
  description: LocalizedText;
  date: string;
  tags: string[];
  category: string;
  featured?: boolean;
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
