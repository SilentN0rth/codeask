import TagLink from '@/components/ui/tags/TagLink';
import { Tag } from '@/types/tags.types';

const QuestionTags = ({ tags }: { tags?: Tag[] }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <TagLink tag={tag} key={tag.id} />
      ))}
    </div>
  );
};

export default QuestionTags;
