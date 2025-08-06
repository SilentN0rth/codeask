import { TagChip } from "@/components/ui/tags/TagChip";

export default function QuestionTagList({ tags, removeTag }: any) {
    if (!tags.length) return null;
    return (
        <div className="col-span-full flex flex-wrap gap-2">
            {tags.map((tag: string) => (
                <TagChip key={tag} tag={tag} removeTag={removeTag} />
            ))}
        </div>
    );
}
