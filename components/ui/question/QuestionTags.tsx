import TagLink from "@/components/ui/tags/TagLink";

const QuestionTags = () => {
    const tags = ["HTML", "React", "NextJS", "CSS"];
    return (
        <div className="flex flex-wrap gap-2">
            {tags.map((item) => (
                <TagLink item={item} key={item} />
            ))}
        </div>
    );
};

export default QuestionTags;
