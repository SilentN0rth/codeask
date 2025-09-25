export type ActivityType =
  | 'question'
  | 'answer'
  | 'like'
  | 'dislike'
  | 'report'
  | 'badge'
  | 'joined'
  | 'comment'
  | 'follow'
  | 'mention';

export interface ActivityItem {
  user_id: string;
  type: ActivityType;
  description: string;
  timestamp: string;
}
