'use client';

interface PlaceholderIconProps {
  text: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function PlaceholderIcon({ text, color = "white", size = 'md' }: PlaceholderIconProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`w-full h-full flex items-center justify-center ${sizeClasses[size]}`}
         style={{ color, backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: '50%'}}>
      {text.slice(0, 2)}
    </div>
  );
}
