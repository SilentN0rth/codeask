import { Controller } from "react-hook-form";
import { Textarea } from "@heroui/react";

export default function QuestionShortContentTextarea({ control, errors }: any) {
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
                            "bg-cBgDark-700 group-hover:bg-cBgDark-700/50 group-data-[focus=true]:bg-cBgDark-700/50 border border-divider",
                    }}
                />
            )}
        />
    );
}
