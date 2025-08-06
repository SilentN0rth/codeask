const QuestionContent = ({ title, content }: { title: string; content: string }) => (
    <div className="flex-column w-full gap-4">
        <h1 className="relative mb-4 break-all pl-3 text-3xl font-semibold before:absolute before:inset-0 before:h-full before:w-0.5 before:bg-cCta-500 before:content-['']">
            {title}
        </h1>
        <div className="break-all" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
);

export default QuestionContent;
