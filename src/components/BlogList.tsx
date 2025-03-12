'use client';

import { blogs } from '@/data/blogs';
import { useLanguage } from '@/i18n/context';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogList() {
  const { language } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <Link
          key={blog.slug}
          href={`/blog/${blog.slug}`}
          className="group pixel-border bg-gray-900/30 backdrop-blur-sm hover:bg-gray-900/50 transition-all"
        >
          <div className="relative aspect-video">
            <Image
              src={blog.coverImage || ""}
              alt={blog.title[language]}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 pixel-border bg-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
              {blog.title[language]}
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              {blog.description[language]}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{blog.category}</span>
              <span>{new Date(blog.date).toLocaleDateString()}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
