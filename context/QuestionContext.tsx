// "use client";
// import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import { useParams } from "next/navigation";
// import { QuestionCardProps } from "@/types/questions.types";
// import { getQuestionById } from "@/lib/actions/getQuestionById";

// type QuestionContextType = {
//     question: QuestionCardProps | null;
//     loading: boolean;
// };

// const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

// export const QuestionProvider = ({ children }: { children: ReactNode }) => {
//     const [question, setQuestion] = useState<QuestionCardProps | null>(null);
//     const [loading, setLoading] = useState(true);
//     const params = useParams();
//     const questionId = params?.slug as string;

//     useEffect(() => {
//         const fetchQuestion = async () => {
//             if (!questionId) return;
//             setLoading(true);
//             const data = await getQuestionById(questionId);
//             setQuestion(data);
//             setLoading(false);
//         };

//         fetchQuestion();
//     }, [questionId]);

//     return <QuestionContext.Provider value={{ question, loading }}>{children}</QuestionContext.Provider>;
// };

// export const useQuestion = () => {
//     const context = useContext(QuestionContext);
//     if (context === undefined) {
//         throw new Error("useQuestion must be used within a QuestionProvider");
//     }
//     return context;
// };
