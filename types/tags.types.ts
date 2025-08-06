export interface Tag {
    id: string;
    name: string;
    question_count: number;
    createdAt: string;
}

export interface TagChipProps {
    tag: string;
    removeTag: (tag: string) => void;
}

export interface TagItemProps {
    label: string;
    href?: string;
    onClose?: () => void;
    className?: string;
}
