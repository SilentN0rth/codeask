import { Controller } from "react-hook-form";
import { Input } from "@heroui/react";

export default function QuestionTitleInput({ control, errors }: any) {
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
                            "bg-cBgDark-700 group-hover:bg-cBgDark-700/50 group-data-[focus=true]:bg-cBgDark-700/50 border border-divider",
                    }}
                />
            )}
        />
    );
}
