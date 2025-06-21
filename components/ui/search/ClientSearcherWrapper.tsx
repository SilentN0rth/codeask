"use client";
import LocalQuestionSearcher from "@/components/ui/search/LocalQuestionSearcher";

export default function ClientSearcherWrapper({className}: {
    className?: string;
}) {
    return <LocalQuestionSearcher className={className} />;
}
