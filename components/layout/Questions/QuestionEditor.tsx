import dynamic from 'next/dynamic';
import Loading from '@/components/ui/Loading';
import { UseFormSetValue } from 'react-hook-form';
import { CreateQuestionForm } from '@/lib/schemas/create-question.schema';

const DynamicEditor = dynamic(() => import('@/components/TinyMCE/Editor'), {
  ssr: false,
  loading: () => (
    <div className="flex h-24 justify-center rounded-lg border border-divider bg-[#0f1113]">
      <Loading />
    </div>
  ),
});

export default function QuestionEditor({
  value,
  setValue,
  error,
  errorMessage,
}: {
  value: string;
  setValue: UseFormSetValue<CreateQuestionForm>;
  error: boolean;
  errorMessage?: string;
}) {
  return (
    <div data-error={error} className="w-full">
      <DynamicEditor
        isSubmitting={false}
        value={value}
        onContentChange={(html: string) =>
          setValue('content', html, { shouldValidate: true })
        }
        hasError={error}
      />
      {errorMessage && (
        <p className="p-1 font-light text-danger text-tiny">{errorMessage}</p>
      )}
    </div>
  );
}
