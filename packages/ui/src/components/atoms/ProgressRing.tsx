import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface ProgressRingProps {
  progress: number; // 0 to 100
  radius?: number;
  strokeWidth?: number;
  colorClass?: string;
  className?: string;
  children?: React.ReactNode;
}

export function ProgressRing({
  progress,
  radius = 40,
  strokeWidth = 6,
  colorClass = "text-primary",
  className,
  children
}: ProgressRingProps) {
  const [offset, setOffset] = useState(0);
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  useEffect(() => {
    // Math: strokeDashoffset = circumference - (progress / 100) * circumference
    const progressOffset = circumference - (progress / 100) * circumference;
    setOffset(progressOffset);
  }, [setOffset, circumference, progress, offset]);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          className="text-muted"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <motion.circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn("transition-colors duration-300", colorClass)}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
