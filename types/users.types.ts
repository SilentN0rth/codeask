export interface UserInterface {
    id: string;
    name: string;
    avatarUrl: string;
    bio?: string;
    role?: string;
    createdAt: string;
    answersCount: number;
    questionsCount: number;
    reputation: number;
}
