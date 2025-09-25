import { ReactNode, ElementType } from 'react';

export interface ExpandableTextProps {
  children: ReactNode;
  icon?: ReactNode;
  as?: ElementType;
  clamp?: 'line-clamp-1' | 'line-clamp-2' | 'line-clamp-3';
  className?: string;
  textClassName?: string;
}

export interface TextProps {
  as: ElementType;
  children: ReactNode;
  className?: string;
}

export interface SlideUpTextProps {
  children: ReactNode;
  duration?: number;
  delay?: number;
  distance?: number;
  className?: string;
}

export interface LikeDislikeButtonsProps {
  initialLikes: number;
  initialDislikes: number;
  questionId?: string;
  answerId?: string;
  onVoteChange?: (likes: number, dislikes: number) => void;
}
