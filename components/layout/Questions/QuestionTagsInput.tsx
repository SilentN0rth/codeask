import { Input, Button } from "@heroui/react";
import { SvgIcon } from "@/lib/utils/icons";

export default function QuestionTagsInput({
    tagInput,
    setTagInput,
    parseAndAddTags,
    error,
    errorMessage,
    isLoading,
}: any) {
    return (
        <div className="grid w-full grid-cols-[1fr,auto] gap-3">
            <Input
                label="Tagi"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        parseAndAddTags();
                    }
                }}
                isInvalid={error}
                errorMessage={errorMessage}
                classNames={{
                    inputWrapper:
                        "bg-cBgDark-700 group-hover:bg-cBgDark-700/50 group-data-[focus=true]:bg-cBgDark-700/50 border border-divider",
                }}
                endContent={
                    <Button
                        variant="light"
                        radius="sm"
                        className="-mb-1 -mr-1.5 !min-w-fit text-cTextDark-100 hover:bg-cBgDark-700"
                        onPress={parseAndAddTags}>
                        <SvgIcon icon="mdi:plus" className="size-5" />
                    </Button>
                }
            />
            <Button type="submit" color="primary" variant="solid" className="h-14" isLoading={isLoading}>
                Zadaj pytanie
            </Button>
        </div>
    );
}
