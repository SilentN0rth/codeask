import { ActivityItem } from './activity.types';

export interface UserInterface {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar_url: string;
  background_url: string;
  bio?: string;
  specialization?: string;
  is_moderator?: boolean;
  permissions?: string[];
  location?: string;
  website_url?: string;
  twitter_url?: string;
  github_url?: string;
  profile_slug?: string;
  answers_count: number;
  questions_count: number;
  reputation: number;
  followers_count: number;
  following_count: number;
  badges?: {
    gold: number;
    silver: number;
    bronze: number;
    // Specjalne odznaki
    first_question?: boolean;
    first_answer?: boolean;
    helpful_answer?: boolean;
    popular_question?: boolean;
    active_user?: boolean;
    expert?: boolean;
    community_companion?: boolean;
    community_helper?: boolean;
  };
  created_at: string;
  confirmed_at?: string;
  last_sign_in_at?: string;
  updated_at?: string;
  is_online: boolean;
  recent_activity: ActivityItem[];
}
