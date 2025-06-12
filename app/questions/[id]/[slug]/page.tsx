"use client";
import QuestionContent from "@/components/ui/question/QuestionContent";
import QuestionHeader from "@/components/ui/question/QuestionHeader";
import QuestionMeta from "@/components/ui/question/QuestionMeta.tsx";
import QuestionTags from "@/components/ui/question/QuestionTags";
import Answers from "@/components/ui/answers/Answers";
import { Button, Divider,  Tooltip } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useRef, useEffect } from "react";

const Page = () => {
    const [isSticky, setIsSticky] = useState(true);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [userToggledSticky, setUserToggledSticky] = useState(false);
    const [isTooltipDisabled, setIsTooltipDisabled] = useState(false);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const onScroll = () => {
            setHasScrolled(window.scrollY > 10);
            if (window.scrollY === 0 && !userToggledSticky) {
                setIsSticky(true);
            }
            setIsTooltipDisabled(true);

            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            scrollTimeoutRef.current = setTimeout(() => {
                setIsTooltipDisabled(false);
            }, 200);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [userToggledSticky]);

    const handleHide = () => {
        setIsAnimatingOut(true);
    };

    const handleShow = () => {
        setIsSticky(true);
        setUserToggledSticky(false);
    };

    const handleAnimationComplete = () => {
        if (isAnimatingOut) {
            setIsAnimatingOut(false);
            setIsSticky(false);
            setUserToggledSticky(true);
        }
    };

    const shouldStick = isSticky || isAnimatingOut;
    return (
        <article className="flex-column w-full gap-5">
            <motion.div
                initial={false}
                animate={{
                    y: isAnimatingOut ? -80 : 0,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                onAnimationComplete={handleAnimationComplete}
                className={`
    ${shouldStick ? "sticky top-[90px]" : "static"}
    left-0 z-10 flex  flex-col gap-4 
    bg-cBgDark-900/60 pt-4 backdrop-blur-md
  `}>
                <AnimatePresence>
                    {(hasScrolled || !shouldStick) && (
                        <motion.div
                            key="toggle-button"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.25 }}
                            className="absolute inset-x-1/2 -bottom-4 z-[1000] -translate-x-1/2">
                            {shouldStick ? (
                                <Tooltip content="Schowaj menu" placement="top" isDisabled={isTooltipDisabled}>
                                    <Button
                                        size="sm"
                                        onPress={handleHide}
                                        className="border border-divider bg-cBgDark-900">
                                        <Icon icon="iconamoon:arrow-up-2-bold" className="text-xl" />
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip content="Pokaż podążające menu" placement="top" isDisabled={isTooltipDisabled}>
                                    <Button
                                        size="sm"
                                        onPress={handleShow}
                                        className="border border-divider bg-cBgDark-900">
                                        <Icon icon="iconamoon:arrow-down-2-bold" className="text-xl" />
                                    </Button>
                                </Tooltip>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="wrapper flex flex-col gap-4">
                    <QuestionHeader />
                    <QuestionMeta />
                    <Divider />
                </div>
            </motion.div>
            <div className="wrapper flex-column w-full gap-5">
                <div className="flex flex-col gap-4">
                    <QuestionTags />
                    <QuestionContent />
                </div>
                <Divider />
                <div id="answers" className="flex w-full flex-col items-start justify-start">
                    <h2 className="relative mb-4 pl-3 text-base font-semibold before:absolute before:inset-0 before:h-full before:w-0.5 before:bg-cCta-500 before:content-['']">
                        Odpowiedz na pytanie!
                    </h2>
                    <Answers />
                </div>
            </div>
        </article>
    );
};

export default Page;
