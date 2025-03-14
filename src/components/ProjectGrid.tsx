'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project, ProjectCategory } from '@/data/types';
import { projectCategories } from '@/data/categories';
import { useLanguage } from '@/i18n/context';
import Image from 'next/image';

interface ProjectGridProps {
  projects: Project[];
  translations: {
    viewDemo: string;
    viewGithub: string;
    techStack: string;
  };
}

export default function ProjectGrid({ projects, translations }: ProjectGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'All'>('All');
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const { language } = useLanguage();

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`pixel-button ${
            selectedCategory === 'All' ? 'bg-purple-600' : 'bg-gray-700'
          }`}
        >
          🌟 {language === 'en' ? 'All Projects' : '全部项目'}
        </button>
        {Object.entries(projectCategories).map(([key, category]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key as ProjectCategory)}
            className={`pixel-button ${
              selectedCategory === key ? 'bg-purple-600' : 'bg-gray-700'
            }`}
          >
            {category.icon} {category.name[language]}
          </button>
        ))}
      </div>

      {/* Category Description */}
      {selectedCategory !== 'All' && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-gray-400 max-w-2xl mx-auto"
        >
          {projectCategories[selectedCategory].description[language]}
        </motion.div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.title[language]}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="group relative"
              onMouseEnter={() => setHoveredProject(project.title[language])}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="relative aspect-[4/3] overflow-hidden pixel-border">
                {/* Category Badge */}
                <div 
                  className="absolute top-2 right-2 z-20 px-2 py-1 rounded-full text-sm font-pixel"
                  style={{ backgroundColor: projectCategories[project.category].color + '80' }}
                >
                  {projectCategories[project.category].icon}
                </div>

                {/* Project Image */}
                <Image
                  src={project.imageUrl}
                  alt={project.title[language]}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-black/80 flex flex-col justify-center items-center p-6 transition-opacity duration-300 ${
                  hoveredProject === project.title[language] ? 'opacity-100' : 'opacity-0'
                }`}>
                  <h3 className="text-xl font-pixel mb-4 text-center">
                    {project.title[language]}
                  </h3>
                  <p className="text-sm text-gray-300 mb-4 line-clamp-4">
                    {project.description[language]}
                  </p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-800 rounded-full text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pixel-button bg-indigo-600 hover:bg-indigo-700"
                      >
                        {translations.viewDemo}
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pixel-button bg-gray-700 hover:bg-gray-600"
                      >
                        {translations.viewGithub}
                      </a>
                    )}
                  </div>
                </div>

                {/* Time Period */}
                <div className="absolute bottom-2 left-2 z-20 text-xs font-pixel bg-black/50 px-2 py-1 rounded">
                  {project.startDate} - {project.endDate}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
