'use client';

import { motion } from 'framer-motion';
import { Project } from '@/data/types';
import Image from 'next/image';
import { ArrowSquareOut, GithubLogo } from '@phosphor-icons/react';
import {useLanguage} from "@/i18n/context";

interface ProjectCardProps extends Project {
  index: number;
  translations: {
    viewDemo: string;
    viewGithub: string;
    techStack: string;
  };
}

export default function ProjectCard({
  title,
  description,
  imageUrl,
  techStack,
  githubUrl,
  demoUrl,
  index,
  translations
}: ProjectCardProps) {
  const { language } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="pixel-border p-4 backdrop-blur-sm bg-gray-900/30 flex flex-col"
    >
      <div className="relative w-full h-48 mb-4 pixel-border overflow-hidden">
        <Image
          src={imageUrl}
          alt={title[language]}
          fill
          className="object-cover transition-transform hover:scale-110"
        />
      </div>
      <h3 className="text-xl font-bold mb-2">{title[language]}</h3>
      <p className="text-gray-400 mb-4 flex-grow">{description[language]}</p>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-bold mb-2">{translations.techStack}</h4>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs bg-indigo-900/50 rounded pixel-border"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2">
          {demoUrl && (
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-button flex items-center gap-2 flex-1 justify-center"
            >
              <ArrowSquareOut size={20} />
              {translations.viewDemo}
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-button flex items-center gap-2 flex-1 justify-center"
            >
              <GithubLogo size={20} />
              {translations.viewGithub}
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
