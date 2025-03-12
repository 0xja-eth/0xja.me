'use client';

import { motion } from "framer-motion";
import Image from "next/image";
import ProjectCard from "@/components/ProjectCard";
import ChainMap from "@/components/ChainMap";
import DynamicBackground from "@/components/DynamicBackground";
import { personalInfo } from "@/data/personal";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import { useLanguage } from "@/i18n/context";

export default function Home() {
  const { t, language } = useLanguage();

  return (
    <>
      <DynamicBackground />
      <div className="pt-20 relative">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-8"
            >
              <div className="absolute inset-[-2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-spin-slow" />
              <div className="absolute inset-[2px] bg-gray-900 rounded-full" />
              <Image
                src={personalInfo.avatar}
                alt={personalInfo.name}
                fill
                className="rounded-full object-cover p-[2px]"
                priority
              />
            </motion.div>
            <h1 className="text-4xl md:text-6xl font-bold neon-text mb-4">
              {personalInfo.name}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              {t.hero.title}
            </p>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              {t.hero.bio}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {personalInfo.socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pixel-button flex items-center gap-2"
                  >
                    <Icon size={20} />
                    <span>{link.platform}</span>
                  </a>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* Chain Map Section */}
        <section className="py-20 px-4">
          <h2 className="text-2xl md:text-3xl text-center neon-text mb-4">
            {t.chainMap.title}
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            {t.chainMap.description}
          </p>
          <div className="max-w-6xl mx-auto">
            <ChainMap />
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-20 px-4">
          <h2 className="text-2xl md:text-3xl text-center neon-text mb-12">
            {t.skills.title}
          </h2>
          <div className="max-w-3xl mx-auto grid gap-8">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <motion.div
                  key={skill.name[language]}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="pixel-border p-4 backdrop-blur-sm bg-gray-900/30"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <Icon size={24} />
                    <h3 className="text-lg">
                      {t.skills.categories[skill.category as keyof typeof t.skills.categories] || skill.name[language]}
                    </h3>
                  </div>
                  <div className="h-4 bg-gray-700 pixel-border">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: index * 0.2 }}
                      className="h-full bg-indigo-600"
                    />
                  </div>
                  <span className="text-sm text-gray-400 mt-1 block">
                    {t.skills.levelPrefix} {skill.level}/100
                  </span>
                  {skill.description && (
                    <p className="text-sm text-gray-400 mt-2">{skill.description[language]}</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-transparent to-gray-900/50">
          <h2 className="text-2xl md:text-3xl text-center neon-text mb-12">
            {t.projects.title}
          </h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.filter(p => p.featured).map((project, index) => (
              <ProjectCard 
                key={project.title[language]}
                {...project} 
                index={index}
                translations={{
                  viewDemo: t.projects.viewDemo,
                  viewGithub: t.projects.viewGithub,
                  techStack: t.projects.techStack
                }}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
