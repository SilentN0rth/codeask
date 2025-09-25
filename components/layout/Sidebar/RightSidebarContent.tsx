import ClientRightSidebarContent from './ClientRightSidebarContent';
import { QuestionCardProps } from '@/types/questions.types';
import { Tag } from '@/types/tags.types';

const RightSidebarContent = ({
  questions,
  tags,
  onClose,
}: {
  questions: QuestionCardProps[];
  tags: Tag[];
  onClose?: () => void;
}) => {
  return (
    <ClientRightSidebarContent
      questions={questions}
      tags={tags}
      onClose={onClose}
    />
  );
};

export default RightSidebarContent;
