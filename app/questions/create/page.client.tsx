"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input, Textarea, Form, Button } from "@heroui/react";
import dynamic from "next/dynamic";
import { Icon } from "@iconify/react";
import PageTitle from "@/components/ui/PageTitle";
import LoadingHorizontalDots from "@/components/ui/LoadingHorizontalDots";
import { TagChip } from "@/components/ui/tags/TagChip";
import { createQuestion } from "@/lib/actions/createQuestion.action";
import { CreateQuestionForm, createQuestionSchema } from "@/lib/schemas/create-question.schema";
import { usePathname, useRouter } from "next/navigation";

const DynamicEditor = dynamic(() => import("@/components/TinyMCE/Editor"), {
    ssr: false,
    loading: () => (
        <div className="flex h-24 justify-center rounded-lg border border-divider bg-[#0f1113]">
            <LoadingHorizontalDots />
        </div>
    ),
});

type AskFormProps = {
    mongoUserId: string;
};

export default function CreateQuestion({ mongoUserId }: AskFormProps) {
    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CreateQuestionForm>({
        resolver: zodResolver(createQuestionSchema),
        defaultValues: {
            title: "",
            shortContent: "",
            tags: [],
            content: "",
        },
    });
    const pathname = usePathname();

    const router = useRouter();
    const [tagInput, setTagInput] = useState("");
    const tags = watch("tags");
    const [tagError, setTagError] = useState<string | null>(null);

    const isValidTag = (tag: string): boolean => /^[a-zA-Z0-9]+$/.test(tag);

    const parseAndAddTags = async () => {
        const trimmed = tagInput.trim();
        if (!trimmed) return setTagError(null);

        const currentTags = watch("tags");
        const newTags = trimmed
            .split(/[\s,]+/)
            .map((t) => t.trim().replace(/^#/, "").toLowerCase())
            .filter((t) => t.length > 0);

        for (const tag of newTags) {
            if (!isValidTag(tag)) return setTagError("Tag może zawierać tylko litery i cyfry");
            if (tag.length < 2 || tag.length > 15) return setTagError(`Tag "${tag}" musi mieć 2–15 znaków`);
            if (currentTags.includes(tag)) return setTagError(`Tag "${tag}" został już dodany`);
        }

        const allTags = [...currentTags, ...newTags];
        if (allTags.length > 5) return setTagError("Maksymalnie 5 tagów");

        setValue("tags", allTags, { shouldValidate: true });
        setTagInput("");
        setTagError(null);
    };

    const removeTag = (tagToRemove: string) => {
        const updated = tags.filter((tag) => tag !== tagToRemove);
        setValue("tags", updated, { shouldValidate: true });
        if (updated.length <= 5 && updated.every(isValidTag)) setTagError(null);
    };

    const onValidSubmit = async (data: CreateQuestionForm) => {
        try {
            await createQuestion({
                title: data.title,
                content: data.content,
                tags: data.tags,
                author: JSON.parse(mongoUserId),
                views: 0,
                upvotes: [],
                downvotes: [],
                answers: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                path: pathname,
            });
            router.push("/questions");
        } catch (error) {
            console.error(error);
        }
    };

    const onSubmit = async () => {
        await parseAndAddTags();
        handleSubmit(onValidSubmit)();
    };

    return (
        <Form className="wrapper flex-column gap-y-3">
            <PageTitle title="Utwórz pytanie" className="mb-3" />

            <Controller
                name="title"
                control={control}
                render={({ field }) => (
                    <Input
                        {...field}
                        label="Tytuł pytania (wymagane)"
                        isInvalid={!!errors.title}
                        errorMessage={errors.title?.message}
                    />
                )}
            />

            <Controller
                name="shortContent"
                control={control}
                render={({ field }) => (
                    <Textarea
                        {...field}
                        label="Krótki opis pytania (opcjonalne)"
                        maxRows={8}
                        isInvalid={!!errors.shortContent}
                        errorMessage={errors.shortContent?.message}
                    />
                )}
            />

            <div data-error={!!errors.content} className="w-full">
                <DynamicEditor
                    hasError={!!errors.content}
                    onContentChange={(html: string) => setValue("content", html, { shouldValidate: true })}
                />
                {errors.content && <div className="p-1 text-tiny font-light text-danger">{errors.content.message}</div>}
            </div>

            <div className="grid w-full grid-cols-[1fr,auto] gap-3">
                <Input
                    label="Tagi (wymagane)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            parseAndAddTags();
                        }
                    }}
                    isInvalid={!!errors.tags || !!tagError}
                    errorMessage={errors.tags?.message || tagError || ""}
                    endContent={
                        <Button
                            variant="light"
                            radius="sm"
                            className="-mb-1 -mr-1.5 !min-w-fit text-cTextDark-100 hover:bg-cBgDark-700">
                            <Icon icon="mdi:plus" className="size-5" />
                        </Button>
                    }
                />
                <Button type="button" color="primary" variant="solid" className="h-14" onPress={onSubmit}>
                    Zadaj pytanie
                </Button>
                {tags.length > 0 && (
                    <div className="col-span-full flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <TagChip key={tag} tag={tag} removeTag={removeTag} />
                        ))}
                    </div>
                )}
            </div>
        </Form>
    );
}
