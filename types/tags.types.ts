export interface TagCardInterface {
    id: string;
    name: string;
    questionCount: number;
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
export interface Tag {
    _id: string;
    name: string;
    popularity: number;
    createdAt: string;
}
