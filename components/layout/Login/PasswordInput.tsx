import { SvgIcon } from "@/lib/utils/icons";
import { Button, Input } from "@heroui/react";

import { Controller } from "react-hook-form";

export default function PasswordInput({
    control,
    name,
    label,
    error,
    className,
    showPassword,
    setShowPassword,
}: {
    className?: string;
    control: any;
    name: string;
    label: string;
    error?: string;
    showPassword: boolean;
    setShowPassword: (val: boolean) => void;
}) {
    return (
        <Controller
            name={name}
            control={control}
            rules={{ required: `${label} jest wymagane` }}
            render={({ field }) => (
                <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    label={label}
                    className={className}
                    classNames={{
                        inputWrapper:
                            "bg-cBgDark-700 group-hover:bg-cBgDark-700/50 group-data-[focus=true]:bg-cBgDark-700/50 border border-divider",
                    }}
                    isInvalid={!!error}
                    errorMessage={error}
                    endContent={
                        <Button
                            disableAnimation
                            disableRipple
                            className={`min-w-fit bg-transparent pr-2 pt-2 focus:outline-none ${
                                error ? "text-red-500" : "text-default-400"
                            }`}
                            onPress={() => setShowPassword(!showPassword)}>
                            <SvgIcon icon={showPassword ? "mdi:eye-off" : "mdi:eye"} className="size-5" />
                        </Button>
                    }
                />
            )}
        />
    );
}
