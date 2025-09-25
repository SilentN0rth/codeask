'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@heroui/react';
import { useRouter } from 'next/navigation';
import {
  CreateQuestionForm,
  createQuestionSchema,
} from '@/lib/schemas/create-question.schema';
import { updateQuestion } from '@/services/client/questions';
import QuestionTitleInput from '@/components/layout/Questions/QuestionTitleInput';
import QuestionShortContentTextarea from '@/components/layout/Questions/QuestionShortContentTextarea';
import QuestionEditor from '@/components/layout/Questions/QuestionEditor';
import QuestionTagsInput from '@/components/layout/Questions/QuestionTagsInput';
import QuestionTagList from '@/components/layout/Questions/QuestionTagList';
import PageTitle from '@/components/ui/PageTitle';
import { motion } from 'framer-motion';
import { useFadeIn } from '@/lib/animations/useFadeIn';
import { QuestionCardProps } from '@/types/questions.types';

interface EditQuestionFormProps {
  question: QuestionCardProps;
  userId: string;
}

export default function EditQuestionForm({
  question,
  userId,
}: EditQuestionFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitted },
  } = useForm<CreateQuestionForm>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      title: question.title,
      shortContent: question.short_content,
      tags: question.tags?.map((tag) => tag.name) ?? [],
      content: question.content,
    },
  });

  const router = useRouter();
  const [tagInput, setTagInput] = useState('');
  const [tagError, setTagError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const tags = watch('tags');

  useEffect(() => {
    setValue('title', question.title);
    setValue('shortContent', question.short_content);
    setValue('content', question.content);
    setValue('tags', question.tags?.map((tag) => tag.name) ?? []);
  }, [question, setValue]);

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
      const result = await updateQuestion({
        id: question.id,
        title: data.title,
        content: data.content,
        short_content: data.shortContent,
        tags: data.tags,
        authorId: userId,
      });

      if (result.success) {
        router.push(`/questions/${result.questionSlug}`);
      } else {
        setServerError(
          'Nie udało się zaktualizować pytania. Spróbuj ponownie.'
        );
      }
    } catch {
      setServerError('Nie udało się zaktualizować pytania. Spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = handleSubmit(() => {
    const success = parseAndAddTags();
    if (!success.success) return;
    void handleSubmit(onValidSubmit)();
  });

  const titleAnimation = useFadeIn(30, 0.4);
  const formAnimation = useFadeIn(40, 0.6);

  return (
    <motion.div
      className="wrapper flex-column gap-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div {...titleAnimation}>
        <PageTitle
          title="Edytuj pytanie"
          icon="mdi:pencil"
          description="Modyfikuj treść swojego pytania"
          className="mb-3"
        />
      </motion.div>

      <motion.div {...formAnimation}>
        <Form
          onSubmit={() => void onSubmit()}
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
            isEditing
          />
          <QuestionTagList tags={tags} removeTag={removeTag} />
          {serverError && (
            <p className="mt-2 font-medium text-danger text-small">
              {serverError}
            </p>
          )}
        </Form>
      </motion.div>
    </motion.div>
  );
}
