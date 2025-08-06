import dynamic from "next/dynamic";
import LoadingHorizontalDots from "@/components/ui/LoadingHorizontalDots";

const DynamicEditor = dynamic(() => import("@/components/TinyMCE/Editor"), {
    ssr: false,
    loading: () => (
        <div className="flex h-24 justify-center rounded-lg border border-divider bg-[#0f1113]">
            <LoadingHorizontalDots />
        </div>
    ),
});

export default function QuestionEditor({ value, setValue, error, errorMessage }: any) {
    return (
        <div data-error={error} className="w-full">
            <DynamicEditor
                isSubmitting={false}
                value={value}
                onContentChange={(html: string) => setValue("content", html, { shouldValidate: true })}
                hasError={error}
            />
            {errorMessage && <p className="p-1 text-tiny font-light text-danger">{errorMessage}</p>}
        </div>
    );
}
