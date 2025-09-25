import { Controller, Control, FieldErrors } from 'react-hook-form';
import { Input } from '@heroui/react';
import { CreateQuestionForm } from '@/lib/schemas/create-question.schema';

interface QuestionTitleInputProps {
  control: Control<CreateQuestionForm>;
  errors: FieldErrors<CreateQuestionForm>;
}

export default function QuestionTitleInput({
  control,
  errors,
}: QuestionTitleInputProps) {
  return (
    <Controller
      name="title"
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          label="Tytuł pytania"
          isInvalid={!!errors.title}
          errorMessage={errors.title?.message}
          classNames={{
            inputWrapper:
              'bg-cBgDark-700 group-hover:bg-cBgDark-700/50 group-data-[focus=true]:bg-cBgDark-700/50 border border-divider',
          }}
        />
      )}
    />
  );
}
