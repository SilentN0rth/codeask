import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Textarea } from '@heroui/react';
import { CreateQuestionForm } from '@/lib/schemas/create-question.schema';

interface QuestionShortContentTextareaProps {
  control: Control<CreateQuestionForm>;
  errors: FieldErrors<CreateQuestionForm>;
}

export default function QuestionShortContentTextarea({
  control,
  errors,
}: QuestionShortContentTextareaProps) {
  return (
    <Controller
      name="shortContent"
      control={control}
      render={({ field }) => (
        <Textarea
          {...field}
          label="Krótki opis pytania"
          maxRows={8}
          isInvalid={!!errors.shortContent}
          errorMessage={errors.shortContent?.message}
          classNames={{
            inputWrapper:
              'bg-cBgDark-700 group-hover:bg-cBgDark-700/50 group-data-[focus=true]:bg-cBgDark-700/50 border border-divider',
          }}
        />
      )}
    />
  );
}
