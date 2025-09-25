'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@heroui/react';
import { useRouter } from 'next/navigation';
import {
  CreateQuestionForm,
  createQuestionSchema,
} from '@/lib/schemas/create-question.schema';
import { createQuestion } from '@/services/client/questions';
import QuestionTitleInput from './QuestionTitleInput';
import QuestionShortContentTextarea from './QuestionShortContentTextarea';
import QuestionEditor from './QuestionEditor';
import QuestionTagsInput from './QuestionTagsInput';
import QuestionTagList from './QuestionTagList';

export default function QuestionForm({ userId }: { userId: string }) {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitted },
  } = useForm<CreateQuestionForm>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      title: '',
      shortContent: '',
      tags: [],
      content: '',
    },
  });

  const router = useRouter();
  const [tagInput, setTagInput] = useState('');
  const [tagError, setTagError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const tags = watch('tags');

  const isValidTag = (tag: string): boolean => /^[a-zA-Z0-9]+$/.test(tag);

  const parseAndAddTags = (): {
    success: boolean;
    wasModified: boolean;
  } => {
    const trimmed = tagInput.trim();
    if (!trimmed) return { success: true, wasModified: false };

    const currentTags = watch('tags');
    const newTags = trimmed
      .split(/[\s,]+/)
      .map((t) => t.trim().replace(/^#/, '').toLowerCase())
      .filter((t) => t.length > 0);

    for (const tag of newTags) {
      if (!isValidTag(tag)) {
        setTagError('Tag może zawierać tylko litery i cyfry');
        return { success: false, wasModified: false };
      }
      if (tag.length < 2 || tag.length > 15) {
        setTagError(`Tag "${tag}" musi mieć 2–15 znaków`);
        return { success: false, wasModified: false };
      }
      if (currentTags.includes(tag)) {
        setTagError(`Tag "${tag}" został już dodany`);
        return { success: false, wasModified: false };
      }
    }

    const allTags = [...currentTags, ...newTags];
    if (allTags.length > 5) {
      if (tagInput.trim() !== '') {
        setTagError('Maksymalnie 5 tagów');
        return { success: false, wasModified: false };
      }
    }

    setValue('tags', allTags, { shouldValidate: true });
    setTagInput('');
    setTagError(null);
    return { success: true, wasModified: true };
  };

  const removeTag = (tagToRemove: string) => {
    const updated = tags.filter((tag) => tag !== tagToRemove);
    setValue('tags', updated, { shouldValidate: true });
    if (updated.length <= 5 && updated.every(isValidTag)) setTagError(null);
  };

  const onValidSubmit = async (data: CreateQuestionForm) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await createQuestion({
        title: data.title,
        content: data.content,
        short_content: data.shortContent,
        tags: data.tags,
        authorId: userId,
      });
      router.push('/questions');
    } catch {
      setServerError('Nie udało się utworzyć pytania. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const success = parseAndAddTags();
    if (!success.success) return;
    await onValidSubmit(data);
  });

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit();
      }}
      className="flex flex-col gap-y-3"
    >
      <QuestionTitleInput control={control} errors={errors} />
      <QuestionShortContentTextarea control={control} errors={errors} />
      <QuestionEditor
        value={watch('content')}
        setValue={setValue}
        error={isSubmitted && !!errors.content}
        errorMessage={errors.content?.message}
      />
      <QuestionTagsInput
        tagInput={tagInput}
        setTagInput={setTagInput}
        parseAndAddTags={() => void parseAndAddTags()}
        error={!!errors.tags || !!tagError}
        errorMessage={errors.tags?.message ?? tagError ?? ''}
        isLoading={isLoading}
        isEditing={false}
      />
      <QuestionTagList tags={tags} removeTag={removeTag} />
      {serverError && (
        <p className="mt-2 font-medium text-danger text-small">{serverError}</p>
      )}
    </Form>
  );
}
