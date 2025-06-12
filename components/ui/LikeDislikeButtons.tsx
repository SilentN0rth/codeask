"use client";

import { useState } from "react";
import { Button, Tooltip, addToast } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, useAnimation } from "framer-motion";
import { VoteType } from "@/types/vote.types";
import { LikeDislikeButtonsProps } from "@/types/components.types";

const COOLDOWN_MS = 2000;

const LikeDislikeButtons = ({ initialLikes, initialDislikes }: LikeDislikeButtonsProps) => {
    const [likeCount, setLikeCount] = useState(initialLikes);
    const [dislikeCount, setDislikeCount] = useState(initialDislikes);
    const [userVote, setUserVote] = useState<VoteType>(null);

    // Blokada obu przycisków po kliknięciu
    const [isLikeCooldown, setIsLikeCooldown] = useState(false);
    const [isDislikeCooldown, setIsDislikeCooldown] = useState(false);

    const likeControls = useAnimation();
    const dislikeControls = useAnimation();

    const handleLike = async () => {
        // Disable both buttons immediately
        setIsLikeCooldown(true);
        setIsDislikeCooldown(true);

        await likeControls.start({
            y: [0, 6, 0],
            transition: { duration: 0.3, ease: "easeInOut" },
        });

        if (userVote === "liked") {
            // Jeśli już był „like”, usuwamy polubienie
            setLikeCount((prev) => prev - 1);
            setUserVote(null);
            addToast({
                title: "Usunięto polubienie",
                description: "",
                icon: <Icon icon="solar:like-line-duotone" />,
                color: "default",
            });
        } else if (userVote === "disliked") {
            // Jeśli był „dislike”, zmieniamy na „like”
            setDislikeCount((prev) => prev - 1);
            setLikeCount((prev) => prev + 1);
            setUserVote("liked");
            addToast({
                title: "Polubiono odpowiedź",
                description: "",
                icon: <Icon icon="solar:like-bold" />,
                color: "success",
            });
        } else {
            // Nowe polubienie
            setLikeCount((prev) => prev + 1);
            setUserVote("liked");
            addToast({
                title: "Polubiono odpowiedź",
                description: "",
                icon: <Icon icon="solar:like-bold" />,
                color: "success",
            });
        }

        // Po upływie cooldown odblokuj przyciski
        setTimeout(() => {
            setIsLikeCooldown(false);
            setIsDislikeCooldown(false);
        }, COOLDOWN_MS);
    };

    const handleDislike = async () => {
        // Disable both buttons immediately
        setIsLikeCooldown(true);
        setIsDislikeCooldown(true);

        await dislikeControls.start({
            y: [0, 6, 0],
            transition: { duration: 0.3, ease: "easeInOut" },
        });

        if (userVote === "disliked") {
            // Jeśli już był „dislike”, usuwamy ocenę negatywną
            setDislikeCount((prev) => prev - 1);
            setUserVote(null);
            addToast({
                title: "Usunięto negatywną ocenę",
                description: "",
                icon: <Icon icon="solar:dislike-line-duotone" />,
                color: "default",
            });
        } else if (userVote === "liked") {
            // Jeśli był „like”, zmieniamy na „dislike”
            setLikeCount((prev) => prev - 1);
            setDislikeCount((prev) => prev + 1);
            setUserVote("disliked");
            addToast({
                title: "Nie podoba mi się",
                description: "",
                icon: <Icon icon="solar:dislike-bold" />,
                color: "danger",
            });
        } else {
            // Nowe „dislike”
            setDislikeCount((prev) => prev + 1);
            setUserVote("disliked");
            addToast({
                title: "Nie podoba mi się",
                description: "",
                icon: <Icon icon="solar:dislike-bold" />,
                color: "danger",
            });
        }

        // Po upływie cooldown odblokuj przyciski
        setTimeout(() => {
            setIsLikeCooldown(false);
            setIsDislikeCooldown(false);
        }, COOLDOWN_MS);
    };

    return (
        <div className="flex gap-2">
            {/* Przycisk „Polub” */}
            <Tooltip content="Polub">
                <Button
                    size="sm"
                    variant="light"
                    className={`gap-1 ${userVote === "liked" ? "!bg-success-500 text-white" : "text-success"}`}
                    onPress={handleLike}
                    isDisabled={isLikeCooldown}>
                    <motion.span animate={likeControls} className="inline-flex">
                        <Icon icon="solar:like-line-duotone" className="text-lg" />
                    </motion.span>
                    {likeCount}
                </Button>
            </Tooltip>

            {/* Przycisk „Nie lubię” */}
            <Tooltip content="Nie lubię">
                <Button
                    size="sm"
                    variant="light"
                    className={`gap-1 ${userVote === "disliked" ? "!bg-danger-500 text-white" : "text-danger"}`}
                    onPress={handleDislike}
                    isDisabled={isDislikeCooldown}>
                    <motion.span animate={dislikeControls} className="inline-flex">
                        <Icon icon="solar:dislike-line-duotone" className="text-lg" />
                    </motion.span>
                    {dislikeCount}
                </Button>
            </Tooltip>
        </div>
    );
};

export default LikeDislikeButtons;
