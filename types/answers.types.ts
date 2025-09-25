import { ReactNode } from 'react';

export interface AnswerCardProps {
  id: string;
  author_id: string;
  avatar: string;
  date: string;
  content: ReactNode;
  created_at: string;
  updated_at: string;
  likes_count: number;
  updates_count: number;
  dislikes_count: number;
}
