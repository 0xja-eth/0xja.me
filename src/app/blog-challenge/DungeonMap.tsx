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
  state: 'standby' | 'active' | 'damaged';
  blogUrl?: string;
  submission?: BlogSubmission;
}

interface DungeonMapProps {
  submissions: BlogSubmission[];
  currentCycle: number;
  avatarUrl: string;
}

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

  // 拖拽状态
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 生成地下城路径
  useEffect(() => {
    if (!mapRef.current) return;
    
    const width = mapRef.current.clientWidth - 100;
    const height = mapRef.current.clientHeight - 100;
    
    // 生成蜿蜒的路径点
    const points: Position[] = [];
    let x = 50;
    let y = height / 2;
    
    for (let i = 0; i < 10; i++) {
      x += width / 10;
      y += (Math.random() * 0.4 - 0.2) * height;
      points.push({ x, y });
    }
    
    // 生成 SVG 路径
    const pathD = points.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x},${point.y}`;
      const prev = points[i - 1];
      const cpx1 = prev.x + (point.x - prev.x) / 3;
      const cpx2 = prev.x + (point.x - prev.x) * 2 / 3;
      return `${acc} C ${cpx1},${prev.y} ${cpx2},${point.y} ${point.x},${point.y}`;
    }, '');
    
    setPath(pathD);
    
    // 根据路径点生成怪物
    const newMonsters = points.map((pos, i) => ({
      id: i,
      position: pos,
      state: i < submissions.length ? 'damaged' : 
             i === submissions.length ? 'active' : 'standby',
      blogUrl: submissions[i]?.url || '',
      submission: submissions[i]
    } as Monster));
    
    setMonsters(newMonsters);
    
    // 设置玩家位置
    const currentMonster = newMonsters[submissions.length];
    if (currentMonster) {
      setPlayer(currentMonster.position);
    }
  }, [submissions.length]);

  // 格式化时间
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  return (
    <motion.div 
      ref={mapRef}
      className="w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing"
      drag
      dragConstraints={mapRef}
      style={{ x, y }}
    >
      {/* 路径 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <path
          d={path}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="4"
          fill="none"
        />
      </svg>

      {/* 怪物和玩家 */}
      {monsters.map((monster) => (
        <motion.div
          key={monster.id}
          className="absolute"
          style={{
            x: monster.position.x - 20,
            y: monster.position.y - 20,
          }}
          onHoverStart={() => setHoveredMonster(monster)}
          onHoverEnd={() => setHoveredMonster(null)}
        >
          <div 
            className={`w-10 h-10 rounded-lg relative ${
              monster.state === 'damaged' ? 'bg-green-500/30' :
              monster.state === 'active' ? 'bg-yellow-500/30' :
              'bg-gray-500/30'
            }`}
          >
            {monster.state === 'damaged' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-green-400 rounded-full" />
              </div>
            )}
          </div>

          {/* 悬停提示框 */}
          {hoveredMonster === monster && monster.submission && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-12 top-0 w-64 bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-gray-800 z-50"
            >
              <h4 className="text-lg font-bold text-white mb-2 truncate">
                {monster.submission.title}
              </h4>
              <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                {monster.submission.description}
              </p>
              <div className="text-xs text-gray-500">
                {formatDate(monster.submission.timestamp)}
              </div>
              {monster.blogUrl && (
                <a
                  href={monster.blogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block text-sm text-blue-400 hover:text-blue-300 truncate"
                >
                  查看文章
                </a>
              )}
            </motion.div>
          )}
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
    </motion.div>
  );
};
