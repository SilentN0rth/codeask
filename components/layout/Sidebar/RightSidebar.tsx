import { QuestionCardProps } from '@/types/questions.types';
import { Tag } from '@/types/tags.types';
import RightSidebarContent from './RightSidebarContent';

const RightSidebar = ({
  questions,
  tags,
}: {
  questions: QuestionCardProps[];
  tags: Tag[];
}) => {
  return (
    <aside
      className="sidebar flex-column invisible-scroll !hidden !justify-start border-l border-divider md:!hidden 3xl:!flex 3xl:w-[400px]"
      aria-label="Prawy panel boczny"
    >
      <RightSidebarContent questions={questions} tags={tags} />
    </aside>
  );
};

export default RightSidebar;
