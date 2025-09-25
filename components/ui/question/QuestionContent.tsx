import { SvgIcon } from '@/lib/utils/icons';

const QuestionContent = ({
  title,
  content,
  status,
}: {
  title: string;
  content: string;
  status: 'opened' | 'closed' | 'archived';
}) => {
  return (
    <div className="flex-column question-content w-full gap-4">
      <div className="mb-4 flex items-center gap-3">
        <h1
          className="before:bg-cCta-500 relative pl-3 text-3xl font-semibold before:absolute before:inset-0 before:h-full before:w-0.5 before:content-['']"
          style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
        >
          {title}
        </h1>
        {status !== 'opened' && (
          <div
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${
              status === 'closed'
                ? 'border border-red-500/30 bg-red-500/20 text-red-400'
                : 'border border-yellow-500/30 bg-yellow-500/20 text-yellow-400'
            }`}
          >
            <SvgIcon
              icon={status === 'closed' ? 'mdi:lock' : 'mdi:archive'}
              className="size-3"
            />
            {status === 'closed' ? 'Zamknięte' : 'Zarchiwizowane'}
          </div>
        )}
      </div>
      <div
        className="html-content"
        style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default QuestionContent;
