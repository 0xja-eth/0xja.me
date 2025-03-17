import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
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
}

interface DungeonMapProps {
  submissions: Array<{
    url: string;
    timestamp: number;
  }>;
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
      blogUrl: submissions[i]?.url
    }));
    
    setMonsters(newMonsters);
    
    // 设置玩家位置
    const currentMonster = newMonsters[submissions.length];
    if (currentMonster) {
      setPlayer(currentMonster.position);
    }
  }, [submissions, mapRef.current]);

  // 生成装饰元素
  const decorations = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    type: ['crystal', 'gear', 'energy-dot', 'circuit'][i % 4],
    position: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      transform: `scale(${0.5 + Math.random() * 0.5})`,
      opacity: 0.3 + Math.random() * 0.4
    }
  }));

  return (
    <div className="dungeon-map" ref={mapRef}>
      {/* 路径 */}
      <svg className="dungeon-path">
        <path d={path} className="path-line" fill="none" />
      </svg>
      
      {/* 装饰 */}
      {decorations.map(dec => (
        <div
          key={dec.id}
          className="dungeon-decoration"
          style={{
            position: 'absolute',
            ...dec.position,
            zIndex: 1,
            pointerEvents: 'none'
          }}
        >
          <img
            src={`/images/dungeon-decorations.svg#${dec.type}`}
            alt="decoration"
            width={32}
            height={32}
          />
        </div>
      ))}
      
      {/* 怪物 */}
      {monsters.map(monster => (
        <motion.div
          key={monster.id}
          className={`mechanical-monster monster-${monster.state}`}
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
            x: monster.position.x - 32,
            y: monster.position.y - 32,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
        >
          <img
            src={`/images/monster-${monster.state}.svg`}
            alt={`Monster ${monster.state}`}
            width={64}
            height={64}
          />
          {monster.blogUrl && (
            <motion.div
              className="blog-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <a
                href={monster.blogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-200 hover:text-purple-100 transition-colors"
              >
                View Blog
              </a>
            </motion.div>
          )}
        </motion.div>
      ))}
      
      {/* 玩家 */}
      <motion.div
        className="player"
        animate={{
          x: player.x - 24,
          y: player.y - 24,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20
        }}
      >
        <motion.img
          src={avatarUrl}
          alt="Player"
          width={48}
          height={48}
          style={{ borderRadius: '50%' }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </div>
  );
};
