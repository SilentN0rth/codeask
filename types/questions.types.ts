import { AnswerCardProps } from './answers.types';
import { Tag } from './tags.types';
import { UserInterface } from './users.types';

export interface QuestionCardProps {
  id: string;
  title: string;
  content: string;
  short_content: string;
  question_slug: string;
  created_at: string;
  updated_at: string;
  likes_count: number;
  unlikes_count: number;
  views_count: number;
  author: UserInterface;
  status: 'opened' | 'closed' | 'archived';
  answers_count: number;
  answers: AnswerCardProps[] | [];
  tags?: Tag[];
  savedQuestionIds?: string[];
  showAuthor?: boolean;
}
