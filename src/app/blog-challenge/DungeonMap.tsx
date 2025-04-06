import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { BlogSubmission } from './Challenge';
import './dungeon.css';

interface Position {
  x: number;
  y: number;
}

interface Monster {
  id: number;
  position: Position;
  state: 'standby' | 'active' | 'damaged' | 'failed';
  blogs: BlogSubmission[];
}

interface DungeonMapProps {
  submissions: BlogSubmission[];
  currentCycle: number;
  avatarUrl: string;
}

// 模拟数据
const mockSubmissions: BlogSubmission[] = [
  {
    cycle: 1,
    url: 'https://0xja.me/blog/1',
    title: 'Building a Web3 Blog Platform',
    description: 'In this article, I will share my experience of building a decentralized blog platform using Next.js and Solidity. We will explore the challenges and solutions in detail.',
    timestamp: 1712083200000, // 2024-04-03
  },
  {
    cycle: 1,
    url: 'https://0xja.me/blog/2',
    title: 'Smart Contract Security Best Practices',
    description: 'A comprehensive guide to securing your smart contracts. Learn about common vulnerabilities and how to prevent them.',
    timestamp: 1712169600000, // 2024-04-04
  },
  {
    cycle: 2,
    url: 'https://0xja.me/blog/3',
    title: 'The Future of DeFi',
    description: 'Exploring the latest trends in decentralized finance and what the future holds for this rapidly evolving space.',
    timestamp: 1712256000000, // 2024-04-05
  },
  {
    cycle: 2,
    url: 'https://0xja.me/blog/4',
    title: 'Zero Knowledge Proofs Explained',
    description: 'A deep dive into zero knowledge proofs and their applications in blockchain technology. From theory to practice.',
    timestamp: 1712342400000, // 2024-04-06
  },
  {
    cycle: 3,
    url: 'https://0xja.me/blog/5',
    title: 'Web3 Gaming: The Next Frontier',
    description: 'Discover the exciting world of Web3 gaming and how it\'s changing the gaming industry.',
    timestamp: 1712428800000, // 2024-04-07
  },
  {
    cycle: 3,
    url: 'https://0xja.me/blog/6',
    title: 'NFTs in the Music Industry',
    description: 'How NFTs are revolutionizing the music industry and what this means for artists and fans.',
    timestamp: 1712515200000, // 2024-04-08
  }
];

export const DungeonMap: React.FC<DungeonMapProps> = ({
  submissions,
  currentCycle,
  avatarUrl
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<Position>({ x: 50, y: 50 });
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [path, setPath] = useState<string>('');
  const [hoveredMonster, setHoveredMonster] = useState<Monster | null>(null);
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);

  // submissions = mockSubmissions // Mock

  const currentCycleIdx = currentCycle - 1;

  // 点击外部关闭悬浮框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectedMonster && !event.defaultPrevented) {
          setSelectedMonster(null);
        }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [selectedMonster]);

  // 生成地下城路径
  useEffect(() => {
    if (!mapRef.current) return;
    
    const width = mapRef.current.clientWidth;
    const height = mapRef.current.clientHeight;
    
    // 设置边距
    const margin = 80;
    const effectiveWidth = width - margin * 2;
    const effectiveHeight = height - margin * 2;
    
    // 生成蜿蜒的路径点
    const points: Position[] = [];
    let currentX = margin;
    let currentY = height / 2;
    
    // 使用贝塞尔曲线的控制点来平滑路径
    const segmentCount = 10;
    const segmentWidth = effectiveWidth / segmentCount;
    const maxYVariation = effectiveHeight * 0.2; // 增加一点Y轴变化
    
    // 使用多个正弦波叠加使路径更自然
    for (let i = 0; i <= segmentCount; i++) {
      currentX = margin + (i * segmentWidth);
      const normalizedI = i / segmentCount;
      
      // 叠加两个不同频率的正弦波
      const yOffset = 
        Math.sin(normalizedI * Math.PI * 2) * maxYVariation * 0.7 +
        Math.sin(normalizedI * Math.PI * 4) * maxYVariation * 0.3;
      
      currentY = (height / 2) + yOffset;
      currentY = Math.max(margin, Math.min(height - margin, currentY));
      points.push({ x: currentX, y: currentY });
    }
    
    // 生成平滑的 SVG 路径，使用三次贝塞尔曲线
    const pathD = points.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x},${point.y}`;
      const prev = points[i - 1];
      
      // 使用更平滑的控制点计算
      const tension = 0.4; // 控制曲线的张力
      const cp1x = prev.x + (point.x - prev.x) * tension;
      const cp1y = prev.y;
      const cp2x = point.x - (point.x - prev.x) * tension;
      const cp2y = point.y;
      
      return `${acc} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${point.x},${point.y}`;
    }, '');
    
    setPath(pathD);
    
    // 根据路径点生成怪物，调整位置以确保在视图内
    const newMonsters = points.map((pos, i) => ({
      id: i,
      position: {
        x: Math.max(margin, Math.min(width - margin, pos.x)),
        y: Math.max(margin, Math.min(height - margin, pos.y))
      },
      state: i < currentCycleIdx ? submissions.find(blog => blog.cycle === i + 1) ? 'damaged' : 'failed' : 
             i === currentCycleIdx ? submissions.find(blog => blog.cycle === i + 1) ? 'damaged' : 'active' : 'standby',
      blogs: submissions.filter((blog) => blog.cycle === i + 1),
    } as Monster));
    
    setMonsters(newMonsters);
    
    // 设置玩家位置
    const currentMonster = newMonsters[currentCycleIdx];
    if (currentMonster) {
      setPlayer({
        x: Math.max(margin, Math.min(width - margin, currentMonster.position.x)),
        y: Math.max(margin, Math.min(height - margin, currentMonster.position.y))
      });
    }
  }, [submissions.length]);

  // 格式化时间
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <motion.div
      ref={mapRef}
      className="relative w-full h-full overflow-x-scroll"
    >
      {/* 路径 */}
      <svg
        className="absolute inset-0 w-[calc(100vw-256px)] h-full pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <path
          d={path}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="4"
        />
      </svg>

      {/* 怪物和玩家 */}
      <div className="relative w-full h-full">
        {monsters.map((monster) => (
          <motion.div
            key={monster.id}
            className="absolute cursor-pointer"
            style={{
              x: monster.position.x - 20,
              y: monster.position.y - 20,
              zIndex: hoveredMonster === monster || selectedMonster === monster ? 1000 : 10
            }}
            onHoverStart={() => !selectedMonster && setHoveredMonster(monster)}
            onHoverEnd={() => !selectedMonster && setHoveredMonster(null)}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMonster(monster);
              setHoveredMonster(null);
            }}
          >
            <div 
              className={`w-10 h-10 rounded-lg relative ${
                monster.state === 'damaged' ? 'bg-green-500/30' :
                monster.state === 'failed' ? 'bg-red-500/30' :
                monster.state === 'active' ? 'bg-yellow-500/30' :
                'bg-gray-500/30'
              }`}
            >
              {monster.state === 'damaged' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                </div>
              )}
              {monster.state === 'failed' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-red-400 rounded-full" />
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* 玩家 */}
        <motion.div
          className="absolute w-10 h-10"
          style={{
            x: player.x - 20,
            y: player.y - 20,
          }}
        >
          <img
            src={avatarUrl}
            alt="Player"
            className="w-full h-full object-contain"
          />
        </motion.div>

      </div>

      {/* 固定侧边信息面板 */}
      {(hoveredMonster || selectedMonster) && (((hoveredMonster?.blogs?.length ?? 0) > 0) || ((selectedMonster?.blogs?.length ?? 0) > 0)) && (
        <motion.div
          initial={{ opacity: 0, x: hoveredMonster?.position.x || selectedMonster?.position.x! > mapRef.current?.clientWidth! / 2 ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`absolute top-4 bottom-4 w-96 rounded-xl border border-white/10 shadow-2xl
            overflow-hidden flex flex-col backdrop-blur-xl transition-colors duration-200
            ${selectedMonster ? 'bg-black' : 'bg-black/75 hover:bg-black/85'}`}
          style={{ 
            zIndex: 1000,
            left: (hoveredMonster?.position.x || selectedMonster?.position.x)! > mapRef.current?.clientWidth! / 2 ? '1rem' : 'auto',
            right: (hoveredMonster?.position.x || selectedMonster?.position.x)! > mapRef.current?.clientWidth! / 2 ? 'auto' : '1rem',
          }}
        >
          {/* Mac 窗口标题栏 */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06] bg-black/30">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            <div className="text-sm text-gray-400 ml-2 flex-1 text-center">
              {`Cycle ${(hoveredMonster || selectedMonster)!.blogs[0].cycle}`}
            </div>
            <div className="w-16" />
          </div>
          
          {/* 内容区域 */}
          <div className="flex-1 overflow-y-auto custom-scrollbar font-sans">
            <div className="p-4">
              <div className="space-y-4">
                {(hoveredMonster || selectedMonster)!.blogs.map((blog, index) => (
                  <div 
                    key={index}
                    className={`rounded-lg bg-white/5 p-4 hover:bg-white/10 transition-colors`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h4 className="font-medium text-white truncate flex-1 text-2xl">
                        {blog.title}
                      </h4>
                      {blog.url && (
                        <a
                          href={blog.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-gray-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                        </a>
                      )}
                    </div>
                    <p className="text-xl text-gray-400 mb-2 line-clamp-2">
                      {blog.description}
                    </p>
                    <div className="text-sm text-gray-500">
                      {formatDate(blog.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
