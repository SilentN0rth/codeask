import SlideUpText from '@/components/ui/effects/SlideUpText';
import { getLocalTimeString } from '@/lib/utils/getLocalTimeString';

export default function QuestionEditInfo({
  questionUpdatedAt,
}: {
  questionUpdatedAt: string;
}) {
  if (!questionUpdatedAt) return null;

  return (
    <p className="text-right text-sm text-default-600">
      Edytowano:&nbsp;
      <SlideUpText className="text-default-500">
        {getLocalTimeString(questionUpdatedAt)}
      </SlideUpText>
    </p>
  );
}
